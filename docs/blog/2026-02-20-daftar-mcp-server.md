---
slug: daftar-mcp-server
title: Daftar MCP Server dan Pembuatnya (Kompilasi dari 8 Gambar)
description: Kompilasi lengkap daftar MCP Server beserta pembuatnya dari 8 gambar referensi. Disusun dalam satu list agar mudah dipindai untuk kebutuhan riset tool, integrasi AI agent, dan eksplorasi ekosistem MCP.
authors: [slorber]
tags: [mcp, ai-agents, tools]
---

Artikel ini berisi kompilasi nama-nama MCP Server beserta pembuatnya, disusun ulang dari 8 gambar yang kamu kirim. Formatnya sengaja dibuat dalam satu list agar cepat dipindai saat mencari server tertentu.

MCP (Model Context Protocol) Server membantu AI agent terhubung ke tools, data source, dan platform eksternal secara terstruktur. Dengan daftar ini, kamu bisa lebih cepat memetakan opsi integrasi sesuai kebutuhan use case, misalnya untuk development workflow, observability, data platform, automation, atau enterprise operations.

**Catatan:**
- Nama yang mengandung `...` mengikuti teks yang tampil di sumber gambar (terpotong).
- Penulisan nama server dan pembuat dipertahankan sedekat mungkin dengan sumber asli.

<!-- truncate -->

## Daftar Lengkap MCP Server


### 1. **MCP Servers** (`microsoft`)

**Deskripsi:** Katalog resmi implementasi MCP dari Microsoft untuk akses data dan integrasi tool berbasis AI agent.  
**Fungsi:** Menyatukan berbagai server Microsoft (misalnya Azure/Fabric) dalam ekosistem yang konsisten untuk host MCP.  
**Hal gila yang bisa dilakukan:** Menjalankan agen yang bisa loncat lintas layanan Microsoft dan orchestration cloud tanpa perlu bikin integrasi custom dari nol.  
**Sumber:** https://github.com/microsoft/mcp


### 2. **Netdata** (`netdata`)

**Deskripsi:** MCP server observability yang tertanam di Netdata Agent/Parent untuk akses metrik, alert, fungsi sistem, dan log infrastruktur.  
**Fungsi:** Discovery node + metrik, query agregasi, deteksi anomali berbasis ML, sampai root-cause scoring lintas metric correlation.  
**Hal gila yang bisa dilakukan:** Agen bisa investigasi outage otomatis dari sinyal anomali ke log/function execution multi-node dalam satu alur percakapan.  
**Sumber:** https://github.com/mcp/netdata/mcp-server


### 3. **Context7** (`upstash`)

**Deskripsi:** MCP untuk injeksi dokumentasi dan contoh kode terbaru yang version-specific langsung ke konteks LLM.  
**Fungsi:** Resolve library ID lalu query docs resmi agar output code assistant tidak pakai referensi usang.  
**Hal gila yang bisa dilakukan:** Prompt kompleks bisa auto-muat docs library versi tepat (bahkan via OAuth endpoint) sehingga agen menulis patch yang jauh lebih minim halusinasi API.  
**Sumber:** https://github.com/upstash/context7


### 4. **Playwright** (`microsoft`)

**Deskripsi:** MCP server otomasi browser berbasis Playwright yang bekerja lewat structured accessibility tree (bukan screenshot).  
**Fungsi:** Interaksi web deterministic untuk testing, scraping, dan validasi flow UI tanpa vision model.  
**Hal gila yang bisa dilakukan:** Agen bisa menjalankan E2E journey penuh (login, checkout, validasi state) secara stabil dan dapat direproduksi lintas environment.  
**Sumber:** https://github.com/microsoft/playwright-mcp


### 5. **GitHub** (`github`)

**Deskripsi:** MCP server resmi GitHub untuk menghubungkan AI agent ke context dan capability GitHub (repo, issue, PR, actions, dst).  
**Fungsi:** Kontrol granular via toolsets/tools, mode `--read-only` untuk safety, dan `--lockdown-mode` untuk membatasi konten publik berisiko.  
**Hal gila yang bisa dilakukan:** Agen bisa mengerjakan alur end-to-end dari baca issue -> buat branch -> commit -> buka PR -> pantau checks, sambil tetap dibatasi policy akses.  
**Sumber:** https://github.com/github/github-mcp-server

### 6. **Chrome DevTools MCP** (`ChromeDevTools`)

**Deskripsi:** MCP server resmi untuk memberi agen AI akses langsung ke browser Chrome hidup lewat DevTools protocol, jadi bisa inspeksi, otomasi, dan analisis performa dalam satu alur.  
**Fungsi:**
- Otomasi browser yang reliable (berbasis Puppeteer) untuk navigasi dan interaksi UI.
- Deep debugging: inspeksi request network, console, screenshot, dan state halaman.
- Performance analysis: rekam trace dan ambil insight performa yang actionable.
- Flexible connection: bisa launch Chrome baru, auto-connect ke Chrome yang sudah jalan, atau connect via `--browser-url` / `--wsEndpoint` + custom headers.
- Kontrol scope server: category tools bisa diatur (mis. performance/network/emulation) sesuai kebutuhan dan risiko.
**Hal gila yang bisa dilakukan:**
- Jalankan “synthetic user journey” lengkap (login -> transaksi -> checkout) sambil throttling network/performance untuk cari bottleneck yang biasanya baru muncul di kondisi buruk.
- Bikin agen auto-troubleshooter: saat flow gagal, agen langsung korelasikan network error + console error + screenshot + performance trace dalam satu laporan RCA.
- Remote-debug Chrome yang berjalan di host/VM/container berbeda (port forwarding/WebSocket), jadi investigasi bug environment-spesifik bisa langsung dari chat.
- Hybrid manual+AI debugging: kamu klik manual di browser yang sama, agen ikut inspeksi state real-time dan lanjutkan langkah investigasi tanpa reset sesi.
**Sumber:** https://github.com/mcp/ChromeDevTools/chrome-devtools-mcp  
**Sumber tools/reference:** https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md

### 7. **Serena** (`oraios`)

**Deskripsi:** Toolkit coding agent berbasis MCP yang memberi LLM kemampuan IDE-like di level simbol (bukan sekadar baca file full/grep string).  
**Fungsi:**
- Semantic retrieval & editing: cari simbol, relasi referensi simbol, dan edit presisi pada entity kode.
- Project-based workflow untuk codebase besar, jadi agen bisa navigasi struktur proyek lebih efisien token.
- Integrasi fleksibel: bisa dipakai lewat MCP client (Codex/Claude/IDE), via OpenAPI bridge, atau di-embed ke framework agen.
- Extensible toolkit: bisa tambah tool custom dan dukung bahasa baru lewat fondasi LSP.
**Hal gila yang bisa dilakukan:**
- Refactor lintas banyak file secara “surgical”: agen temukan symbol call graph dulu, lalu patch hanya titik yang benar tanpa brute-force replace.
- Bangun agent coding portable lintas model/vendor: backend LLM bisa ganti tanpa nulis ulang lapisan tool coding.
- Jalankan “architectural migration” bertahap (rename API, ubah contract, update referensi) dengan jejak perubahan lebih aman karena berbasis simbol.
- Kombinasi dengan agent utama (mis. Claude/Codex) untuk mengurangi token burn pada repo besar tapi tetap presisi edit tinggi.
**Sumber:** https://github.com/oraios/serena  
**Sumber docs:** https://oraios.github.io/serena/

### 8. **Unity** (`CoplayDev`)

**Deskripsi:** MCP bridge yang menghubungkan AI agent ke Unity Editor lewat kombinasi Unity package + local server.  
**Fungsi:**
- Mengontrol Unity Editor via natural language (asset, scene, material, script, editor actions).
- Mengotomasi workflow repetitif game dev langsung dari chat agent.
- Menyediakan integrasi praktis dengan client MCP seperti Claude/Cursor.  
**Hal gila yang bisa dilakukan:**
- “AI technical artist mode”: generate/modify asset pipeline + scene setup secara semi-otomatis.
- Auto-prototyping gameplay loop: agent bisa bantu ubah script, trigger test di editor, lalu iterasi cepat.
- Bangun workflow CI-like lokal untuk validasi perubahan project Unity berbasis prompt.  
**Sumber:** https://github.com/CoplayDev/unity-mcp


### 9. **Firecrawl** (`firecrawl`)

**Deskripsi:** MCP server resmi Firecrawl untuk scraping, crawling, search, extract, dan deep research web.  
**Fungsi:**
- Ekstraksi konten skala besar dari web (single URL hingga batch crawl).
- Menyediakan mode remote hosted maupun self-hosted.
- Memiliki retry, rate-limit handling, credit monitoring, dan logging untuk operasi produksi.  
**Hal gila yang bisa dilakukan:**
- Agen bisa bikin “web intelligence pipeline” otomatis: map situs -> crawl -> extract -> ranking -> ringkasan.
- Deep research lintas ratusan halaman dengan batch scraping tanpa manual copy-paste.
- Jalankan knowledge ingestion yang tahan gangguan jaringan/rate-limit berkat retry & backoff bawaan.  
**Sumber:** https://docs.firecrawl.dev/mcp-server


### 10. **Desktop Commander** (`wonderwhy-er`)

**Deskripsi:** MCP tool untuk memberi AI akses terminal, proses, file operation, dan code editing (search/replace) di level OS.  
**Fungsi:**
- Menjalankan command panjang + kontrol proses interaktif.
- Menjelajah file system lintas project dan melakukan perubahan file presisi.
- Menyatukan workflow dev-tools dalam satu chat tanpa konteks terfragmentasi.  
**Hal gila yang bisa dilakukan:**
- Agen bisa orchestration “local DevOps mini”: build, test, restart service, parse log, apply fix dalam loop otomatis.
- Cross-project refactor di banyak repo sekaligus dari satu sesi chat.
- Menjalankan task otomasi non-IDE (ops + scripting + docs generation) yang biasanya butuh banyak tool terpisah.  
**Sumber:** https://github.com/wonderwhy-er/DesktopCommanderMCP


### 11. **Notion** (`makenotion`)

**Deskripsi:** MCP server resmi Notion API untuk akses page, comment, dan data source dengan transport stdio/http.  
**Fungsi:**
- Query/update data source (pengganti database tools pada v2+).
- Membaca/menulis konten Notion termasuk workflow komentar dan manajemen halaman.
- Mendukung konfigurasi auth fleksibel (`NOTION_TOKEN` atau custom headers).  
**Hal gila yang bisa dilakukan:**
- Agen bisa jadi “ops copilot” workspace: auto-update page status, summary meeting, dan knowledge sync ke data source.
- Pipeline dokumentasi otomatis: commit code -> generate release note -> publish ke Notion.
- Multi-client integration (Cursor, Claude Desktop, HTTP) dengan control keamanan token yang rapi.  
**Sumber:** https://github.com/makenotion/notion-mcp-server


### 12. **Azure MCP Server** (`microsoft`)

**Deskripsi:** Server MCP resmi Azure untuk menghubungkan AI agent ke layanan Azure dalam satu endpoint tools.  
**Fungsi:**
- Menyediakan kumpulan tools Azure terpadu untuk operasi cloud agentic.
- Bisa dipakai standalone atau bersama ekstensi GitHub Copilot for Azure.
- Mengikuti perubahan protokol terbaru (transport SSE deprecated; fokus mode kompatibel modern).  
**Hal gila yang bisa dilakukan:**
- Agen bisa orkestrasi workflow cloud end-to-end: provision resource, cek status, troubleshooting, dan rekomendasi aksi.
- “Cloud copilot in chat”: investigasi environment Azure tanpa harus pindah antar banyak portal/manual steps.
- Foundation untuk self-healing ops runbook berbasis prompt + policy guardrail.  
**Sumber:** https://github.com/Azure/azure-mcp

### 13. **Supabase** (`supabase-community`)

**Deskripsi:** MCP server Supabase untuk menghubungkan AI assistant ke project Supabase (hosted, local CLI, dan self-hosted).  
**Fungsi:**
- Mengelola tabel, konfigurasi proyek, dan query data langsung dari agent.
- Mendukung endpoint remote `https://mcp.supabase.com/mcp` dengan login OAuth.
- Mendukung mode lokal (`http://localhost:54321/mcp`) untuk development environment.  
**Hal gila yang bisa dilakukan:**
- Agen bisa menjalankan alur “database ops copilot”: inspect schema -> generate migration -> validasi query -> cek hasil data.
- Workflow fullstack super cepat: dari prompt ke perubahan DB + verifikasi API tanpa bolak-balik tool.
- Bisa dipakai aman bertahap dengan praktik security best practices resmi Supabase.  
**Sumber:** https://github.com/supabase-community/supabase-mcp  
**Sumber docs:** https://supabase.com/docs/guides/getting-started/mcp

### 14. **DBHub** (`bytebase`)

**Deskripsi:** Universal database MCP gateway dari Bytebase untuk PostgreSQL, MySQL, MariaDB, SQL Server, dan SQLite.  
**Fungsi:**
- Satu interface MCP untuk banyak engine database sekaligus.
- Mendukung secure mode: read-only, SSH tunnel, SSL/TLS, row limit, lock-timeout.
- Multi-database config (TOML) untuk mengelola beberapa environment dalam satu server.  
**Hal gila yang bisa dilakukan:**
- Agen bisa compare schema lintas environment (dev/staging/prod) dari satu endpoint MCP.
- Run SQL explain/ops lintas banyak database tanpa ganti tool atau koneksi manual.
- Bangun “DB SRE copilot” yang investigasi performa query secara terpusat.  
**Sumber:** https://github.com/bytebase/dbhub

### 15. **Microsoft Learn** (`MicrosoftDocs`)

**Deskripsi:** MCP resmi Microsoft Learn untuk memberi LLM akses real-time ke dokumentasi dan sample code Microsoft tepercaya.  
**Fungsi:**
- Endpoint langsung `https://learn.microsoft.com/api/mcp` untuk client MCP kompatibel.
- Mengurangi halusinasi karena sumber hanya dari dokumen first-party Microsoft.
- Tersedia varian endpoint openai-compatible untuk use case tertentu.  
**Hal gila yang bisa dilakukan:**
- Agen coding bisa auto-ground jawaban ke docs terbaru Microsoft sehingga patch lebih kecil risiko “API salah”.
- Bisa dipakai mass coding session tanpa API key untuk riset doc berkapasitas tinggi.
- Gabungkan dengan server Azure/DevOps untuk alur learn -> implement -> deploy dalam satu chat.  
**Sumber:** https://github.com/MicrosoftDocs/mcp

### 16. **Azure DevOps** (`microsoft`)

**Deskripsi:** MCP server resmi Azure DevOps dengan toolset tipis di atas REST API untuk work item, repo, wiki, pipeline, dan domain lain.  
**Fungsi:**
- Tool domain-based loading (`core`, `work-items`, `repositories`, `wiki`, `pipelines`, dll) agar context tetap fokus.
- Memungkinkan automation task Azure DevOps langsung dari AI assistant.
- Didukung workflow best-practice untuk Copilot/VS Code/Claude/Cursor.  
**Hal gila yang bisa dilakukan:**
- Agent PM+Engineer hybrid: auto triage backlog, update work item, sync wiki, dan trigger pipeline dari satu prompt.
- “Scoped tool governance”: hanya load domain yang dibutuhkan untuk menekan noise tool dan mengurangi salah aksi.
- Integrasi audit-friendly karena setiap aksi mengikuti endpoint DevOps yang jelas.  
**Sumber:** https://github.com/microsoft/azure-devops-mcp

### 17. **Stripe** (`stripe`)

**Deskripsi:** MCP server Stripe (remote dan local) untuk integrasi customer, product, payments, billing, dan operasi finansial via agent.  
**Fungsi:**
- Endpoint remote resmi `https://mcp.stripe.com` dengan OAuth.
- Opsi local server via `npx @stripe/mcp` untuk kontrol toolset langsung.
- Terintegrasi dalam ekosistem Stripe AI + Agent Toolkit.  
**Hal gila yang bisa dilakukan:**
- Agen bisa jadi “billing operator”: buat produk/harga, kelola subscription, analisis payment issue, lalu eksekusi perbaikan.
- Automasi support-finance: dari ticket pelanggan -> lookup transaksi -> aksi refund/adjustment terkontrol.
- Bangun agent commerce end-to-end dengan guardrail tool selection per kebutuhan.  
**Sumber:** https://github.com/stripe/stripe-agent-toolkit  
**Sumber MCP registry:** https://github.com/mcp/com.stripe/mcp

### 18. **Terraform** (`hashicorp`)

**Deskripsi:** MCP server Terraform resmi HashiCorp untuk workflow IaC, termasuk baca provider docs, module docs, dan best-practice guidance.  
**Fungsi:**
- Menyediakan tool MCP untuk menemukan dokumentasi provider/module Terraform secara tepat.
- Mendukung alur AI-assisted infra planning tanpa harus browsing docs manual.
- Bisa dijalankan lokal atau via Docker.  
**Hal gila yang bisa dilakukan:**
- Agen infra bisa generate draft konfigurasi dengan referensi docs provider real-time, lalu iterasi lebih aman.
- IaC troubleshooting lebih cepat karena agent bisa cross-check argumen resource langsung ke docs resmi.
- Foundation untuk “policy-aware infra copilot” pada pipeline provisioning.  
**Sumber:** https://github.com/hashicorp/terraform-mcp-server

### 19. **Tavily** (`tavily-ai`)

**Deskripsi:** Tavily MCP memberikan akses search web real-time untuk AI agent dengan fokus riset dan retrieval berkualitas tinggi.  
**Fungsi:**
- Endpoint remote resmi (`https://mcp.tavily.com/mcp`) dengan OAuth untuk integrasi cepat.
- Mendukung use case research agent, fact retrieval, dan context expansion.
- Bisa dipakai dari berbagai client MCP (Claude, Cursor, dsb).  
**Hal gila yang bisa dilakukan:**
- Agen bisa menjalankan deep research multi-hop (pertanyaan -> search -> refine -> verifikasi) otomatis.
- Kombinasi dengan coding agent untuk auto-cite referensi saat menulis dokumentasi teknis.
- Pipeline intel ringan real-time untuk monitoring perubahan informasi eksternal.  
**Sumber:** https://github.com/tavily-ai/tavily-mcp

### 20. **Mongodb** (`mongodb-js`)

**Deskripsi:** MongoDB MCP server resmi untuk memberi AI assistant akses data MongoDB yang aman dan kontekstual.  
**Fungsi:**
- Integrasi langsung ke MongoDB deployment untuk query/inspection berbasis agent.
- Mendukung mode local process atau remote server sesuai arsitektur tim.
- Menyediakan lapisan “secure, controlled access” agar interaksi data tetap terjaga.  
**Hal gila yang bisa dilakukan:**
- Agen data bisa menjawab pertanyaan bisnis langsung dari collection hidup tanpa export manual.
- Workflow debugging aplikasi: trace issue -> query data terkait -> sarankan perbaikan dalam satu sesi.
- Fondasi “database copilot” untuk tim support, product, dan engineering secara bersamaan.  
**Sumber:** https://github.com/mongodb-js/mongodb-mcp-server

### 21. **Nuxt** (`antfu`)

**Deskripsi:** Nuxt MCP server resmi untuk memberi assistant akses dokumentasi, command, dan utilitas proyek Nuxt.  
**Fungsi:**
- Menyediakan konteks framework-specific agar code suggestion lebih akurat.
- Mendukung alur development Nuxt via tool MCP terstruktur.
- Integrasi mudah dengan client MCP yang umum dipakai developer.  
**Hal gila yang bisa dilakukan:**
- Agen bisa bantu migrasi Nuxt version upgrade dengan referensi docs/tooling yang relevan.
- “Framework-aware copilot”: saran code, config, dan command lebih minim trial-and-error.
- Optimasi onboarding dev baru karena agent bisa menjawab Nuxt-specific workflow secara presisi.  
**Sumber:** https://github.com/nuxtlabs/mcp

### 22. **Apify** (`apify`)

**Deskripsi:** Apify MCP server resmi untuk menjalankan aktor scraping/automation Apify dari AI agent.  
**Fungsi:**
- Menjalankan actor ecosystem Apify langsung via MCP tools.
- Mendukung integrasi data extraction berkapasitas besar ke workflow agentic.
- Menyederhanakan orkestrasi crawl/scrape tanpa wiring custom API per actor.  
**Hal gila yang bisa dilakukan:**
- Agen bisa orkestrasi pipeline scraping multi-sumber (news, e-commerce, directory) lalu gabungkan output otomatis.
- Build “market intelligence bot” real-time dengan actor yang berbeda per sumber data.
- Otomasi monitoring competitor/site change tanpa stack scraper kustom dari nol.  
**Sumber:** https://github.com/apify/actors-mcp-server

### 23. **Vercel Next Dev Tools** (`vercel`)

**Deskripsi:** MCP server resmi Next.js dari Vercel yang memberi agent akses tooling build, docs, dan workflow framework-level.  
**Fungsi:**
- Menyediakan context Next.js yang lebih presisi untuk coding assistant.
- Mendukung integrasi langsung dengan berbagai client MCP.
- Mengurangi trial-and-error saat debugging atau implementasi fitur Next.js.  
**Hal gila yang bisa dilakukan:**
- Agen bisa bantu refactor route/data-fetching mengikuti praktik Next.js terbaru.
- Auto-diagnose error build/runtime dengan konteks framework yang benar.
- Setup “Next.js pair programmer” yang fokus framework, bukan generic JS assistant.  
**Sumber:** https://github.com/vercel/next.js/tree/canary/packages/next/src/mcp

### 24. **Elasticsearch** (`elastic`)

**Deskripsi:** Elasticsearch MCP server resmi untuk query/search/ops observability di stack Elastic.  
**Fungsi:**
- Menyambungkan agent ke data Elasticsearch untuk retrieval dan analisis.
- Mendukung operasi berbasis MCP terhadap cluster/index yang dikonfigurasi.
- Mempercepat investigasi log/search analytics lewat percakapan.  
**Hal gila yang bisa dilakukan:**
- Agen incident-response bisa langsung query log, korelasi error, lalu usulkan mitigasi.
- “Search tuning copilot”: bantu evaluasi query dan struktur indeks dari hasil real-time.
- Investigasi data operasional lintas service tanpa pindah dashboard manual.  
**Sumber:** https://github.com/elastic/mcp-server-elasticsearch

### 25. **Getsentry Sentry** (`getsentry`)

**Deskripsi:** Sentry MCP server resmi untuk observability, issue triage, dan insight debugging dari event/error live.  
**Fungsi:**
- Ambil issue/error context langsung dari Sentry ke agent.
- Menyediakan workflow triage yang lebih cepat untuk tim engineering.
- Memungkinkan assistant memberikan diagnosis berbasis data incident nyata.  
**Hal gila yang bisa dilakukan:**
- Agen bisa buat prioritas incident otomatis berdasarkan signal Sentry + dampak user.
- Dari error event ke draft fix plan dalam satu chat tanpa manual buka banyak halaman.
- Bangun loop “detect -> explain -> patch proposal” dengan konteks stacktrace real-time.  
**Sumber:** https://github.com/getsentry/sentry-mcp

### 26. **Neon** (`neondatabase`)

**Deskripsi:** MCP server Neon resmi untuk mengelola project Postgres serverless Neon dari AI agent.  
**Fungsi:**
- Operasi project/database branch Neon via tool MCP.
- Mempermudah workflow development database modern (branching, inspect, manage).
- Integrasi aman dengan token/API konfigurasi Neon.  
**Hal gila yang bisa dilakukan:**
- Agen bisa bikin branch DB ephemeral untuk testing fitur, lalu buang otomatis setelah validasi.
- Workflow “schema experiment” cepat tanpa ganggu database utama.
- Kombinasi dengan coding agent untuk sinkronisasi app change + DB change lebih aman.  
**Sumber:** https://github.com/neondatabase-labs/mcp-server-neon

### 27. **Chroma** (`chroma-core`)

**Deskripsi:** Chroma MCP server untuk akses vector database Chroma dalam workflow RAG berbasis agent.  
**Fungsi:**
- Query koleksi embedding dan retrieval konteks semantik via MCP.
- Mendukung integrasi pipeline knowledge retrieval untuk LLM apps.
- Mempercepat eksperimen RAG tanpa perlu adapter custom kompleks.  
**Hal gila yang bisa dilakukan:**
- Agen bisa update index knowledge on-the-fly dari dokumen baru lalu langsung dipakai inference.
- Build “memory layer” antar-agent dengan retrieval semantik yang konsisten.
- Otomasi evaluasi kualitas retrieval sebagai bagian loop improve sistem RAG.  
**Sumber:** https://github.com/chroma-core/chroma-mcp

### 28. **SonarSource Sonarqube** (`SonarSource`)

**Deskripsi:** SonarQube MCP server resmi untuk expose analisis kualitas kode, issue, quality gates, dan project insight ke AI agent.  
**Fungsi:**
- Menyediakan toolset SonarQube (analysis, issues, quality gates, projects) via MCP.
- Mendukung koneksi ke SonarQube Cloud maupun SonarQube Server.
- Punya opsi read-only dan kontrol toolset untuk governance penggunaan.  
**Hal gila yang bisa dilakukan:**
- Agen bisa jadi “quality gate enforcer”: cek gate -> jelaskan blocker -> sarankan patch per issue.
- Otomasi triage technical debt lintas repository dari satu chat.
- Integrasi langsung ke coding agent flow supaya feedback kualitas terjadi sebelum merge.  
**Sumber:** https://github.com/SonarSource/sonarqube-mcp-server

### 29. **Monday** (`mondaycom`)

**Deskripsi:** Framework MCP monday.com untuk menghubungkan AI agent ke work OS monday secara aman dan action-oriented.  
**Fungsi:**
- Hosted MCP + paket API MCP untuk operasi board/item/form/team.
- Akses data terstruktur dan aksi operasional (create/update/move item, schema, dst).
- Mendukung mode read-only untuk skenario aman.  
**Hal gila yang bisa dilakukan:**
- Agen PM bisa auto-generate board proyek dari requirement lalu maintain status harian.
- Workflow “ops command center”: dari prompt bisa update task, assign owner, dan kirim update progres.
- Orkestrasi lintas tim (product/engineering/ops) di satu workspace tanpa manual klik berulang.  
**Sumber:** https://github.com/mondaycom/mcp

### 30. **Atlassian** (`atlassian`)

**Deskripsi:** Atlassian remote MCP server resmi untuk koneksi aman ke Jira, Confluence, dan Compass via OAuth 2.1.  
**Fungsi:**
- Endpoint cloud `https://mcp.atlassian.com/v1/mcp` untuk client MCP kompatibel.
- Menjaga permission sesuai hak akses user Atlassian Cloud.
- Data/security model enterprise-friendly (TLS + scoped auth).  
**Hal gila yang bisa dilakukan:**
- Agent knowledge+delivery: tarik context Confluence, update Jira issue, sinkronkan keputusan tim dalam satu flow.
- Otomasi “incident-to-postmortem” dari ticket ke documentation tanpa copy-paste manual.
- Multi-product context retrieval (Jira + Confluence + Compass) untuk keputusan engineering cepat.  
**Sumber:** https://github.com/atlassian/atlassian-mcp-server

### 31. **Todoist** (`Doist`)

**Deskripsi:** Todoist AI/MCP SDK resmi dari Doist untuk memberi agent akses baca/tulis task Todoist atas nama pengguna.  
**Fungsi:**
- Mendukung penggunaan sebagai MCP server maupun sebagai library tools.
- Endpoint remote `https://ai.todoist.net/mcp` untuk integrasi cepat.
- Fokus pada workflow task-level yang langsung bisa dieksekusi agent.  
**Hal gila yang bisa dilakukan:**
- Agen personal ops: ubah obrolan panjang jadi action plan terstruktur di Todoist.
- Sync otomatis dari meeting notes ke backlog harian lengkap due-date dan prioritas.
- Kombinasi dengan tools coding/dev untuk membuat “engineer daily planner” real-time.  
**Sumber:** https://github.com/mcp/doist/todoist-ai

### 32. **Imagesorcery** (`sunriseapps`)

**Deskripsi:** MCP image-processing server yang berjalan lokal untuk blur, crop, OCR, object detection, watermark, dan manipulasi visual lain.  
**Fungsi:**
- Banyak tool image ops dalam satu server (draw, resize, rotate, detect, OCR, dll).
- Mendukung pipeline pemrosesan gambar tanpa kirim data ke server eksternal.
- Bisa dijalankan di stdio maupun HTTP transport mode.  
**Hal gila yang bisa dilakukan:**
- Agen bisa memproses ribuan aset visual otomatis (deteksi objek -> crop -> annotate -> export metadata).
- OCR + field detection untuk semi-otomasi ekstraksi form dari gambar dokumen.
- Workflow kreatif “prompt-to-batch-edit” untuk marketing asset dalam hitungan menit.  
**Sumber:** https://github.com/sunriseapps/imagesorcery-mcp

### 33. **Figma MCP Server** (`figma`)

**Deskripsi:** Server MCP resmi Figma (beta) untuk membawa konteks desain langsung ke coding agent, baik remote maupun local desktop server.  
**Fungsi:**
- Mengambil konteks frame, komponen, variable, dan layout untuk code generation lebih akurat.
- Mendukung endpoint remote (`https://mcp.figma.com/mcp`) dan local (`http://127.0.0.1:3845/mcp`).
- Membantu menjaga konsistensi implementasi dengan design system.  
**Hal gila yang bisa dilakukan:**
- Agen bisa konversi selected frame jadi code sambil menjaga struktur komponen.
- “Design-to-code QA”: bandingkan intent desain dan implementasi lebih cepat.
- Workflow handoff super cepat antara designer dan engineer via satu jalur MCP.  
**Sumber:** https://github.com/mcp/figma/mcp-server

### 34. **Azure AI Foundry** (`microsoft-foundry`)

**Deskripsi:** MCP Foundry untuk Azure AI Foundry yang menyediakan tools terpadu model, knowledge, evaluasi, deployment, dan agent orchestration.  
**Fungsi:**
- Cloud-hosted interface (preview) tanpa perlu deploy server MCP sendiri.
- Identity & access control via Microsoft Entra ID (on-behalf-of flow).
- Toolset skenario untuk operasi read/write pada resource Foundry.  
**Hal gila yang bisa dilakukan:**
- Multi-agent orchestration di Foundry dengan kontrol akses enterprise.
- Agent lifecycle copilot: dari eksperimen model -> evaluasi -> deployment -> iterasi.
- “AI platform operator” berbasis prompt yang tetap mengikuti batas permission user.  
**Sumber:** https://github.com/mcp/azure-ai-foundry/mcp-foundry

### 35. **Dynatrace** (`dynatrace-oss`)

**Deskripsi:** Dynatrace MCP server untuk membawa observability data (logs/events/metrics/security problems) ke asisten AI secara real-time.  
**Fungsi:**
- Eksekusi DQL, ambil detail problem, dan investigasi entity dari chat.
- Dapat kirim notifikasi Slack / setup workflow otomatis (sesuai tool yang tersedia).
- Mendukung stdio maupun HTTP transport untuk deployment fleksibel.  
**Hal gila yang bisa dilakukan:**
- Agen bisa otomatis bikin timeline insiden dari DQL + entity relation + ownership.
- Incident bot yang bukan cuma deteksi, tapi juga trigger workflow notifikasi/eskalasi.
- Query observability skala besar dengan warning biaya konsumsi Grail yang terukur.  
**Sumber:** https://github.com/dynatrace-oss/dynatrace-mcp

### 36. **Hugging Face** (`huggingface`)

**Deskripsi:** MCP server resmi Hugging Face untuk menghubungkan LLM ke Hub API dan ribuan aplikasi Gradio/Spaces.  
**Fungsi:** Mendukung endpoint remote `https://huggingface.co/mcp`, mode login/OAuth, dan transport MCP modern untuk berbagai client.  
**Hal gila yang bisa dilakukan:** Agen bisa chaining pencarian model/dataset + panggil Space langsung dari chat untuk prototyping AI super cepat.  
**Sumber:** https://github.com/huggingface/hf-mcp-server

### 37. **Postman** (`postmanlabs`)

**Deskripsi:** Postman MCP Server resmi untuk menghubungkan agen ke workspace, collection, environment, dan evaluasi API Postman.  
**Fungsi:** Menyediakan mode `minimal`, `code`, dan `full` (100+ tools), termasuk dukungan region US/EU.  
**Hal gila yang bisa dilakukan:** Agen bisa generate client code dari definisi API lalu validasi behavior endpoint di flow yang sama.  
**Sumber:** https://github.com/postmanlabs/postman-mcp-server

### 38. **Svelte MCP** (`sveltejs`)

**Deskripsi:** MCP server resmi ekosistem Svelte untuk membantu coding assistant memahami docs dan pola Svelte/SvelteKit.  
**Fungsi:** Menyediakan context framework-level agar saran kode lebih sesuai praktik Svelte.  
**Hal gila yang bisa dilakukan:** Agen bisa auto-fix pola anti-pattern Svelte saat refactor komponen dalam batch perubahan besar.  
**Sumber:** https://github.com/sveltejs/mcp

### 39. **Glean Remote MCP Server** (`gleanwork`)

**Deskripsi:** Glean menyediakan remote MCP connectivity untuk membawa tool pihak ketiga ke Assistant/Agents dengan kontrol admin terpusat.  
**Fungsi:** Admin dapat mengatur server MCP yang tersedia, termasuk human-in-the-loop untuk write tools.  
**Hal gila yang bisa dilakukan:** Bangun “enterprise super-agent” yang menggabungkan knowledge internal + tool eksternal dari satu antarmuka Glean.  
**Sumber:** https://docs.glean.com/administration/actions/connect-remote-mcp-servers-to-glean

### 40. **Logfire** (`pydantic`)

**Deskripsi:** MCP server Logfire untuk akses trace/metric OpenTelemetry dari project Logfire.  
**Fungsi:** Tool utama mencakup pencarian exception, arbitrary query, schema reference, dan deep link trace.  
**Hal gila yang bisa dilakukan:** Agen bisa melakukan RCA otomatis dengan query telemetry lalu langsung menunjuk file/sumber error paling relevan.  
**Sumber:** https://github.com/mcp/pydantic/logfire-mcp

### 41. **Azure Kubernetes Service** (`Azure`)

**Deskripsi:** Implementasi MCP Kubernetes dari Azure untuk interaksi natural-language ke cluster Kubernetes/AKS.  
**Fungsi:** Mendukung unified `call_kubectl`, mode tools legacy, serta access level `readonly/readwrite/admin`.  
**Hal gila yang bisa dilakukan:** Agent SRE bisa diagnose pod bermasalah + jalankan perintah remediasi terkontrol dari satu percakapan.  
**Sumber:** https://github.com/Azure/mcp-kubernetes

### 42. **Webflow** (`webflow`)

**Deskripsi:** MCP server resmi Webflow untuk interaksi AI dengan Webflow API + koneksi bridge app ke Designer.  
**Fungsi:** Mendukung remote OAuth dan local installation untuk editing/publishing workflow berbasis AI.  
**Hal gila yang bisa dilakukan:** Agen bisa generate/update konten + struktur halaman langsung dari insight SEO/editorial prompt.  
**Sumber:** https://github.com/mcp/webflow/mcp-server

### 43. **Octopus Deploy** (`OctopusDeploy`)

**Deskripsi:** MCP server resmi Octopus untuk inspect, query, dan diagnosis deployment/release di instance Octopus.  
**Fungsi:** Tersedia banyak tools read-only untuk project, release, target, certificate, account, hingga live status Kubernetes.  
**Hal gila yang bisa dilakukan:** Agen DevOps bisa menjawab “kenapa deploy gagal” dengan menelusuri data rilis, target, dan log operasional otomatis.  
**Sumber:** https://github.com/OctopusDeploy/mcp-server

### 44. **Fabric Real-Time Intelligen...** (`microsoft`)

**Deskripsi:** MCP server Fabric RTI (preview) untuk query/analis data real-time di Eventhouse dan Azure Data Explorer.  
**Fungsi:** Menjembatani natural language ke KQL serta discovery skema/metadata melalui tool MCP.  
**Hal gila yang bisa dilakukan:** Agen analitik bisa menjalankan investigasi near real-time terhadap event stream tanpa perlu pindah tool manual.  
**Sumber:** https://learn.microsoft.com/en-us/fabric/real-time-intelligence/mcp-overview  
**Sumber repo:** https://github.com/microsoft/fabric-rti-mcp

### 45. **Snyk** (`snyk`)

**Deskripsi:** MCP integration untuk security scanning berbasis Snyk digunakan untuk membuka insight kerentanan langsung ke agen.  
**Fungsi:** Fokus pada vulnerability intelligence dan remediation guidance dalam workflow coding/security review.  
**Hal gila yang bisa dilakukan:** Agent security bisa melakukan pre-merge dependency risk triage sebelum perubahan masuk branch utama.  
**Sumber:** https://docs.snyk.io/  
**Catatan:** repositori MCP resmi dari Snyk tidak ditemukan secara eksplisit saat riset ini.

### 46. **Sonatype Dependency Ma...** (`sonatype`)

**Deskripsi:** Sonatype MCP server resmi untuk dependency intelligence, license compliance, dan vulnerability governance.  
**Fungsi:** Mendukung tools pemilihan versi, security advisories, dan rekomendasi upgrade komponen.  
**Hal gila yang bisa dilakukan:** Agen bisa menolak dependency berisiko dan mengusulkan versi upgrade paling aman secara otomatis.  
**Sumber:** https://github.com/sonatype/dependency-management-mcp-server

### 47. **pgEdge Postgres** (`pgEdge`)

**Deskripsi:** MCP server pgEdge untuk akses Postgres ops dengan fokus observability skema/performa dan keamanan koneksi.  
**Fungsi:** Menyediakan schema introspection, metrics performa, dan dukungan multi-database pada implementasi toolkit pgEdge.  
**Hal gila yang bisa dilakukan:** Agent DB dapat membandingkan dev/staging/prod dan menemukan query lambat tanpa setup tooling tambahan.  
**Sumber:** https://www.pgedge.com/blog/introducing-the-pgedge-postgres-mcp-server

### 48. **UI5** (`UI5`)

**Deskripsi:** UI5 MCP server resmi untuk bantu pengembangan aplikasi UI5 dengan tools framework-specific.  
**Fungsi:** Mendukung scaffolding app, API reference, guideline best-practice, linting, dan project info retrieval.  
**Hal gila yang bisa dilakukan:** Agen bisa auto-bootstrap app UI5 lalu lint+fix issue framework secara iteratif dari chat.  
**Sumber:** https://github.com/UI5/mcp-server

### 49. **DeepWiki** (`CognitionAI`)

**Deskripsi:** DeepWiki MCP server menyediakan dokumen dan tanya-jawab repo GitHub publik via layanan DeepWiki.  
**Fungsi:** Tool utama mencakup `ask_question`, `read_wiki_structure`, dan `read_wiki_contents`.  
**Hal gila yang bisa dilakukan:** Agen bisa “ngobrol” dengan codebase publik besar tanpa cloning lokal repo.  
**Sumber:** https://github.com/mcp/cognitionai/deepwiki

### 50. **Clarity** (`microsoft`)

**Deskripsi:** MCP server resmi Microsoft Clarity untuk analytics dashboard, session recordings, dan docs query.  
**Fungsi:** Menyediakan query natural-language ke metrik traffic/behavior + filtering dimensi secara langsung.  
**Hal gila yang bisa dilakukan:** Agent growth bisa menemukan friction UX dari rekaman sesi dan langsung usulkan eksperimen perbaikan.  
**Sumber:** https://github.com/microsoft/clarity-mcp-server

### 51. **ScrapeGraphAI Scrapegraph** (`ScrapeGraphAI`)

**Deskripsi:** ScrapeGraph MCP server untuk web scraping berbasis AI dengan tool crawling, markdownify, dan extraction schema-aware.  
**Fungsi:** Mendukung async crawling, infinite scroll, JS-heavy pages, serta agentic multi-step scraping.  
**Hal gila yang bisa dilakukan:** Agen riset bisa crawl multi-domain lalu hasilkan dataset terstruktur siap analisis otomatis.  
**Sumber:** https://github.com/ScrapeGraphAI/scrapegraph-mcp

### 52. **Arm MCP Server** (`arm`)

**Deskripsi:** Integrasi MCP bertema ARM dipakai untuk menghadirkan konteks tooling/ekosistem ARM ke agent workflow.  
**Fungsi:** Umumnya diposisikan untuk assist pengembangan/perencanaan terkait platform ARM.  
**Hal gila yang bisa dilakukan:** Agen bisa bantu pemetaan kompatibilitas stack aplikasi terhadap target ARM secara conversational.  
**Catatan:** sumber resmi terpusat belum ditemukan saat riset ini.

### 53. **Miro** (`miroapp`)

**Deskripsi:** Miro menyediakan hosted MCP server untuk akses board organisasi dengan OAuth 2.1.  
**Fungsi:** Memungkinkan AI membaca konteks board, menghasilkan diagram, dan bantu transform board jadi implementasi.  
**Hal gila yang bisa dilakukan:** Ubah PRD/GitHub URL menjadi diagram arsitektur Miro otomatis lalu lanjut jadi backlog implementasi.  
**Sumber:** https://developers.miro.com/docs/miro-mcp

### 54. **Codacy** (`codacy`)

**Deskripsi:** Codacy MCP server resmi untuk akses repository quality, coverage, security findings, dan PR analysis.  
**Fungsi:** Menyediakan tool quality/security lintas organisasi/repo termasuk analisis issue detail.  
**Hal gila yang bisa dilakukan:** Agen reviewer bisa menjalankan audit PR otomatis berbasis issue + diff coverage sebelum merge.  
**Sumber:** https://github.com/codacy/codacy-mcp-server

### 55. **PagerDuty** (`PagerDuty`)

**Deskripsi:** MCP server resmi PagerDuty untuk incident, service, schedule, dan event orchestration operations.  
**Fungsi:** Default read-only, bisa aktifkan write tools dengan flag khusus (`--enable-write-tools`).  
**Hal gila yang bisa dilakukan:** Agent on-call dapat triage incident, buat override jadwal, dan orkestrasi eskalasi tanpa keluar dari IDE/chat.  
**Sumber:** https://github.com/PagerDuty/pagerduty-mcp-server

### 56. **Amplitude** (`amplitude`)

**Deskripsi:** Amplitude MCP menghubungkan AI tool ke behavioral analytics Amplitude melalui OAuth dan permission account yang ada.  
**Fungsi:** Bisa query insight, membuat chart/dashboard/cohort, dan akses data eksperimen/feature flag.  
**Hal gila yang bisa dilakukan:** Product agent bisa menganalisis funnel lalu langsung usulkan eksperimen dari hasil data real-time.  
**Sumber:** https://amplitude.com/mcp-server

### 57. **Microsoft MCP Server for ...** (`microsoft`)

**Deskripsi:** Label ini merujuk pada varian server Microsoft spesifik yang tidak tampil utuh di sumber gambar (`...`).  
**Fungsi:** Secara umum dipakai untuk membuka kapabilitas layanan Microsoft tertentu ke agentic workflow.  
**Hal gila yang bisa dilakukan:** Integrasi lintas layanan Microsoft dengan kontrol identitas dan policy enterprise.  
**Sumber referensi:** https://github.com/microsoft/mcp  
**Catatan:** nama produk lengkap tidak terlihat pada data gambar.

### 58. **PubNub MCP Server** (`pubnub`)

**Deskripsi:** MCP server PubNub resmi yang expose docs SDK/API dan operasi real-time messaging PubNub.  
**Fungsi:** Mendukung publish/subscribe, history, presence, dan account/app management via tool MCP.  
**Hal gila yang bisa dilakukan:** Agen bisa menjalankan simulasi sistem chat/event real-time end-to-end dari prompt.  
**Sumber:** https://github.com/pubnub/pubnub-mcp-server

### 59. **JustCall MCP Server** (`saaslabsco`)

**Deskripsi:** JustCall MCP server membawa kapabilitas voice/SMS JustCall ke agen LLM.  
**Fungsi:** Mendukung koneksi remote MCP untuk workflow telephony berbasis API JustCall.  
**Hal gila yang bisa dilakukan:** AI assistant bisa trigger call/SMS operasional dari alur support atau outbound otomatis.  
**Sumber:** https://mcpservers.org/servers/saaslabsco/justcall-mcp-server

### 60. **ContextStream MCP Server** (`contextstream`)

**Deskripsi:** ContextStream adalah MCP server untuk indexing docs/codebase agar mudah dicari AI assistant.  
**Fungsi:** Hybrid search (BM25 + semantic), integrasi MCP, dan opsi self-host/cloud untuk kontrol data.  
**Hal gila yang bisa dilakukan:** Agent coding bisa pakai “context pack” internal sehingga prompt lebih kecil tapi tetap kaya referensi proyek.  
**Sumber:** https://contextstream.dev/  
**Sumber docs:** https://contextstream.io/docs/mcp

### 61. **prompts.chat MCP Server** (`f`)

**Deskripsi:** prompts.chat menyediakan API MCP-first untuk search/discovery prompt secara terstruktur.  
**Fungsi:** Endpoint `https://prompts.chat/api/mcp`, dukungan key opsional, dan filter by user/category/tag.  
**Hal gila yang bisa dilakukan:** Agent bisa menarik prompt library siap pakai lalu compose workflow prompt chaining otomatis.  
**Sumber:** https://prompts.chat/docs/api

### 62. **The MCP server for GoRel...** (`goreleaser`)

**Deskripsi:** GoReleaser mendukung pembuatan/publikasi manifest MCP server (`server.json`) sebagai bagian pipeline release.  
**Fungsi:** Konfigurasi `mcp` pada `.goreleaser.yaml` untuk membuat server discoverable di MCP Registry.  
**Hal gila yang bisa dilakukan:** Satu pipeline dapat build binary + publish release + publish manifest MCP otomatis sekaligus.  
**Sumber:** https://goreleaser.com/customization/mcp/

### 63. **Launchdarkly** (`launchdarkly`)

**Deskripsi:** MCP server resmi LaunchDarkly untuk operasi feature flags/AI configs melalui agent.  
**Fungsi:** Mendukung create/update/list/get status flag lintas environment dengan opsi endpoint commercial/EU/Federal.  
**Hal gila yang bisa dilakukan:** Agen release manager bisa rollout bertahap + observasi dampak + rollback flag dari chat.  
**Sumber:** https://github.com/launchdarkly/mcp-server

### 64. **Zapier** (`zapier`)

**Deskripsi:** Zapier MCP menghubungkan AI ke ribuan aplikasi Zapier melalui actions siap pakai.  
**Fungsi:** Mendukung ribuan app connection, puluhan ribu actions, dan integrasi ke banyak MCP client resmi.  
**Hal gila yang bisa dilakukan:** Agen bisa menjalankan automasi lintas CRM, support, marketing, dan ops tanpa coding connector manual.  
**Sumber:** https://docs.zapier.com/mcp/home  
**Sumber clients:** https://docs.zapier.com/mcp/clients

### 65. **Dynatrace Managed** (`dynatrace-oss`)

**Deskripsi:** Varian penggunaan Dynatrace MCP untuk lingkungan managed/enterprise deployment.  
**Fungsi:** Tetap memanfaatkan tool observability Dynatrace (query, problem analysis, integrations) via MCP.  
**Hal gila yang bisa dilakukan:** Agent ops enterprise bisa jalankan incident diagnostics lintas tenant/environment managed.  
**Sumber:** https://github.com/dynatrace-oss/dynatrace-mcp

### 66. **Port** (`port-labs`)

**Deskripsi:** Port MCP Server resmi untuk internal developer portal, catalog, scorecard, dan RBAC operations.  
**Fungsi:** Menyediakan tools untuk entity insights, compliance scorecards, hingga create rules/permission policy.  
**Hal gila yang bisa dilakukan:** Agent platform dapat memetakan ownership service + compliance gap lalu generate action plan tim.  
**Sumber:** https://github.com/port-labs/port-mcp-server

### 67. **Rigour** (`rigour-labs`)

**Deskripsi:** Rigour dipakai sebagai server quality/risk checks untuk mendukung pengambilan keputusan engineering berbasis AI.  
**Fungsi:** Membantu validasi kualitas dan risiko pada workflow delivery secara terstruktur.  
**Hal gila yang bisa dilakukan:** Agent governance bisa menolak perubahan berisiko tinggi sebelum masuk release train.  
**Catatan:** dokumentasi/repo resmi publik untuk MCP-nya belum ditemukan saat riset ini.

### 68. **Dev Box** (`microsoft`)

**Deskripsi:** Microsoft Dev Box MCP Server menghubungkan AI agent ke operasi Dev Box via natural language.  
**Fungsi:** Mendukung lifecycle dev box, discovery pool/project, scheduling, customization, dan diagnostics tools.  
**Hal gila yang bisa dilakukan:** Agent dapat otomatis menyiapkan, memperbaiki, dan menyesuaikan dev environment tim tanpa portal hopping.  
**Sumber:** https://learn.microsoft.com/en-us/azure/dev-box/overview-what-is-dev-box-mcp-server

### 69. **Axiom** (`axiomhq`)

**Deskripsi:** Axiom MCP server resmi untuk query observability data Axiom langsung dari agent.  
**Fungsi:** Mendukung dataset/schema/APL query dan guidance penggunaan via dokumentasi resmi Axiom.  
**Hal gila yang bisa dilakukan:** Agen bisa menjalankan analisis log anomaly real-time dan menyiapkan rekomendasi mitigasi cepat.  
**Sumber:** https://github.com/axiomhq/mcp

### 70. **Stack Overflow MCP Server** (`StackExchange`)

**Deskripsi:** MCP server Stack Overflow resmi untuk akses trusted developer knowledge dari Stack Overflow.  
**Fungsi:** Remote server dengan auth akun Stack Exchange dan kuota harian untuk query retrieval.  
**Hal gila yang bisa dilakukan:** Agen coding bisa grounding jawaban ke knowledge Q&A produksi skala besar agar solusi lebih realistis.  
**Sumber:** https://api.stackexchange.com/docs/mcp-server

### 71. **Wix** (`wix`)

**Deskripsi:** Wix MCP server resmi untuk docs search, code assist, dan API calls pada Wix sites.  
**Fungsi:** Endpoint remote `https://mcp.wix.com/sse` dengan tool docs + site management APIs.  
**Hal gila yang bisa dilakukan:** Agent bisa bantu bangun fitur Wix end-to-end dari docs retrieval sampai API invocation.  
**Sumber:** https://github.com/wix/wix-mcp

### 72. **Stackhawk** (`stackhawk`)

**Deskripsi:** StackHawk MCP server mengintegrasikan DAST runtime security testing ke AI coding workflow.  
**Fungsi:** Menyediakan security analytics, YAML validation, threat surface checks, dan anti-hallucination helpers.  
**Hal gila yang bisa dilakukan:** Agen security bisa jalankan test runtime lalu memandu fix vulnerability langsung di editor.  
**Sumber:** https://docs.stackhawk.com/model-context-protocol/  
**Sumber repo:** https://github.com/mcp/stackhawk/stackhawk-mcp

### 73. **Intercom** (`intercom`)

**Deskripsi:** Intercom remote MCP server resmi untuk akses conversation/contact data secara aman via OAuth/token.  
**Fungsi:** Tool utama mencakup search/fetch universal plus API tools untuk percakapan dan kontak.  
**Hal gila yang bisa dilakukan:** Agent support bisa triage inbox berbasis konteks pelanggan tanpa buka dashboard terpisah.  
**Sumber:** https://github.com/intercom/intercom-mcp-server

### 74. **Vercel** (`vercel`)

**Deskripsi:** Vercel MCP resmi (beta) untuk mengelola project/deployment, log analysis, dan docs navigation via OAuth remote MCP.  
**Fungsi:** Endpoint `https://mcp.vercel.com` dengan tools publik + terautentikasi untuk operasi Vercel.  
**Hal gila yang bisa dilakukan:** Agent release bisa pantau deploy health, baca logs, dan sarankan rollback/fix tanpa keluar chat.  
**Sumber:** https://vercel.com/docs/ai-tooling/vercel-mcp

### 75. **JFrog Remote MCP Server** (`jfrog`)

**Deskripsi:** JFrog Remote MCP server resmi untuk akses platform JFrog (resource, artifact search, catalog/curation, security insights).  
**Fungsi:** Hosted remote + OAuth untuk integrasi langsung ke IDE/assistant tanpa kelola API key manual.  
**Hal gila yang bisa dilakukan:** Agent supply-chain bisa cek paket approved, CVE status, dan repo policy sebelum build/release.  
**Sumber:** https://github.com/jfrog/jfrog-mcp-server

### 76. **LiveCheck AI** (`qualityclouds`)

**Deskripsi:** LivecheckAI dari Quality Clouds menambahkan governance layer untuk validasi kode AI-generated secara real-time.  
**Fungsi:** Menegakkan standard kualitas, keamanan, dan compliance platform-specific pada alur coding assistant.  
**Hal gila yang bisa dilakukan:** Agent coding dapat auto-fix/flag pelanggaran policy sebelum PR dibuat, bukan sesudah CI gagal.  
**Sumber:** https://qualityclouds.com/documentation/qc/livecheckai-via-mcp/quality-clouds-mcp-for-salesforce/

### 77. **Holomodular Servicebricks** (`holomodular`)

**Deskripsi:** ServiceBricks berfokus pada generasi microservice .NET berbasis prompt dan digunakan dalam workflow AI-first engineering.  
**Fungsi:** Membantu pembentukan fondasi service/API yang cepat untuk dilanjutkan di IDE/agent coding.  
**Hal gila yang bisa dilakukan:** Agent dapat menghasilkan baseline microservice lengkap lalu meneruskan kustomisasi fitur secara iteratif.  
**Sumber:** https://servicebricks.com/  
**Sumber perusahaan:** https://holomodular.com/

### 78. **Box** (`box`)

**Deskripsi:** Box remote MCP server resmi untuk akses content Box dan Box AI tanpa memindahkan data dari Box.  
**Fungsi:** Endpoint `https://mcp.box.com` dengan OAuth, file/folder ops, search, dan Box AI capabilities.  
**Hal gila yang bisa dilakukan:** Agent enterprise bisa QA dokumen internal skala besar sambil tetap patuh kontrol akses Box.  
**Sumber:** https://github.com/mcp/box/mcp-server-box-remote  
**Sumber docs:** https://developer.box.com/guides/box-mcp/remote/

### 79. **Guru Remote MCP Server** (`guruhq`)

**Deskripsi:** Guru MCP server menghubungkan AI tools ke knowledge base Guru dan knowledge agents perusahaan.  
**Fungsi:** Mendukung search, Q&A, create/update card, dengan OAuth/API token serta RBAC enforcement.  
**Hal gila yang bisa dilakukan:** Agent internal knowledge dapat membuat/update kartu dokumentasi langsung dari percakapan kerja tim.  
**Sumber:** https://developer.getguru.com/docs/guru-mcp-server-overview  
**Sumber auth:** https://developer.getguru.com/docs/authentication-connection-setup

### 80. **Microsoft Sentinel Data Explor...** (`microsoft`)

**Deskripsi:** Tool collection MCP Microsoft Sentinel untuk eksplorasi data lake keamanan dan investigasi ancaman.  
**Fungsi:** Mendukung semantic table search + query data via endpoint data-exploration MCP yang di-host Microsoft.  
**Hal gila yang bisa dilakukan:** SOC agent bisa jalankan hunting awal berbasis natural language sebelum pivot ke investigasi mendalam.  
**Sumber overview:** https://learn.microsoft.com/en-us/azure/sentinel/datalake/sentinel-mcp-overview  
**Sumber data exploration:** https://learn.microsoft.com/en-us/azure/sentinel/datalake/sentinel-mcp-data-exploration-tool

### 81. **Anima MCP Server** (`AnimaApp`)

**Deskripsi:** Anima MCP menghubungkan coding agent ke Anima Playground, Figma design, dan design system tim.  
**Fungsi:** Endpoint publik `https://public-api.animaapp.com/v1/mcp` untuk handoff design-to-code berbasis AI.  
**Hal gila yang bisa dilakukan:** Agent bisa ambil playground/Figma lalu implement komponen production-ready sesuai pola codebase lokal.  
**Sumber:** https://docs.animaapp.com/docs/anima-mcp
