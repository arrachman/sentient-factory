---
slug: /referensi/lms
sidebar_position: 10
title: LMS — Pelatihan
---

# LMS — Pelatihan

**LMS** (*Learning Management System*, domain `lms`) mengelola **kompetensi &
pelatihan** tenaga kerja: katalog kursus, enrollment peserta, dan **matriks
kompetensi**. Tujuannya memastikan hanya operator yang kompeten yang menjalankan
proses tertentu.

Sub-navigasi LMS (grup *Pelatihan*):

| Sub-halaman | Route | Fungsi |
| --- | --- | --- |
| Courses | `/app/training` | Katalog kursus/pelatihan |
| Enrollments | `/app/training/enrollments` | Pendaftaran peserta |
| Competencies | `/app/training/competencies` | Matriks kompetensi |

## Courses

Katalog **kursus/pelatihan**. Kursus bisa ditandai **wajib** (*mandatory*) untuk
peran tertentu.

![Daftar Courses](/img/mdp/training-courses.png)

## Enrollments

**Pendaftaran** peserta ke kursus — status mengikuti dan penyelesaian.

![Daftar Enrollments](/img/mdp/training-enrollments.png)

## Competencies

**Matriks kompetensi** — peta keahlian yang dimiliki tiap pekerja (hasil
pelatihan/sertifikasi), dipakai untuk memvalidasi penugasan.

![Daftar Competencies](/img/mdp/training-competencies.png)

## Flow operasional LMS

```
Course (mandatory?) ──► Enrollment (peserta) ──► selesai
                                                   ▼
                            Competency (keahlian tervalidasi) ──► syarat penugasan
```
