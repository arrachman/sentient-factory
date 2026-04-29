/* global React, SF */
const { Icon } = SF;
const { useState } = React;

// ============ SCREEN 1: SENTI AI EMPTY ============
const SentiAIEmpty = () => {
  const sessions = [
    { t: "top sales by customer", active: true, time: "2m" },
    { t: "Deteksi customer berisiko default Q2", time: "18m" },
    { t: "Forecast stok 14 hari", time: "1h" },
    { t: "Tampilkan area chart per business unit", time: "3h" },
    { t: "Buat widget line trend cash inflow", time: "5h" },
    { t: "top customer by sales", time: "Y" },
    { t: "Tampilkan dashboard piutang aging", time: "Y" },
    { t: "Bandingkan pertumbuhan sales 3 bulan", time: "2d" },
    { t: "Cek rekening koran bulan ini", time: "3d" },
    { t: "Margin purchase vs selling per kategori", time: "5d" },
    { t: "Cash outflow operasional terbesar minggu ini", time: "1w" },
  ];
  const prompts = [
    { icon: "chart", c: "primary", t: "Bandingkan pertumbuhan sales vs collection 3 bulan terakhir", d: "Lihat apakah kenaikan penjualan diikuti perbaikan cash-in per bulan." },
    { icon: "coin", c: "warning", t: "Deteksi customer berisiko dari aging piutang di atas 90 hari", d: "Prioritaskan akun dengan nilai outstanding terbesar dan aging terlama." },
    { icon: "box", c: "info", t: "Forecast stok yang berpotensi habis dalam 14 hari ke depan", d: "Gabungkan stok saat ini, outbound rate, dan buffer minimum gudang." },
    { icon: "pie", c: "primary", t: "Margin purchase vs selling per kategori item bulan berjalan", d: "Temukan kategori dengan tekanan margin dan potensi markup terendah." },
    { icon: "bolt", c: "danger", t: "Cash outflow operasional terbesar minggu ini beserta penyebabnya", d: "Kelompokkan pengeluaran agar cepat terlihat sumber pemborosan." },
    { icon: "truck", c: "info", t: "Supplier dengan lead time paling lambat dan dampaknya ke stok", d: "Tandai vendor yang berpotensi menyebabkan keterlambatan replenishment." },
  ];
  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0, background: "var(--bg)" }}>
      {/* Sessions panel */}
      <div style={{ width: 320, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--divider)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Icon name="msg" size={16} color="#3e97ff" />
            <strong style={{ fontSize: 14 }}>Sessions</strong>
            <span className="badge primary" style={{ marginLeft: "auto" }}>24</span>
          </div>
          <div className="search-bar" style={{ height: 34, padding: "0 10px" }}>
            <Icon name="search" size={13} color="#a1a8b5" />
            <input placeholder="Cari session…" style={{ fontSize: 12.5 }} />
          </div>
          <button className="btn primary sm" style={{ marginTop: 10, width: "100%", justifyContent: "center" }}>
            <Icon name="plus" size={14} /> New Session
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 8px 4px" }}>Recent</div>
          {sessions.map((s, i) => (
            <div key={i} className={`session-row ${s.active ? "active" : ""}`} style={{
              padding: "10px 12px", borderRadius: 7, marginBottom: 2, cursor: "pointer",
              background: s.active ? "var(--primary-soft)" : "transparent",
              border: s.active ? "1px solid #cfe5ff" : "1px solid transparent"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: s.active ? "var(--primary)" : "var(--bg)", color: s.active ? "white" : "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="msg" size={11} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: s.active ? 600 : 500, color: s.active ? "var(--primary-ink)" : "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.t}</div>
                </div>
                <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{s.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main composer */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #3e97ff, #7239ea)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="sparkles" size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Senti Agent <span className="badge success" style={{ marginLeft: 6 }}><span className="sev-dot sev-low" style={{ background: "var(--success)" }} />online</span></div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>Factory Intelligence Workspace · MyERPPlus connected</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button className="btn outline sm"><Icon name="db" size={13} /> Data sources</button>
            <button className="btn outline sm"><Icon name="clock" size={13} /> History</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 32px 32px" }}>
          <div style={{ maxWidth: 880, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <span style={{ display: "inline-block", padding: "5px 12px", background: "var(--primary-soft)", color: "var(--primary-ink)", borderRadius: 999, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Advanced Prompt Studio</span>
              <h2 style={{ fontSize: 32, fontWeight: 700, margin: "16px 0 10px", letterSpacing: "-0.02em" }}>Ask anything to start your analysis.</h2>
              <p style={{ fontSize: 14, color: "var(--text-3)", margin: 0, maxWidth: 580, marginLeft: "auto", marginRight: "auto", lineHeight: 1.55 }}>
                Sentient Factory siap membantu analisis <strong style={{ color: "var(--text-2)" }}>finance</strong>, <strong style={{ color: "var(--text-2)" }}>warehouse</strong>, <strong style={{ color: "var(--text-2)" }}>purchase</strong>, dan <strong style={{ color: "var(--text-2)" }}>sales</strong> dari satu workspace.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {prompts.map((p, i) => (
                <div key={i} className="prompt-card" style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
                  padding: 18, cursor: "pointer", transition: "all 0.15s"
                }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div className={`badge ${p.c}`} style={{ width: 32, height: 32, borderRadius: 8, padding: 0, justifyContent: "center", marginBottom: 12 }}>
                    <Icon name={p.icon} size={16} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6, lineHeight: 1.4 }}>{p.t}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-3)", lineHeight: 1.5 }}>{p.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Composer */}
        <div style={{ padding: "16px 24px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", border: "1px solid var(--border-strong)", borderRadius: 12, background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
            <textarea placeholder="Ask anything about finance, warehouse, purchase and sales…" style={{
              width: "100%", padding: "14px 16px", border: "none", outline: "none", resize: "none",
              fontSize: 13.5, minHeight: 56, background: "transparent", color: "var(--text)", borderRadius: 12
            }} />
            <div style={{ display: "flex", alignItems: "center", padding: "8px 12px 10px", borderTop: "1px solid var(--divider)", gap: 6 }}>
              <button className="btn ghost sm"><Icon name="paperclip" size={13} /> Attachment</button>
              <button className="btn ghost sm"><Icon name="db" size={13} /> MyERPPlus</button>
              <span style={{ fontSize: 11.5, color: "var(--text-muted)", marginLeft: 4 }}>Paste image/file dengan Ctrl+V atau drag ke composer.</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                <select style={{ padding: "6px 10px", border: "1px solid var(--border-strong)", borderRadius: 6, fontSize: 12, background: "var(--surface-2)" }}>
                  <option>Senti 1.0</option>
                  <option>Senti 2.0 Pro</option>
                </select>
                <button className="btn primary sm" style={{ padding: "6px 12px" }}>
                  <Icon name="send" size={13} /> Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.SentiAIEmpty = SentiAIEmpty;
