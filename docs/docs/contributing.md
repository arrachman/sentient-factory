# Contributing

Panduan kontribusi dokumentasi Sentient Factory.

## Scope

- Perbaiki typo, broken link, dan struktur navigasi.
- Tambahkan halaman baru sesuai kategori yang sudah ada.
- Pastikan contoh endpoint, path, dan istilah teknis konsisten.

## Workflow

1. Edit file di folder `docs/docs/`.
2. Jalankan `npm run build` dari folder `docs/`.
3. Pastikan tidak ada error build.
4. Review perubahan link dan sidebar sebelum deploy.

## Writing Rules

- Gunakan judul yang singkat dan jelas.
- Pakai relative link untuk referensi antar halaman docs bila memungkinkan.
- Bungkus path API seperti `/api/users/{id}` dengan inline code.
- Hindari referensi ke file yang belum ada.

## Deployment Check

- Site production berjalan di subpath `/docs/`.
- Asset harus termuat dari prefix `/docs/...`.
- Cek halaman utama, halaman docs, dan blog setelah deploy.
