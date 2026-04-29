/* global React, SF */
const { Icon } = SF;

// ============ SCREEN 2: SENTI AI WITH RESULTS ============
const SentiAIResults = () => {
  const sessions = [
    { t: "top sales by customer", active: true },
    { t: "Deteksi customer berisiko default" },
    { t: "Forecast stok 14 hari" },
    { t: "Tampilkan area chart per BU" },
    { t: "Buat widget line trend cash inflow" },
    { t: "top customer by sales" },
    { t: "Tampilkan dashboard piutang" },
  ];
  const breakdown = [
    { code: "PS", name: "PT SUTINDO SURYA SEJAHTERA", sub: "PT-SUTINDO-SURYA-SEJAHTERA-0", val: "138.7b", color: "#3e97ff" },
    { code: "PD", name: "PT DITRACO BANGUN SARANA INTERNASIONAL", sub: "PT-DITRACO-BANGUN-SARANA-INTERNASIONAL-1", val: "47.3b", color: "#17c653" },
    { code: "PM", name: "PT MAJU TEKNIK UTAMA INDONESIA", sub: "PT-MAJU-TEKNIK-UTAMA-INDONESIA-2", val: "46.7b", color: "#f6c000" },
    { code: "PP", name: "PT PRIMA HARMONI INDUSTRI", sub: "PT-PRIMA-HARMONI-INDUSTRI-3", val: "33.4b", color: "#f8285a" },
    { code: "PA", name: "PT ALPHA INTEGRATED", sub: "PT-ALPHA-INTEGRATED-4", val: "32.6b", color: "#7239ea" },
    { code: "—", name: "Others", sub: "Others-5", val: "89.0b", color: "#94a3b8" },
  ];
  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0, background: "var(--bg)" }}>
      {/* Sessions */}
      <div style={{ width: 260, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="msg" size={15} color="#3e97ff" />
          <strong style={{ fontSize: 13 }}>Sessions</strong>
          <button className="icon-btn" style={{ width: 28, height: 28, marginLeft: "auto" }}><Icon name="plus" size={13} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {sessions.map((s, i) => (
            <div key={i} style={{
              padding: "9px 10px", borderRadius: 6, marginBottom: 2,
              background: s.active ? "var(--primary-soft)" : "transparent",
              fontSize: 12.5, color: s.active ? "var(--primary-ink)" : "var(--text-2)",
              fontWeight: s.active ? 600 : 500, cursor: "pointer",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              border: s.active ? "1px solid #cfe5ff" : "1px solid transparent"
            }}>{s.t}</div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3e97ff, #7239ea)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="sparkles" size={15} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>Senti Agent</div>
            <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>Factory Intelligence Workspace</div>
          </div>
          <span className="badge success dot" style={{ marginLeft: "auto" }}>Streaming</span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* User msg */}
          <div style={{ alignSelf: "flex-end", maxWidth: "70%" }}>
            <div style={{ background: "var(--primary)", color: "white", padding: "10px 14px", borderRadius: "14px 14px 4px 14px", fontSize: 13, fontWeight: 500 }}>top sales by customer</div>
            <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 4, textAlign: "right" }}>13:44 · just now</div>
          </div>

          {/* Agent msg */}
          <div style={{ display: "flex", gap: 10, maxWidth: "85%" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3e97ff, #7239ea)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="sparkles" size={13} color="white" />
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "12px 14px", borderRadius: "14px 14px 14px 4px", fontSize: 13, lineHeight: 1.55 }}>
              Anda ingin melihat <strong>pelanggan dengan penjualan tertinggi</strong>; kami sedang mengecek database dan hasilnya akan disajikan dalam bentuk visual serta insight ringkas.
            </div>
          </div>

          {/* Agent code/log step */}
          <div style={{ display: "flex", gap: 10, maxWidth: "85%" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="db" size={13} color="#4b5263" />
            </div>
            <div style={{ background: "#11141b", color: "#9bf0ad", padding: "10px 14px", borderRadius: 10, fontFamily: "var(--font-mono)", fontSize: 11.5, lineHeight: 1.6, flex: 1 }}>
              <span style={{ color: "#78808f" }}>$ run</span> query.read_only(parsed_answer.query)<br/>
              <span style={{ color: "#78808f" }}># scanning sales_fact_v3 → group by customer</span><br/>
              <span style={{ color: "#3e97ff" }}>✓</span> <span style={{ color: "#cbd5e1" }}>100 rows in 0.42s · streaming…</span>
            </div>
          </div>

          {/* result row */}
          <div style={{ display: "flex", gap: 10, maxWidth: "85%" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--success-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="check" size={13} color="#04773c" />
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: 10, fontSize: 12.5, display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
              <span>Hasil siap ditampilkan sebagai widget.</span>
              <span style={{ flex: 1 }}></span>
              <a style={{ color: "var(--primary)", fontWeight: 600, fontSize: 12, textDecoration: "none", cursor: "pointer" }}>Lihat tabel →</a>
              <a style={{ color: "var(--primary)", fontWeight: 600, fontSize: 12, textDecoration: "none", cursor: "pointer" }}>Pin ke dashboard ↗</a>
            </div>
          </div>

          <div style={{ fontSize: 11.5, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 6, paddingLeft: 38 }}>
            <span style={{ width: 8, height: 8, borderRadius: 50, background: "var(--primary)", animation: "pulse 1.4s infinite" }}></span>
            Senti sedang merangkum insight dari hasil query…
          </div>
        </div>

        <div style={{ padding: "14px 22px 18px", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
          <div style={{ border: "1px solid var(--border-strong)", borderRadius: 10, background: "var(--surface)" }}>
            <textarea placeholder="Ask anything about finance, warehouse, purchase and sales…" style={{ width: "100%", padding: "12px 14px", border: "none", outline: "none", resize: "none", fontSize: 13, minHeight: 44, background: "transparent" }} />
            <div style={{ display: "flex", padding: "6px 10px 8px", gap: 6, borderTop: "1px solid var(--divider)" }}>
              <button className="btn ghost sm"><Icon name="paperclip" size={12} /> Attachment</button>
              <button className="btn ghost sm"><Icon name="db" size={12} /> MyERPPlus</button>
              <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                <select style={{ padding: "5px 8px", border: "1px solid var(--border-strong)", borderRadius: 6, fontSize: 12 }}>
                  <option>Senti 1.0</option>
                </select>
                <button className="btn dark sm"><span style={{ width: 8, height: 8, background: "white", borderRadius: 1, display: "inline-block" }}></span> Stop</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right results panel */}
      <div style={{ width: 380, background: "var(--surface)", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "inline-flex", background: "var(--bg)", borderRadius: 7, padding: 3 }}>
            <button className="btn ghost xs" style={{ padding: "4px 10px" }}><Icon name="table" size={12} /> Table</button>
            <button className="btn primary xs" style={{ padding: "4px 10px" }}><Icon name="chart" size={12} /> Chart</button>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--text-3)" }}>100 items</span>
          <button className="btn outline xs"><Icon name="pin" size={11} /> Pin</button>
        </div>

        <div style={{ padding: 16, borderBottom: "1px solid var(--divider)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Sales Amount</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
            <div className="tnum" style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>390.5b</div>
            <span className="badge success">↑ 8% MoM</span>
          </div>
          {/* sparkline */}
          <svg viewBox="0 0 320 80" style={{ width: "100%", marginTop: 10 }}>
            <defs>
              <linearGradient id="ar" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#3e97ff" stopOpacity="0.3"/>
                <stop offset="1" stopColor="#3e97ff" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0,50 C40,55 60,60 100,55 C140,50 160,30 200,28 C240,26 280,20 320,15 L320,80 L0,80Z" fill="url(#ar)"/>
            <path d="M0,50 C40,55 60,60 100,55 C140,50 160,30 200,28 C240,26 280,20 320,15" fill="none" stroke="#3e97ff" strokeWidth="2"/>
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-muted)", marginTop: 4 }}>
            <span>PT SUTINDO</span><span>PT DITRACO</span><span>PT MAJU</span><span>PT PRIMA</span><span>Others</span>
          </div>
        </div>

        {/* Distribution donut */}
        <div style={{ padding: 16, borderBottom: "1px solid var(--divider)" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <strong style={{ fontSize: 13 }}>Distribution</strong>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-3)" }}>Total Sales Amount</span>
          </div>
          <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <svg width="160" height="160" viewBox="0 0 100 100">
              {[
                { c: "#3e97ff", v: 35.5 }, { c: "#17c653", v: 12.1 }, { c: "#f6c000", v: 12.0 },
                { c: "#f8285a", v: 8.6 }, { c: "#7239ea", v: 8.3 }, { c: "#94a3b8", v: 23.5 }
              ].reduce((acc, s, i) => {
                const start = acc.off;
                const end = start + s.v * 3.6;
                const r = 38, cx = 50, cy = 50;
                const a1 = (start - 90) * Math.PI/180, a2 = (end - 90) * Math.PI/180;
                const x1 = cx + r*Math.cos(a1), y1 = cy + r*Math.sin(a1);
                const x2 = cx + r*Math.cos(a2), y2 = cy + r*Math.sin(a2);
                const large = end - start > 180 ? 1 : 0;
                acc.paths.push(<path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`} stroke={s.c} strokeWidth="14" fill="none"/>);
                acc.off = end;
                return acc;
              }, { off: 0, paths: [] }).paths}
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.1em" }}>TOTAL</div>
              <div className="tnum" style={{ fontSize: 18, fontWeight: 700 }}>390.5b</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {breakdown.slice(0,6).map((b,i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", border: "1px solid var(--divider)", borderRadius: 6 }}>
                <span style={{ width: 8, height: 8, background: b.color, borderRadius: 2 }}></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name.split(" ").slice(0,2).join(" ")}</div>
                  <div className="tnum" style={{ fontSize: 10, color: "var(--text-3)" }}>{b.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <strong style={{ fontSize: 13 }}>Top Breakdown</strong>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-3)" }}>100 items</span>
          </div>
          {breakdown.map((b,i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 5 ? "1px solid var(--divider)" : "none" }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: b.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{b.code}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name}</div>
                <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{b.sub}</div>
              </div>
              <div className="tnum" style={{ fontSize: 12.5, fontWeight: 700 }}>{b.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

window.SentiAIResults = SentiAIResults;
