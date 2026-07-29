from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

from site_builder import BuildError, build_site


VALID_PAGE = """<main id=\"content\"><h1 id=\"title\">{{heading}}</h1><a href=\"/about/\">About</a><img src=\"/assets/logo.svg\" alt=\"Logo\"></main>"""


class SiteBuilderTests(unittest.TestCase):
    def write_source(self, root: Path, page: str = VALID_PAGE) -> None:
        (root / "src" / "pages").mkdir(parents=True)
        (root / "src" / "fragments").mkdir()
        (root / "assets").mkdir()
        (root / "src" / "fragments" / "document.html").write_text(
            '<!doctype html><html lang="{{lang}}"><head>{{head}}</head><body>{{header}}{{body}}{{footer}}</body></html>'
        )
        (root / "src" / "fragments" / "header.html").write_text("<header>Header</header>")
        (root / "src" / "fragments" / "footer.html").write_text("<footer>Footer</footer>")
        (root / "src" / "pages" / "home.html").write_text(page)
        (root / "src" / "pages" / "about.html").write_text(
            "<main id=\"about\"><h1 id=\"about-title\">About</h1></main>"
        )
        (root / "assets" / "logo.svg").write_text("<svg></svg>")
        (root / "src" / "data" / "routes.py").parent.mkdir()
        (root / "src" / "data" / "routes.py").write_text(
            "ROUTES = [\n"
            "    {'route': '/', 'page': 'home.html', 'title': 'Home', "
            "'description': 'Home description', 'canonical': 'https://example.test/', "
            "'lang': 'id', 'heading': 'Home', 'og_image': '/assets/logo.svg', "
            "'twitter_card': 'summary', 'indexable': True},\n"
            "    {'route': '/about/', 'page': 'about.html', 'title': 'About', "
            "'description': 'About description', 'canonical': 'https://example.test/about/', "
            "'lang': 'id', 'heading': 'About', 'og_image': '/assets/logo.svg', "
            "'twitter_card': 'summary', 'indexable': True},\n"
            "]\n"
        )

    def test_file_route_writes_flat_document_and_stays_linkable(self) -> None:
        """A /404.html route must land at dist/404.html, not dist/404.html/index.html."""
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.write_source(root, page=VALID_PAGE.replace('href="/about/"', 'href="/404.html"'))
            registry = root / "src" / "data" / "routes.py"
            registry.write_text(
                registry.read_text().replace(
                    "]\n",
                    "    {'route': '/404.html', 'page': 'notfound.html', 'title': 'Not found', "
                    "'description': 'Not found description', "
                    "'canonical': 'https://example.test/404.html', "
                    "'lang': 'id', 'heading': 'Not found', 'og_image': '/assets/logo.svg', "
                    "'twitter_card': 'summary', 'indexable': False},\n]\n",
                )
            )
            (root / "src" / "pages" / "notfound.html").write_text(
                '<main id="nf"><h1 id="nf-title">Not found</h1></main>'
            )

            build_site(root)

            self.assertTrue((root / "dist" / "404.html").is_file())
            self.assertFalse((root / "dist" / "404.html" / "index.html").exists())
            self.assertNotIn("404.html", (root / "dist" / "sitemap.xml").read_text())

    def test_builds_deterministic_routes_and_sitemap_from_metadata(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.write_source(root)

            build_site(root)
            first = (root / "dist" / "index.html").read_bytes()
            dist_inode = (root / "dist").stat().st_ino
            build_site(root)

            self.assertEqual(first, (root / "dist" / "index.html").read_bytes())
            self.assertEqual(dist_inode, (root / "dist").stat().st_ino)
            self.assertTrue((root / "dist" / "about" / "index.html").is_file())
            self.assertTrue((root / "dist" / "assets" / "logo.svg").is_file())
            self.assertIn("Disallow:", (root / "dist" / "robots.txt").read_text())
            sitemap = (root / "dist" / "sitemap.xml").read_text()
            self.assertIn("https://example.test/", sitemap)
            self.assertIn("https://example.test/about/", sitemap)
            urlset = ElementTree.fromstring(sitemap)
            self.assertEqual(urlset.tag, "{http://www.sitemaps.org/schemas/sitemap/0.9}urlset")
            document = (root / "dist" / "index.html").read_text()
            self.assertIn("<header>Header</header>", document)
            self.assertIn("<footer>Footer</footer>", document)
            self.assertIn('<html lang="id">', document)

    def test_includes_contact_form_and_blocks_unknown_include_marker(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.write_source(root, VALID_PAGE.replace("</main>", "[[CONTACT_FORM]]</main>"))
            (root / "src" / "components").mkdir()
            (root / "src" / "components" / "contact-form.html").write_text('<form id="contact-form"></form>')

            build_site(root)
            self.assertIn('id="contact-form"', (root / "dist" / "index.html").read_text())
            (root / "src" / "pages" / "home.html").write_text(VALID_PAGE.replace("</main>", "[[UNKNOWN]]</main>"))
            with self.assertRaisesRegex(BuildError, "unresolved include marker UNKNOWN"):
                build_site(root)

    def test_blocks_invalid_output_before_writing_dist(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.write_source(root, VALID_PAGE.replace("{{heading}}", "{{missing}}"))

            with self.assertRaisesRegex(BuildError, "unresolved template"):
                build_site(root)

            self.assertFalse((root / "dist").exists())

    def test_blocks_invalid_local_link_asset_accessibility_and_structure(self) -> None:
        invalid_page = """<main id=\"same\"><h1 id=\"same\">Title</h1><a href=\"\">Empty</a><a href=\"/missing/\">Missing</a><img src=\"/assets/missing.svg\"><button aria-controls=\"dialog\">Open</button><a href=\"https://example.org\" target=\"_blank\">External</a></main><main><h1>Other</h1></main>"""
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.write_source(root, invalid_page)

            with self.assertRaises(BuildError) as caught:
                build_site(root)

            message = str(caught.exception)
            for expected in ("empty local link", "dead local link", "missing local asset", "duplicate id", "exactly one <main>", "exactly one <h1>", "ARIA reference", "noopener noreferrer"):
                self.assertIn(expected, message)

    def test_accepts_nested_page_sources_within_pages_directory(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.write_source(root)
            nested = root / "src" / "pages" / "solusi"
            nested.mkdir()
            (nested / "health.html").write_text('<main><h1>Health</h1></main>')
            registry = root / "src" / "data" / "routes.py"
            registry.write_text(registry.read_text().replace("'about.html'", "'solusi/health.html'"))

            build_site(root)

            self.assertTrue((root / "dist" / "about" / "index.html").is_file())

    def test_blocks_missing_stylesheet_and_splits_aria_id_lists(self) -> None:
        page = """<main><h1>Home</h1><p id=\"help\">Help</p><p id=\"error\">Error</p><input aria-describedby=\"help error\"></main>"""
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.write_source(root, page)
            document = root / "src" / "fragments" / "document.html"
            document.write_text(document.read_text().replace("</head>", '<link rel="stylesheet" href="/assets/missing.css"></head>'))

            with self.assertRaises(BuildError) as caught:
                build_site(root)

            message = str(caught.exception)
            self.assertIn("missing local asset /assets/missing.css", message)
            self.assertNotIn("ARIA reference help error", message)

    def test_builds_registered_project_with_generated_assets(self) -> None:
        build_site(ROOT)

        pages = list((ROOT / "dist").rglob("index.html"))
        self.assertEqual(19, len(pages))
        self.assertTrue((ROOT / "dist" / "assets" / "base.css").is_file())
        self.assertTrue((ROOT / "dist" / "assets" / "site.js").is_file())
        self.assertNotIn("{{", "".join(page.read_text() for page in pages))


if __name__ == "__main__":
    unittest.main()
