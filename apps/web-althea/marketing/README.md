# Althea Psychology — Marketing Site

Landing page publik (statis) untuk klinik Althea Psychology. Dibangun
berdasarkan aplikasi internal `apps/web-althea` — memakai brand token,
layanan, dan model booking yang sama (admin-driven, pasien tidak self-book).

## Isi

| File         | Keterangan                                              |
| ------------ | ------------------------------------------------------- |
| `index.html` | Satu halaman: hero, layanan, pendekatan, cara booking, tim, testimoni, FAQ, CTA, footer |
| `styles.css` | Token brand (sage/cream/teal) port dari `apps/web-althea/styles/althea-tokens.css` |

Tanpa build step. HTML/CSS murni + sedikit JS vanilla untuk menu mobile.

## Preview lokal

```bash
cd apps/web-althea/marketing
npx serve .          # atau: python3 -m http.server 8080
# lalu buka http://localhost:8080
```

Atau buka `index.html` langsung di browser (`file://`).

> Tidak menambah port baru di `config/ports.json` dan tidak butuh aturan UFW —
> situs ini statis. Saat deploy produksi, taruh di static host / reverse proxy
> (mis. subdomain terpisah, bukan di belakang auth proxy `apps/web-althea`).

## Yang HARUS diganti sebelum live

Cari komentar `<!-- ... -->` di `index.html`:

1. **Nomor WhatsApp** — `6281234567890` (format internasional tanpa `+`),
   muncul di nav, hero, CTA, footer. Pesan prefilled bisa diubah di query
   `?text=`.
2. **Nomor telepon** — link `tel:+6281234567890` di section CTA.
3. **Kontak footer** — alamat, jam operasional, WhatsApp, email
   (`halo@althea.example`).
4. **Testimoni** — saat ini ilustratif untuk demo; ganti dengan kutipan klien
   nyata (dengan izin).

Konten layanan & spesialisasi sudah selaras dengan domain aplikasi:
Konseling / Terapi / Layanan Anak / Tes Psikologi, dan spesialisasi tim
(Klinis Dewasa, Anak & Remaja, Pasangan, Keluarga, Tumbuh Kembang, Terapi
Anak, Tes Psikologi).

## Konsistensi brand

Token disalin dari sumber kebenaran `apps/web-althea/styles/althea-tokens.css`.
Jika palette di app berubah, sinkronkan blok `:root` di `styles.css`.
