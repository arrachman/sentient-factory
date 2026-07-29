"""Single source of truth for Tarik Data Digital public routes."""

BASE = "https://tarikdata.digital"
OG_IMAGE = f"{BASE}/assets/og-home.png"


def route(path, page, title, description, *, indexable=True, suite="", page_styles="", json_ld=""):
    canonical = f"{BASE}{path}"
    return {
        "route": path,
        "page": page,
        "title": title,
        "description": description,
        "canonical": canonical,
        "lang": "id-ID",
        "og_image": OG_IMAGE,
        "twitter_card": "summary_large_image",
        "indexable": indexable,
        "robots": "index, follow, max-image-preview:large" if indexable else "noindex, follow",
        "html_attrs": f' data-suite="{suite}"' if suite else "",
        "page_styles": page_styles,
        "json_ld": json_ld,
    }


ROUTES = [
    route(
        "/", "home.html",
        "Sistem informasi untuk institusi Indonesia | PT Tarik Data Digital",
        "Sistem informasi modular untuk rumah sakit, sekolah, dan bisnis Indonesia. ERP, absensi, dashboard, dan AI dengan opsi deployment sesuai kebutuhan.",
        page_styles="<style>\n" + __import__("pathlib").Path(__file__).parents[1].joinpath("home/styles.css").read_text() + "\n</style>",
        json_ld=__import__("pathlib").Path(__file__).parents[1].joinpath("home/json-ld.html").read_text(),
    ),
    route(
        "/solusi/kesehatan/", "solusi/kesehatan.html",
        "Program pengembangan sistem informasi kesehatan | Senti Health",
        "Program pengembangan Senti Health bersama mitra desain awal untuk memetakan rekam medis, layanan, pelaporan, dan kebutuhan integrasi klinik atau rumah sakit.",
        suite="health",
    ),
    route(
        "/solusi/pendidikan/", "solusi/pendidikan.html",
        "Program pengembangan administrasi pendidikan | Senti Edu",
        "Program pengembangan Senti Edu bersama mitra desain awal untuk memetakan akademik, SPMB, keuangan, asrama, dan pelaporan pendidikan.",
        suite="edu",
    ),
    route(
        "/solusi/bisnis/", "solusi/bisnis.html",
        "ERP, absensi, dashboard, dan AI untuk operasional | Senti Biz",
        "Senti Biz membahas ERP, absensi, dashboard, dan AI sesuai kebutuhan operasional. POS masih rencana dan status MDP diverifikasi per ruang lingkup.",
        suite="biz",
    ),
    route(
        "/perusahaan/", "perusahaan.html",
        "Profil dan cara kerja | PT Tarik Data Digital",
        "Profil PT Tarik Data Digital, ruang lingkup perangkat lunak, dan pendekatan implementasi yang dimulai dari kebutuhan institusi.",
    ),
    route(
        "/kontak/", "kontak.html",
        "Jadwalkan demo sesuai sektor | PT Tarik Data Digital",
        "Ceritakan sektor dan proses yang ingin diperbaiki untuk menyiapkan pembahasan awal serta demo yang relevan.",
    ),
    route(
        "/produk/senti-ai/", "produk/senti-ai/index.html",
        "Senti AI untuk tanya jawab data | PT Tarik Data Digital",
        "Senti AI membantu menelusuri data melalui pertanyaan bahasa sehari-hari dalam ruang baca yang ditetapkan.",
    ),
    route(
        "/produk/hr-absensi/", "produk/hr-absensi/index.html",
        "Senti HR: absensi, shift, dan timesheet",
        "Absensi dengan wajah, geofence GPS, shift, cuti, timesheet, laporan, dan mode kios; bukan HRIS penuh atau payroll.",
    ),
    route(
        "/produk/erp/", "produk/erp/index.html",
        "Senti ERP untuk operasional bisnis",
        "ERP modular untuk akuntansi, persediaan, pembelian, penjualan, master data, dan proses manufaktur.",
        suite="biz",
    ),
    route(
        "/produk/pos/", "produk/pos/index.html",
        "Rencana produk POS | PT Tarik Data Digital",
        "POS masih berada dalam rencana produk dan belum tersedia untuk penggunaan produksi.",
        indexable=False,
    ),
    route(
        "/perusahaan/cara-kerja/", "perusahaan/cara-kerja/index.html",
        "Cara kami menjalankan implementasi | PT Tarik Data Digital",
        "Implementasi dimulai dari pemetaan kebutuhan, proof of concept, tahapan terukur, pelatihan, dan handover.",
    ),
    route(
        "/perusahaan/studi-kasus/", "perusahaan/studi-kasus/index.html",
        "Studi kasus | PT Tarik Data Digital",
        "Studi kasus dipublikasikan setelah konteks, hasil, metode pengukuran, dan izin dapat diverifikasi.",
        indexable=False,
    ),
    route(
        "/perusahaan/karier/", "perusahaan/karier/index.html",
        "Karier | PT Tarik Data Digital",
        "Informasi posisi kerja PT Tarik Data Digital akan diumumkan pada halaman ini ketika tersedia.",
        indexable=False,
    ),
    route(
        "/sumber-daya/dokumentasi/", "sumber-daya/dokumentasi/index.html",
        "Dokumentasi produk | PT Tarik Data Digital",
        "Materi produk dan integrasi dibahas sesuai produk serta lingkungan implementasi yang digunakan.",
        indexable=False,
    ),
    route(
        "/sumber-daya/demo/", "sumber-daya/demo/index.html",
        "Minta demo produk Senti | PT Tarik Data Digital",
        "Pilih produk atau sektor agar sesi demo menggunakan alur yang relevan dengan kebutuhan Anda.",
    ),
    route(
        "/sumber-daya/blog/", "sumber-daya/blog/index.html",
        "Catatan produk dan implementasi | PT Tarik Data Digital",
        "Catatan produk dan implementasi akan dipublikasikan di sini setelah materi tersedia dan terverifikasi.",
        indexable=False,
    ),
    route(
        "/sumber-daya/status/", "sumber-daya/status/index.html",
        "Status sistem | PT Tarik Data Digital",
        "Status layanan akan dipublikasikan setelah sumber pemantauan dan prosedur insiden tersedia.",
        indexable=False,
    ),
    route(
        "/privasi/", "privasi.html",
        "Kebijakan privasi | PT Tarik Data Digital",
        "Cara PT Tarik Data Digital memperlakukan informasi yang dikirim melalui situs, email, dan WhatsApp.",
    ),
    route(
        "/404.html", "404.html",
        "Halaman tidak ditemukan | PT Tarik Data Digital",
        "Alamat yang dibuka tidak tersedia. Gunakan tautan yang tersedia untuk melanjutkan ke bagian situs yang relevan.",
        indexable=False,
    ),
    route(
        "/ketentuan/", "ketentuan.html",
        "Syarat dan ketentuan | PT Tarik Data Digital",
        "Ketentuan umum penggunaan situs dan awal percakapan dengan PT Tarik Data Digital.",
    ),
]
