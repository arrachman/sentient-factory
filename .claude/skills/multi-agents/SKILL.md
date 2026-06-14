---
name: multi-agents
description: >
  Pecah satu prompt besar jadi beberapa sub-tugas independen lalu jalankan
  paralel via Agent tool, supaya selesai lebih cepat tanpa meledakkan context
  parent. Cocok untuk refactor banyak file (>400 baris), audit lintas-app,
  migrasi shared-types TS+Pydantic, atau eksplorasi luas.
trigger: >
  Aktif saat user menyebut "multi-agents", "/multi-agents", "paralel",
  "bagi ke beberapa agent", "spawn agent", "kerjakan barengan/serentak", atau
  saat task jelas-jelas terdiri dari banyak unit independen (mis. split N file
  oversized, audit semua app, update tipe di TS + Python sekaligus).
---

# Skill: multi-agents

Tujuan: ketika user memberi satu prompt yang sebenarnya berisi **banyak unit kerja
independen**, jangan kerjakan serial. Pecah → dispatch agent paralel → agregasi
ringkasan. Parent context tetap kecil, wall-clock lebih cepat.

> Aturan repo yang relevan: CLAUDE.md §5 (maks 400 baris/file, spawn sub-agent per
> file untuk refactor besar), §7 (Explore/general-purpose untuk eksplorasi besar),
> §11 (Task agent per file, report summary saja).

## Sintaks

- `/multi-agents <task>` — auto-decompose lalu konfirmasi rencana sebelum spawn.
- `/multi-agents <task> --go` — skip konfirmasi, langsung dispatch (hanya bila
  tugas read-only atau user sudah eksplisit minta).
- `/multi-agents <task> --max=N` — batasi agent konkuren (default 4).
- `/multi-agents <task> --isolated` — paksa tiap agent pakai worktree terpisah.

## Langkah wajib

### 1. Decompose

Ubah prompt jadi daftar unit kerja. Satu unit = satu agent. Unit valid HANYA jika:

- **Independen**: tidak butuh output unit lain (no ordering dependency).
- **Disjoint write**: tidak ada dua unit yang menulis file/region yang sama.
- **Self-contained**: bisa dijelaskan dalam satu prompt + path/scope jelas.
- **Cukup berat**: > ~2 menit kerja. Unit remeh digabung, jangan over-spawn.

Pola decompose yang umum di repo ini:

| Prompt user | Unit per agent |
| --- | --- |
| "split semua file > 400 baris di apps/web-althea" | 1 file oversized = 1 agent |
| "audit kualitas semua app" | 1 app (`apps/*`) = 1 agent |
| "tambah field X ke shared-types" | agent TS + agent Pydantic (lihat §pitfall) |
| "cari semua pemakaian API lama" | 1 area pencarian = 1 Explore agent |
| "perbaiki lint di N package" | 1 package = 1 agent |

Jika unit < 2 atau saling bergantung → **jangan pakai skill ini**, kerjakan inline
dan katakan alasannya (lihat §Kapan TIDAK).

### 2. Konfirmasi rencana

Tampilkan tabel rencana ke user sebelum spawn (kecuali `--go`):

```
Rencana paralel (N agent, max K konkuren):
1. <subagent_type> — <unit> — <scope/paths> — isolation: <none|worktree>
2. ...
```

Untuk keputusan ambigu (mis. batas konkuren, perlu worktree atau tidak, scope
overlap) gunakan `AskUserQuestion`, jangan asumsi diam-diam.

### 3. Pilih agent type & isolasi

- **Read-only / pencarian luas** → `Explore` (sebut breadth: "medium" /
  "very thorough"). Tanpa worktree.
- **Refactor/split/edit file** → `general-purpose` atau `gsd-executor`.
  **WAJIB `isolation: "worktree"`** kalau ≥2 agent menulis di repo yang sama,
  untuk hindari korup git index.
- **Plan/desain** → `Plan`.
- Agent yang nulis ke disk harus diberi path absolut + instruksi commit/scope-nya.

### 4. Dispatch paralel

Spawn semua agent **dalam satu message** (beberapa `Agent` call sekaligus) supaya
benar-benar paralel. Jika jumlah unit > `--max`, dispatch bergelombang: satu wave
penuh selesai → wave berikut.

Prompt tiap agent harus berisi: (a) tujuan spesifik, (b) scope/path eksak,
(c) batasan repo yang relevan (mis. "maks 400 baris", "jalankan `npm run
typecheck` setelah edit", "named export"), (d) **format laporan balik: ringkasan
saja, bukan dump file**.

### 5. Agregasi

Kumpulkan hasil tiap agent → satu ringkasan ke user: apa yang berubah per unit,
status (✅/⚠️/❌), file tersentuh, langkah verifikasi tersisa. Jangan paste
output mentah tiap agent.

### 6. Verifikasi gabungan

Setelah agent write selesai & worktree di-merge/cherry-pick:
`npm run typecheck` lalu `npm run lint` di scope terdampak. Laporkan apa adanya —
kalau ada agent gagal, sebut + tawarkan retry unit itu saja.

## Kapan TIDAK pakai skill ini

- Unit saling bergantung (output A jadi input B) → serial.
- Semua unit menyentuh file yang sama → konflik write, kerjakan inline.
- Tugas kecil (< 2 unit atau total < ~5 menit) → overhead spawn > manfaat.
- User cuma minta 1 hal spesifik → jangan dipaksa paralel.

Kalau ragu apakah unit benar independen → **tanya user** (CLAUDE.md §10).

## Pitfall khusus repo ini

- **shared-types**: perubahan tipe HARUS update sisi TS *dan* Pydantic. Dispatch
  2 agent (TS, Python) tapi beri tahu keduanya kontrak field yang sama persis,
  lalu verifikasi konsistensi di agregasi (CLAUDE.md §2.3, §8).
- **Worktree ≠ live dev server**: edit di worktree tidak tampil di browser sampai
  di-merge/cherry-pick ke branch yang ditonton dev server. Sebelum fix UI paralel,
  konfirmasi branch mana yang dijalankan server, lalu tawarkan cherry-pick
  (CLAUDE.md §8, §11).
- **Port/Vault/ports.json**: jangan biarkan agent paralel mengubah
  `config/ports.json`, file Vault, atau `infra/docker-compose.yml` — itu SSOT
  single-writer (CLAUDE.md §2, §9). Kalau perlu, lakukan inline setelah agent
  selesai.
- **Git**: jangan dua agent commit di working tree yang sama. Pakai worktree atau
  satu agent = satu commit, parent yang orkestrasi merge.

## Contoh

`/multi-agents split semua file > 400 baris di apps/web-erp/prototype/src`
→ 1 Explore agent listing file oversized → tabel rencana → N `general-purpose`
agent (worktree, 1 file/agent: split <400 baris, named export, `npm run
typecheck`) → agregasi + typecheck gabungan + tawarkan commit per file.

`/multi-agents audit kualitas web-althea, web-erp, api-gateway --go`
→ 3 Explore agent paralel (very thorough), tanpa worktree → ringkasan temuan
per-app dalam satu laporan.
