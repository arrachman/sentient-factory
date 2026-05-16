// Login screen — shown when no authenticated user. Prototype: any non-empty
// credentials work; the demo account is pre-fillable.
const DEMO_USER = { user: 'adi.s', pass: 'sentient', name: 'Adi Saputra', email: 'adi.s@sentient.id', role: 'Administrator', initials: 'AS' };

const LoginPage = ({ onLogin }) => {
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const userRef = React.useRef(null);

  React.useEffect(() => { setTimeout(() => userRef.current?.focus(), 80); }, []);

  const submit = (e) => {
    e && e.preventDefault();
    if (!user.trim() || !pass.trim()) { setErr('Username dan password wajib diisi.'); return; }
    setErr('');
    setBusy(true);
    setTimeout(() => {
      const known = user.trim() === DEMO_USER.user;
      const u = {
        user: user.trim(),
        name: known ? DEMO_USER.name : user.trim(),
        email: known ? DEMO_USER.email : `${user.trim().replace(/[^a-z0-9.]/gi, '.')}@sentient.id`,
        role: known ? DEMO_USER.role : 'Akuntansi',
        initials: (known ? DEMO_USER.name : user.trim()).split(/[ .]/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase(),
      };
      setBusy(false);
      onLogin(u);
      window.toast(`Selamat datang, ${u.name}`, { type: 'success', sub: `Masuk sebagai ${u.role}` });
    }, 520);
  };

  const fillDemo = () => { setUser(DEMO_USER.user); setPass(DEMO_USER.pass); setErr(''); };

  return (
    <div className="login-wrap">
      <div className="login-brand">
        <div className="login-logo">
          <span className="mk"><Icon name="factory" size={15}/></span>
          <span>Sentient <span style={{ fontWeight: 400, opacity: 0.7 }}>/ ERP</span></span>
        </div>
        <div className="login-hero">
          <h1>Platform manufaktur<br/>yang terintegrasi.</h1>
          <p>Kelola keuangan, persediaan, pembelian, sales, dan produksi dalam satu sistem yang cepat dan presisi.</p>
        </div>
        <div className="login-stats">
          <div className="st"><div className="v">12</div><div className="l">Modul aktif</div></div>
          <div className="st"><div className="v">4</div><div className="l">Cabang</div></div>
          <div className="st"><div className="v">99,9%</div><div className="l">Uptime</div></div>
        </div>
      </div>

      <div className="login-pane">
        <form className="login-card" onSubmit={submit}>
          <h2>Masuk ke akun Anda</h2>
          <div className="sub">Gunakan kredensial perusahaan untuk melanjutkan.</div>

          {err && (
            <div className="login-err"><Icon name="info" size={13}/><span>{err}</span></div>
          )}

          <div className="login-field">
            <label>Username</label>
            <div className="login-input">
              <span className="ic"><Icon name="user" size={14}/></span>
              <input ref={userRef} value={user} onChange={e => setUser(e.target.value)}
                placeholder="cth: adi.s" autoComplete="username"/>
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="login-input">
              <span className="ic"><Icon name="gear" size={14}/></span>
              <input type={show ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                placeholder="••••••••" autoComplete="current-password"/>
              <span className="eye" onClick={() => setShow(s => !s)} title={show ? 'Sembunyikan' : 'Tampilkan'}>
                <Icon name={show ? 'eye' : 'eye'} size={14}/>
              </span>
            </div>
          </div>

          <div className="login-row">
            <label>
              <input type="checkbox" className="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/>
              Ingat saya
            </label>
            <a onClick={(e) => { e.preventDefault(); window.toast('Hubungi administrator untuk reset password.', { type: 'info' }); }}>Lupa password?</a>
          </div>

          <button type="submit" className="login-btn" disabled={busy}>
            {busy ? <>Memproses…</> : <>Masuk <Icon name="arrow-tr" size={14}/></>}
          </button>

          <div className="login-demo">
            <strong style={{ color: 'var(--fg)' }}>Mode demo</strong> — akun: <code>{DEMO_USER.user}</code> · sandi: <code>{DEMO_USER.pass}</code>{' '}
            <a style={{ color: 'var(--primary-soft-fg)', cursor: 'pointer' }} onClick={fillDemo}>isi otomatis</a>
          </div>

          <div className="login-foot">© 2026 Sentient Manufaktur Indonesia · v0.9 prototype</div>
        </form>
      </div>
    </div>
  );
};

window.LoginPage = LoginPage;
