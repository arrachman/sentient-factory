---
name: marketing
description: Skill untuk bekerja dengan apps/marketing — static HTML marketing pages untuk Sentient Factory, HR solution, dan data extraction product, dengan Nginx config, SEO sitemap, dan OG images.
---

Kamu sedang bekerja di `apps/marketing` — halaman marketing statis Sentient Factory.

## Struktur File

| File | Ukuran | Fungsi |
|------|--------|--------|
| `sentient-marketing.html` | 154KB | Halaman marketing utama Sentient Factory |
| `hr-marketing.html` | 39KB | Halaman marketing produk HR Solution |
| `tarik-data-digital.html` | 77KB | Halaman produk Tarik Data Digital |
| `sentient-marketing-nginx.conf` | — | Nginx configuration |
| `sentient-marketing-robots.txt` | — | robots.txt untuk SEO |
| `sentient-marketing-sitemap.xml` | — | Sitemap XML |
| `sentient-factory-og.svg` | — | Open Graph image Sentient Factory |
| `tarik-data-digital-og.svg` | — | Open Graph image Tarik Data Digital |
| `image.png` | 413KB | Preview image |

## Port & Deploy

- Port: 3209–3211 (via Nginx)
- Served sebagai static files oleh Nginx
- Nginx config: `sentient-marketing-nginx.conf`

## Halaman yang Ada

### 1. Sentient Factory Marketing (`sentient-marketing.html`)
Halaman utama produk — 154KB file lengkap dengan:
- Hero section
- Feature showcase
- Use cases manufacturing
- Testimonials / social proof
- Pricing / CTA
- Contact form

### 2. HR Solution (`hr-marketing.html`)
Landing page untuk modul HR:
- Absensi & attendance tracking
- Employee management
- Payroll integration
- CTA demo/trial

### 3. Tarik Data Digital (`tarik-data-digital.html`)
Landing page untuk produk data extraction:
- ETL capabilities
- Data source integration
- Dashboard & reporting
- CTA

## Perintah Umum

```bash
# Serve lokal dengan Python
cd apps/marketing
python -m http.server 3209

# Atau via Nginx (produksi)
nginx -c sentient-marketing-nginx.conf

# Via Docker
docker-compose up marketing
```

## Panduan Tugas Umum

### Update Konten Halaman
- File HTML adalah single-file — semua CSS dan JS inline
- Cari section yang ingin diubah dengan `Ctrl+F` kata kunci konten
- Perhatikan struktur HTML yang ada sebelum mengubah

### Update SEO
1. **Meta tags** — ada di `<head>` setiap file HTML
   ```html
   <meta name="description" content="...">
   <meta property="og:title" content="...">
   <meta property="og:image" content="...">
   ```
2. **Sitemap** — update `sentient-marketing-sitemap.xml` jika ada halaman baru
3. **robots.txt** — update `sentient-marketing-robots.txt` jika perlu

### Update OG Image
- Edit `sentient-factory-og.svg` atau `tarik-data-digital-og.svg`
- SVG bisa diedit langsung atau konversi ke PNG untuk better compatibility
- Ukuran ideal OG image: 1200x630px

### Nginx Config
```nginx
# sentient-marketing-nginx.conf
server {
    listen 3209;
    root /path/to/marketing;
    
    location / {
        try_files $uri $uri.html =404;
    }
}
```

### Deploy ke Production
1. Copy file HTML ke server
2. Update Nginx config dengan path yang benar
3. Reload Nginx: `nginx -s reload`

## Catatan
- File HTML sangat besar (single-file dengan inline styles) — scroll dengan hati-hati
- Perubahan harus di-test di browser sebelum deploy
- OG images penting untuk sharing di WhatsApp/Telegram/social media
