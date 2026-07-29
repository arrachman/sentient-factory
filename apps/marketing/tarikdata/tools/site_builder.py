"""Dependency-free static-site composer and blocking HTML validator.

Route registry contract: src/data/routes.py exports ROUTES, a list of mappings.
Each route requires route, page, title, description, canonical, lang, og_image,
twitter_card, and indexable. Additional mapping keys are available as {{slots}}.
"""
from __future__ import annotations

import html
import importlib.util
import re
import shutil
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

TOKEN = re.compile(r"{{\s*([A-Za-z_][A-Za-z0-9_]*)\s*}}")
INCLUDE = re.compile(r"\[\[([A-Z][A-Z0-9_]*)\]\]")
REQUIRED = ("route", "page", "title", "description", "canonical", "lang", "og_image", "twitter_card", "indexable")
INCLUDE_FILES = {"CONTACT_FORM": "components/contact-form.html"}
SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"


class BuildError(ValueError):
    pass


class DocumentParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.tags: list[tuple[str, dict[str, str]]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.tags.append((tag, {name: value or "" for name, value in attrs}))


def read_routes(source: Path) -> list[dict[str, Any]]:
    registry = source / "data" / "routes.py"
    spec = importlib.util.spec_from_file_location("tarikdata_routes", registry)
    if spec is None or spec.loader is None:
        raise BuildError(f"cannot load route registry: {registry}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    routes = getattr(module, "ROUTES", None)
    if not isinstance(routes, list):
        raise BuildError("route registry must export ROUTES as a list")
    return [dict(route) for route in routes]


def render(template: str, values: dict[str, Any], name: str) -> str:
    def substitute(match: re.Match[str]) -> str:
        key = match.group(1)
        if key not in values:
            raise BuildError(f"{name}: unresolved template slot {key}")
        return str(values[key])

    output = TOKEN.sub(substitute, template)
    if TOKEN.search(output):
        raise BuildError(f"{name}: unresolved template token")
    return output


def include_fragments(template: str, source: Path, name: str) -> str:
    def substitute(match: re.Match[str]) -> str:
        marker = match.group(1)
        relative = INCLUDE_FILES.get(marker)
        if relative is None:
            raise BuildError(f"{name}: unresolved include marker {marker}")
        fragment = source / relative
        if not fragment.is_file():
            raise BuildError(f"{name}: missing include fragment {relative}")
        return fragment.read_text()

    output = INCLUDE.sub(substitute, template)
    if INCLUDE.search(output):
        raise BuildError(f"{name}: unresolved include marker")
    return output


def page_document(body: str, header: str, footer: str, route: dict[str, Any]) -> str:
    head = "\n".join((
        f"<title>{html.escape(route['title'])}</title>",
        f'<meta name="description" content="{html.escape(route["description"])}">',
        f'<link rel="canonical" href="{html.escape(route["canonical"])}">',
        f'<meta property="og:title" content="{html.escape(route["title"])}">',
        f'<meta property="og:image" content="{html.escape(route["og_image"])}">',
        f'<meta name="twitter:card" content="{html.escape(route["twitter_card"])}">',
    ))
    return f'<!doctype html>\n<html lang="{html.escape(route["lang"])}">\n<head>{head}</head>\n<body>{header}{body}{footer}</body>\n</html>\n'


def compose_document(template: str, body: str, header: str, footer: str, route: dict[str, Any]) -> str:
    document = page_document(body, header, footer, route)
    if template == "":
        return document
    head = document.split("<head>", 1)[1].split("</head>", 1)[0]
    values = {**route, "head": head, "body": body, "header": header, "footer": footer}
    return render(template, values, "document fragment")


def destination(dist: Path, route: str) -> Path:
    if route == "/":
        return dist / "index.html"
    if route.endswith(".html"):
        return dist / route.strip("/")
    return dist / route.strip("/") / "index.html"


def normalise_route(path: str) -> str:
    """Directory routes carry a trailing slash; file routes keep their extension."""
    return path if path.endswith(".html") else path.rstrip("/") + "/"


def local_path(value: str) -> str | None:
    parsed = urlparse(value)
    if parsed.scheme or parsed.netloc or value.startswith("#"):
        return None
    return parsed.path


def local_asset_exists(source: Path, path: str) -> bool:
    static_asset = source.parent / path.lstrip("/")
    if static_asset.is_file():
        return True
    generated_sources = {
        "/assets/base.css": (
            "foundations.css", "navigation.css", "components.css",
            "responsive-content.css", "forms.css",
        ),
        "/assets/site.js": ("site.js",),
    }
    names = generated_sources.get(path)
    return bool(names) and all((source / "assets" / name).is_file() for name in names)


def validate_document(document: str, route: dict[str, Any], source: Path, outputs: set[str]) -> list[str]:
    errors: list[str] = []
    name = route["route"]
    if TOKEN.search(document):
        errors.append(f"{name}: unresolved template")
    parser = DocumentParser()
    parser.feed(document)
    ids = [attrs["id"] for _, attrs in parser.tags if attrs.get("id")]
    duplicate = [item for item, count in Counter(ids).items() if count > 1]
    if duplicate:
        errors.append(f"{name}: duplicate id {', '.join(sorted(duplicate))}")
    if sum(tag == "main" for tag, _ in parser.tags) != 1:
        errors.append(f"{name}: exactly one <main> is required")
    if sum(tag == "h1" for tag, _ in parser.tags) != 1:
        errors.append(f"{name}: exactly one <h1> is required")
    for tag, attrs in parser.tags:
        href = attrs.get("href")
        if tag == "a" and href is not None:
            path = local_path(href)
            if href == "":
                errors.append(f"{name}: empty local link")
            elif path and path.startswith("/") and path.rstrip("/") not in ("",) and normalise_route(path) not in outputs:
                errors.append(f"{name}: dead local link {href}")
        asset_value = attrs.get("href") if tag == "link" else attrs.get("src")
        if tag in ("img", "script", "link") and asset_value:
            path = local_path(asset_value)
            if path and path.startswith("/") and not local_asset_exists(source, path):
                errors.append(f"{name}: missing local asset {asset_value}")
        if attrs.get("target") == "_blank":
            rel = set(attrs.get("rel", "").split())
            if not {"noopener", "noreferrer"} <= rel:
                errors.append(f"{name}: target=_blank requires rel noopener noreferrer")
        for key in ("aria-controls", "aria-labelledby", "aria-describedby"):
            for reference in attrs.get(key, "").split():
                if reference not in ids:
                    errors.append(f"{name}: ARIA reference {reference} has no target")
    return errors


def build_site(root: Path) -> None:
    source = root / "src"
    routes = read_routes(source)
    errors: list[str] = []
    route_paths = [route.get("route", "") for route in routes]
    if len(route_paths) != len(set(route_paths)):
        errors.append("route registry contains duplicate routes")
    outputs = {path if path.endswith(".html") else path.rstrip("/") + "/" for path in route_paths}
    output_documents: list[tuple[Path, str]] = []
    try:
        document_template = (source / "fragments" / "document.html").read_text()
        header = (source / "fragments" / "header.html").read_text()
        footer = (source / "fragments" / "footer.html").read_text()
    except FileNotFoundError as error:
        raise BuildError(f"missing shared fragment: {error.filename}") from error
    document_template = include_fragments(document_template, source, "document fragment")
    header = include_fragments(header, source, "header fragment")
    footer = include_fragments(footer, source, "footer fragment")
    seen = {key: set() for key in ("title", "description", "canonical")}
    for route in routes:
        missing = [key for key in REQUIRED if not route.get(key) and route.get(key) is not False]
        if missing:
            errors.append(f"{route.get('route', '?')}: missing metadata {', '.join(missing)}")
            continue
        for key in seen:
            if route[key] in seen[key]:
                errors.append(f"{route['route']}: duplicate {key}")
            seen[key].add(route[key])
        pages_root = (source / "pages").resolve()
        page = source / "pages" / str(route["page"])
        try:
            is_safe_page = page.resolve().is_relative_to(pages_root)
        except (OSError, RuntimeError):
            is_safe_page = False
        if not page.is_file() or not is_safe_page:
            errors.append(f"{route['route']}: missing or unsafe page {route['page']}")
            continue
        body = include_fragments(page.read_text(), source, route["route"])
        body = render(body, route, route["route"])
        rendered_header = render(header, route, "header")
        rendered_footer = render(footer, route, "footer")
        document = compose_document(document_template, body, rendered_header, rendered_footer, route)
        errors.extend(validate_document(document, route, source, outputs))
        output_documents.append((destination(root / "dist", route["route"]), document))
    if errors:
        raise BuildError("\n".join(errors))
    dist = root / "dist"
    dist.mkdir(exist_ok=True)
    for child in dist.iterdir():
        if child.is_dir():
            shutil.rmtree(child)
        else:
            child.unlink()
    for path, document in output_documents:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(document)

    assets_dist = dist / "assets"
    source_assets = root / "assets"
    if source_assets.is_dir():
        shutil.copytree(source_assets, assets_dist)
    else:
        assets_dist.mkdir()
    css_sources = [
        source / "assets" / name
        for name in ("foundations.css", "navigation.css", "components.css", "responsive-content.css", "forms.css")
    ]
    if all(path.is_file() for path in css_sources):
        combined_css = "\n\n".join(path.read_text().rstrip() for path in css_sources) + "\n"
        (assets_dist / "base.css").write_text(combined_css)
    source_script = source / "assets" / "site.js"
    if source_script.is_file():
        shutil.copy2(source_script, assets_dist / "site.js")

    indexable = [route for route in routes if route["indexable"]]
    sitemap = "\n".join(
        ["<?xml version=\"1.0\" encoding=\"UTF-8\"?>", f'<urlset xmlns="{SITEMAP_NS}">']
        + [f"  <url><loc>{html.escape(route['canonical'])}</loc></url>" for route in indexable]
        + ["</urlset>", ""]
    )
    (dist / "sitemap.xml").write_text(sitemap)
    (dist / "robots.txt").write_text(
        "User-agent: *\nAllow: /\nDisallow:\n\nSitemap: https://tarikdata.digital/sitemap.xml\n"
    )


if __name__ == "__main__":
    build_site(Path(__file__).resolve().parents[1])
