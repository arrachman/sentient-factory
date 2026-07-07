---
sidebar_position: 3
title: Cuti (Ajukan · Setujui · Tolak)
---

# Cuti

Rute `/app/leave` · grup **Manajemen Tenaga Kerja** · *live* · kode layar `LVE`.

Layar ini menangani pengajuan dan persetujuan **cuti/izin** — adaptasi *jibble Time
Off*. Berbeda dari layar master lain (Shift, Libur, Lokasi) yang murni tambah–ubah–
hapus, Cuti punya **alur dua sisi**: karyawan **mengajukan**, lalu supervisor
**menyetujui, menolak, atau membatalkan**. Jadi "aksi" di sini bukan edit/hapus,
melainkan **transisi status** sebuah pengajuan. Perhatikan perbedaan itu.

## Use case: dari pengajuan sampai keputusan

Seorang operator ingin mengambil cuti sakit dua hari. Ia membuka layar Cuti, menekan
**Ajukan Cuti**, memilih *Cuti Sakit*, mengisi rentang tanggal, dan mengirim.
Pengajuan itu tidak langsung berlaku — ia masuk antrian dengan status **Menunggu**
(*pending*). Supervisor kemudian membuka layar yang sama, memfilter status
*Menunggu*, meninjau pengajuan, dan menekan salah satu dari tiga tombol keputusan.
Begitu disetujui, cuti tercermin di rekap [Laporan → Rekap Cuti](/hr/laporan-lainnya/laporan);
begitu ditolak, karyawan tahu harus mengatur ulang. Semua riwayat keputusan tetap
tersimpan dan bisa ditelusuri lewat filter status.

![Daftar Cuti dengan filter status dan satu pengajuan menunggu](/img/hr/lve-07-approval-buttons.png)

### Elemen di daftar

- **Filter Status** (kiri) dengan empat pilihan: **Menunggu**, **Disetujui**,
  **Ditolak**, **Dibatalkan** — default **Menunggu**. Tabel hanya menampilkan
  pengajuan pada status terpilih.
- Tombol **⟳ refresh** dan **+ Ajukan Cuti** (`N`).
- **Penghitung** *Pengajuan · N baris* dan **paginasi** di footer (25 baris/halaman).

| Kolom | Isi |
| --- | --- |
| **Karyawan** | Nama pengaju. |
| **Tipe** | Jenis cuti (*Cuti Sakit*, *Cuti Tahunan*, *Cuti Tanpa Bayar*, dll). |
| **Periode** | Tanggal mulai → selesai, diikuti jumlah hari. |
| **Alasan** | Keterangan opsional; kosong → `—`. |
| **Status** | Lencana berwarna: **pending** (kuning), **approved** (hijau), **rejected** (merah), **cancelled** (abu-abu). |
| *(aksi)* | Untuk baris **pending**: tiga tombol keputusan. Untuk baris final: catatan tinjauan (*review note*). |

:::caution Kolom Periode menampilkan "(NaN hari)"
Saat ini kolom **Periode** menampilkan jumlah hari sebagai **`(NaN hari)`** karena
nilai `totalDays` tidak ter-parse angka di jalur render. Tanggal mulai/selesainya
sendiri benar; hanya perhitungan jumlah harinya yang belum tampil. Ini masalah
tampilan yang sedang ditindaklanjuti, bukan berarti pengajuan Anda salah.
:::

---

## Mengajukan cuti

### Langkah 1 — Buka dialog

Tekan **+ Ajukan Cuti** (atau `N`). Dialog **"Ajukan Cuti"** terbuka dengan empat
kolom: **Tipe Cuti** (dropdown, default *— pilih —*), **Mulai** dan **Selesai**
(pemilih tanggal), serta **Alasan (opsional)**.

![Dialog Ajukan Cuti kosong](/img/hr/lve-02-add-dialog.png)

:::note Jenis cuti tanpa bayar ditandai
Pada dropdown Tipe Cuti, jenis cuti yang tidak dibayar diberi label tambahan
*"(tanpa bayar)"* — mis. *Cuti Tanpa Bayar (tanpa bayar)* — agar pengaju sadar
implikasinya sebelum memilih.
:::

### Langkah 2 — Dua peringatan validasi

Cuti memiliki **dua** pemeriksaan berbeda, keduanya di sisi klien sebelum apa pun
dikirim ke server:

**a. Kolom wajib.** Menekan **Ajukan** tanpa memilih **Tipe Cuti** atau tanpa
mengisi salah satu **tanggal**:

> ⚠️ **Tipe cuti dan tanggal wajib diisi.**

![Toast validasi kolom wajib](/img/hr/lve-03-validation-required.png)

**b. Rentang tanggal terbalik.** Bila **Selesai** lebih awal dari **Mulai**:

> ⚠️ **Tanggal selesai tidak boleh sebelum tanggal mulai.**

![Toast validasi rentang tanggal terbalik](/img/hr/lve-04-validation-daterange.png)

Kolom **Alasan** bersifat opsional — boleh dikosongkan.

### Langkah 3 — Isi dengan benar dan kirim

Pilih tipe, isi rentang tanggal yang valid, dan (opsional) alasan.

![Dialog Ajukan Cuti terisi benar](/img/hr/lve-05-filled.png)

Tekan **Ajukan** (tombol berubah *"Mengirim…"* selama proses). Bila berhasil: dialog
tertutup, dan toast:

> ✅ **Pengajuan cuti terkirim.**

![Pengajuan baru berstatus pending dengan toast sukses](/img/hr/lve-06-submit-success.png)

Pengajuan langsung muncul di daftar (filter **Menunggu**) dengan lencana **pending**
kuning, menunggu keputusan supervisor.

---

## Menyetujui / menolak / membatalkan (supervisor)

Pada setiap baris berstatus **pending**, kolom aksi menampilkan **tiga tombol** —
dari kiri ke kanan:

| Tombol | Ikon | Aksi | Hasil status |
| --- | --- | --- | --- |
| **Batalkan** | 🚫 (abu-abu) | Menarik/membatalkan pengajuan | `cancelled` |
| **Tolak** | ✕ (merah) | Menolak pengajuan | `rejected` |
| **Setujui** | ✓ (hijau) | Menyetujui pengajuan | `approved` |

Menekan salah satunya langsung memproses (tombol dinonaktifkan sesaat selama
permintaan) — **tidak ada dialog konfirmasi**. Semua ketiga aksi memakai pesan
konfirmasi yang sama:

> ✅ **Pengajuan diperbarui.**

![Toast "Pengajuan diperbarui." setelah menyetujui](/img/hr/lve-08-approve-success.png)

Setelah diproses, baris berpindah keluar dari filter **Menunggu**. Untuk melihatnya
lagi, ganti **Filter Status** ke **Disetujui** / **Ditolak** / **Dibatalkan**. Pada
baris yang sudah final, kolom aksi tidak lagi menampilkan tombol melainkan
**catatan tinjauan** (bila ada).

:::tip Keputusan bukan penghapusan
Perhatikan bahwa menolak/membatalkan **tidak menghapus** pengajuan — ia hanya
berpindah status dan tetap tersimpan sebagai riwayat. Tidak ada tombol "hapus" di
layar Cuti; jejak audit pengajuan selalu dipertahankan.
:::

---

## Referensi pesan & peringatan sistem

| Pesan | Jenis | Kapan muncul | Tindakan Anda |
| --- | --- | --- | --- |
| **Tipe cuti dan tanggal wajib diisi.** | ⚠️ Peringatan | *Ajukan* ditekan tanpa Tipe Cuti / tanggal. | Lengkapi tipe & kedua tanggal. |
| **Tanggal selesai tidak boleh sebelum tanggal mulai.** | ⚠️ Peringatan | Tanggal *Selesai* lebih awal dari *Mulai*. | Perbaiki urutan tanggal. |
| **Pengajuan cuti terkirim.** | ✅ Sukses | Pengajuan baru berhasil dibuat (status *pending*). | Tunggu keputusan supervisor. |
| **Pengajuan diperbarui.** | ✅ Sukses | Aksi setujui/tolak/batalkan berhasil. | — |
| **Gagal mengajukan cuti.** | ❌ Galat | Server menolak pengajuan (mis. sesi kedaluwarsa, kuota, pesan spesifik backend). | Login ulang / perbaiki / coba lagi. |
| **Aksi gagal.** | ❌ Galat | Server menolak aksi persetujuan. | Muat ulang lalu coba lagi. |
| **Tidak ada pengajuan untuk status ini.** | ℹ️ Info (state kosong) | Filter status terpilih tidak punya pengajuan. | Ganti filter status. |

:::note Hak akses
Karyawan biasa mengajukan cuti untuk dirinya dan melihat pengajuannya sendiri.
Menyetujui/menolak/membatalkan pengajuan orang lain memerlukan hak **privileged**
(supervisor/manajer). Lihat [Akses & Peran](/hr/kehadiran/akses-peran).
:::
