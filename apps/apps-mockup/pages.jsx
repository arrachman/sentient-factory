/* pages.jsx — All 6 pages of the SF Admin */

// ─────────────── Demo data ───────────────
const TEAM = [
  { id: 'u1', name: 'Andi Pratama', role: 'Production Lead', dept: 'Production', avatar: null, status: 'present', clockIn: '08:02', clockOut: '17:05', site: 'Plant A — Cikarang', shift: 'Morning', hours: 8.5 },
  { id: 'u2', name: 'Siti Nurhaliza', role: 'Quality Inspector', dept: 'QA', avatar: null, status: 'present', clockIn: '07:58', clockOut: '17:00', site: 'Plant A — Cikarang', shift: 'Morning', hours: 9.0 },
  { id: 'u3', name: 'Budi Santoso', role: 'Operator', dept: 'Production', avatar: null, status: 'late', clockIn: '08:34', clockOut: null, site: 'Plant A — Cikarang', shift: 'Morning', hours: 0 },
  { id: 'u4', name: 'Dewi Lestari', role: 'HR Specialist', dept: 'HR', avatar: null, status: 'wfh', clockIn: '08:15', clockOut: null, site: 'Remote', shift: 'Morning', hours: 0 },
  { id: 'u5', name: 'Rian Hidayat', role: 'Maintenance', dept: 'Engineering', avatar: null, status: 'leave', clockIn: null, clockOut: null, site: '—', shift: '—', hours: 0 },
  { id: 'u6', name: 'Maya Kusuma', role: 'Logistics', dept: 'Logistics', avatar: null, status: 'absent', clockIn: null, clockOut: null, site: '—', shift: 'Morning', hours: 0 },
  { id: 'u7', name: 'Fajar Ramadhan', role: 'Operator', dept: 'Production', avatar: null, status: 'present', clockIn: '08:01', clockOut: null, site: 'Plant B — Karawang', shift: 'Morning', hours: 0 },
  { id: 'u8', name: 'Putri Anggraini', role: 'Supervisor', dept: 'Production', avatar: null, status: 'present', clockIn: '07:45', clockOut: null, site: 'Plant B — Karawang', shift: 'Morning', hours: 0 },
];

const STATUS_TONE = { present: 'success', late: 'warning', absent: 'danger', wfh: 'info', leave: 'neutral' };
const STATUS_LABEL = { present: 'Present', late: 'Late', absent: 'Absent', wfh: 'Remote', leave: 'On Leave' };

// ═══════════════════════════════════════════════════════════
// Page 1: Personal Attendance (My Day)
// ═══════════════════════════════════════════════════════════
const PageMyAttendance = () => {
  const [clockedIn, setClockedIn] = React.useState(true);
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const fmt = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <PageHeader
        eyebrow="Today"
        title="Good morning, Andi 👋"
        description={dateStr + ' · You\'re scheduled for the morning shift at Plant A — Cikarang.'}
        actions={
          <>
            <Button variant="secondary" icon="calendar">View schedule</Button>
            <Button variant="secondary" icon="message">Request leave</Button>
          </>
        }
      />

      <div className="sf-grid sf-grid--my">
        {/* Clock card */}
        <Card className="sf-clockcard" padding={false}>
          <div className="sf-clockcard__inner">
            <div className="sf-clockcard__time">
              <div className="sf-clockcard__label">Current time · WIB</div>
              <div className="sf-clockcard__hh">{fmt}</div>
              <div className="sf-clockcard__sub">
                <Badge tone="success" dot>On-site detected · Plant A</Badge>
              </div>
            </div>
            <div className="sf-clockcard__actions">
              {!clockedIn ? (
                <button className="sf-bigbtn sf-bigbtn--in" onClick={() => setClockedIn(true)}>
                  <Icon name="fingerprint" size={26}/>
                  <span>Clock In</span>
                </button>
              ) : (
                <button className="sf-bigbtn sf-bigbtn--out" onClick={() => setClockedIn(false)}>
                  <Icon name="logout" size={26}/>
                  <span>Clock Out</span>
                </button>
              )}
              <div className="sf-clockcard__meta">
                <div><Icon name="mapPin" size={13}/> Within geofence (24m of pin)</div>
                <div><Icon name="face" size={13}/> Face-verified at 08:02</div>
              </div>
            </div>
          </div>

          {/* Today timeline */}
          <div className="sf-timeline">
            <TimelineEvent time="08:02" tone="success" icon="checkCircle" title="Clocked in" sub="Plant A · Gate B · Face match 99.4%"/>
            <TimelineEvent time="10:30" tone="info" icon="clock" title="Break started" sub="Coffee · 15 min"/>
            <TimelineEvent time="10:46" tone="info" icon="clock" title="Break ended"/>
            <TimelineEvent time="12:00" tone="info" icon="clock" title="Lunch break" sub="60 min"/>
            <TimelineEvent time="13:01" tone="info" icon="clock" title="Resumed work"/>
            <TimelineEvent time="—" tone="neutral" icon="clock" title="Clock out" sub="Scheduled 17:00" pending/>
          </div>
        </Card>

        {/* Stats column */}
        <div className="sf-stats sf-stats--col">
          <StatCard label="This week" value="38h 12m" delta={4} icon="clock" tone="primary"
            spark={<Sparkline data={[7.5,8,8.2,7.8,8.5,7.2,0]} w={120} h={28}/>} />
          <StatCard label="On-time rate" value="96%" delta={2} icon="zap" tone="success"
            spark={<Sparkline data={[92,94,93,95,96,95,96]} w={120} h={28} stroke="var(--sf-success)"/>} />
          <StatCard label="Leave balance" value="12 days" icon="calendar" tone="info"
            footer={<><Progress value={12} max={20} tone="info" size="sm"/> <span style={{ fontSize: 11, color: 'var(--sf-text-soft)' }}>12 of 20 remaining</span></>} />
        </div>

        {/* Week overview */}
        <Card title="This week" subtitle="Mon — Sun · 4 days completed" action={<Button size="sm" variant="ghost" iconRight="arrowRight">View all</Button>}>
          <div className="sf-weekrow">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
              const status = i < 3 ? 'present' : i === 3 ? 'late' : i === 4 ? 'present' : 'off';
              const hours = [8.2, 8.5, 8.1, 7.4, 8.3, 0, 0][i];
              return (
                <div key={i} className={cls('sf-weekday', `sf-weekday--${status}`)}>
                  <div className="sf-weekday__name">{d}</div>
                  <div className="sf-weekday__bar"><span style={{ height: `${hours/9 * 100}%` }}/></div>
                  <div className="sf-weekday__h">{hours ? hours.toFixed(1) + 'h' : '—'}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming */}
        <Card title="Upcoming">
          <div className="sf-list">
            <ListItem icon="calendar" tone="info" title="Production review" sub="Tomorrow · 10:00 — 11:30"/>
            <ListItem icon="award" tone="warning" title="Safety training (mandatory)" sub="Friday · Auditorium 2"/>
            <ListItem icon="briefcase" tone="primary" title="Shift swap with Budi S." sub="Saturday morning"/>
          </div>
        </Card>

        {/* Announcements */}
        <Card title="Announcements" subtitle="From HR · 2 new">
          <div className="sf-list">
            <ListItem icon="bell" tone="primary" title="New face-enrollment policy" sub="All staff must re-enroll by April 30."/>
            <ListItem icon="info" tone="success" title="Plant B canteen reopens Monday" sub="New menu available."/>
          </div>
        </Card>
      </div>
    </>
  );
};

const TimelineEvent = ({ time, icon, title, sub, tone = 'primary', pending }) => (
  <div className={cls('sf-tl', pending && 'sf-tl--pending')}>
    <div className="sf-tl__time sf-tabular">{time}</div>
    <div className={cls('sf-tl__dot', `sf-tl__dot--${tone}`)}><Icon name={icon} size={11}/></div>
    <div className="sf-tl__body">
      <div className="sf-tl__title">{title}</div>
      {sub && <div className="sf-tl__sub">{sub}</div>}
    </div>
  </div>
);

const ListItem = ({ icon, title, sub, tone = 'neutral', right }) => (
  <div className="sf-listitem">
    <div className={cls('sf-listitem__icon', `sf-stat__icon--${tone}`)}><Icon name={icon} size={16}/></div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="sf-listitem__title">{title}</div>
      {sub && <div className="sf-listitem__sub">{sub}</div>}
    </div>
    {right}
  </div>
);

// ═══════════════════════════════════════════════════════════
// Page 2: Face Enrollment Management
// ═══════════════════════════════════════════════════════════
const PageFaceEnrollment = () => {
  const [tab, setTab] = React.useState('all');
  const [view, setView] = React.useState('grid');

  const enrollments = [
    { id: 1, name: 'Andi Pratama', dept: 'Production', status: 'enrolled', confidence: 98.4, lastUpdate: '2 days ago', samples: 5 },
    { id: 2, name: 'Siti Nurhaliza', dept: 'QA', status: 'enrolled', confidence: 99.1, lastUpdate: '1 week ago', samples: 5 },
    { id: 3, name: 'Budi Santoso', dept: 'Production', status: 'pending', confidence: 0, lastUpdate: '—', samples: 0 },
    { id: 4, name: 'Dewi Lestari', dept: 'HR', status: 'enrolled', confidence: 97.2, lastUpdate: '3 days ago', samples: 5 },
    { id: 5, name: 'Rian Hidayat', dept: 'Engineering', status: 'expired', confidence: 92.0, lastUpdate: '6 months ago', samples: 5 },
    { id: 6, name: 'Maya Kusuma', dept: 'Logistics', status: 'enrolled', confidence: 96.8, lastUpdate: '1 month ago', samples: 5 },
    { id: 7, name: 'Fajar Ramadhan', dept: 'Production', status: 'pending', confidence: 0, lastUpdate: '—', samples: 0 },
    { id: 8, name: 'Putri Anggraini', dept: 'Production', status: 'enrolled', confidence: 98.9, lastUpdate: '5 days ago', samples: 5 },
  ];

  const filtered = enrollments.filter(e => tab === 'all' || e.status === tab);

  return (
    <>
      <PageHeader
        eyebrow="Identity Management"
        title="Face Enrollment"
        description="Manage biometric profiles for attendance verification. Re-enrollment recommended every 6 months."
        actions={
          <>
            <Button variant="secondary" icon="download">Export CSV</Button>
            <Button variant="primary" icon="plus">Enroll new</Button>
          </>
        }
      />

      <div className="sf-stats sf-stats--row">
        <StatCard label="Total enrolled" value="142" delta={8} icon="users" tone="primary"/>
        <StatCard label="Pending enrollment" value="14" icon="clock" tone="warning"/>
        <StatCard label="Avg. match confidence" value="97.6%" delta={1} icon="shield" tone="success"
          spark={<Sparkline data={[96,96.2,97,97.4,97.1,97.6]} w={100} h={28} stroke="var(--sf-success)"/>}/>
        <StatCard label="Expiring soon" value="6" icon="alert" tone="danger" footer="Within 30 days"/>
      </div>

      <Card padding={false}>
        <div className="sf-toolbar">
          <Tabs value={tab} onChange={setTab} variant="pill" items={[
            { value: 'all', label: 'All', count: enrollments.length },
            { value: 'enrolled', label: 'Enrolled', count: enrollments.filter(e=>e.status==='enrolled').length },
            { value: 'pending', label: 'Pending', count: enrollments.filter(e=>e.status==='pending').length },
            { value: 'expired', label: 'Expired', count: enrollments.filter(e=>e.status==='expired').length },
          ]}/>
          <div style={{ flex: 1 }}/>
          <Input icon="search" placeholder="Search staff..." size="sm" style={{ width: 240 }}/>
          <Select size="sm" value="all" options={[{value:'all',label:'All departments'}]} onChange={()=>{}}/>
          <div className="sf-iconbtn-group">
            <button className={cls('sf-iconbtn', 'sf-iconbtn--sm', view==='grid' && 'sf-iconbtn--active')} onClick={() => setView('grid')}><Icon name="grid" size={14}/></button>
            <button className={cls('sf-iconbtn', 'sf-iconbtn--sm', view==='list' && 'sf-iconbtn--active')} onClick={() => setView('list')}><Icon name="list" size={14}/></button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="sf-facegrid">
            {filtered.map(e => <FaceCard key={e.id} {...e}/>)}
          </div>
        ) : (
          <Table
            columns={[
              { key: 'name', label: 'Staff', render: (_, r) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={r.name} size={36}/>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--sf-text-soft)' }}>{r.dept}</div>
                  </div>
                </div>
              )},
              { key: 'status', label: 'Status', render: v => <Badge tone={v==='enrolled'?'success':v==='pending'?'warning':'danger'} dot>{v}</Badge>},
              { key: 'confidence', label: 'Confidence', align: 'right', render: v => v ? <span className="sf-tabular">{v.toFixed(1)}%</span> : '—' },
              { key: 'samples', label: 'Samples', align: 'center' },
              { key: 'lastUpdate', label: 'Last update' },
              { key: '_a', label: '', width: 80, render: () => <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <IconButton icon="eye" size="sm" tooltip="View"/>
                <IconButton icon="more" size="sm"/>
              </div>}
            ]}
            rows={filtered}
          />
        )}
      </Card>
    </>
  );
};

const FaceCard = ({ name, dept, status, confidence, lastUpdate, samples }) => (
  <div className="sf-facecard">
    <div className="sf-facecard__avatar">
      <Avatar name={name} size={64}/>
      {status === 'enrolled' && <div className="sf-facecard__shield"><Icon name="checkCircle" size={14}/></div>}
      {status === 'pending' && <div className="sf-facecard__shield sf-facecard__shield--warn"><Icon name="alert" size={14}/></div>}
      {status === 'expired' && <div className="sf-facecard__shield sf-facecard__shield--danger"><Icon name="xCircle" size={14}/></div>}
    </div>
    <div className="sf-facecard__name">{name}</div>
    <div className="sf-facecard__dept">{dept}</div>
    <div className="sf-facecard__row">
      <Badge tone={status==='enrolled'?'success':status==='pending'?'warning':'danger'} dot size="sm">{status}</Badge>
      {confidence > 0 && <span className="sf-tabular" style={{ fontSize: 12, color: 'var(--sf-text-soft)' }}>{confidence.toFixed(1)}%</span>}
    </div>
    <div className="sf-facecard__samples">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={cls('sf-sample', i < samples && 'sf-sample--filled')}/>
      ))}
    </div>
    <div className="sf-facecard__foot">
      <span style={{ fontSize: 11, color: 'var(--sf-text-faint)' }}>{lastUpdate}</span>
      <Button size="sm" variant="ghost">{status === 'pending' ? 'Enroll' : 'Manage'}</Button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// Page 3: Attendance History
// ═══════════════════════════════════════════════════════════
const PageHistory = () => {
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    const wkend = d.getDay() === 0 || d.getDay() === 6;
    return {
      date: d, weekend: wkend,
      status: wkend ? 'off' : (i === 3 ? 'late' : i === 7 ? 'leave' : 'present'),
      clockIn: wkend ? null : (i === 3 ? '08:34' : i === 7 ? null : ['08:01','07:58','08:05','07:55','08:00','07:48'][i % 6]),
      clockOut: wkend || i === 7 ? null : '17:0' + (i % 9),
      hours: wkend ? 0 : (i === 7 ? 0 : 8 + Math.random()),
      site: i === 5 ? 'Plant B' : 'Plant A',
    };
  });

  return (
    <>
      <PageHeader
        eyebrow="Personal record"
        title="Attendance History"
        description="Your check-in/out log. Click any day for full details, photos, and location proof."
        actions={
          <>
            <Select value="last30" options={[
              { value: 'today', label: 'Today' }, { value: 'last7', label: 'Last 7 days' },
              { value: 'last30', label: 'Last 30 days' }, { value: 'thismonth', label: 'This month' },
              { value: 'custom', label: 'Custom range' },
            ]} onChange={()=>{}}/>
            <Button variant="secondary" icon="download">Export</Button>
          </>
        }
      />

      <div className="sf-stats sf-stats--row">
        <StatCard label="Days present" value="22" icon="checkCircle" tone="success"/>
        <StatCard label="Late check-ins" value="2" icon="clock" tone="warning"/>
        <StatCard label="Days remote" value="3" icon="globe" tone="info"/>
        <StatCard label="Avg. hours/day" value="8h 18m" delta={2} icon="zap" tone="primary"/>
      </div>

      <div className="sf-grid sf-grid--history">
        <Card title="Activity calendar" subtitle="Last 4 weeks" action={<Tabs value="month" onChange={()=>{}} variant="pill" items={[{value:'week',label:'Week'},{value:'month',label:'Month'}]}/>}>
          <Heatmap
            rowLabels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']}
            colLabels={['W14','W15','W16','W17']}
            data={[
              [9,8,8,9],[8,9,8,8],[8,8,9,8],[9,8,8,9],[8,8,9,9],[0,0,0,0],[0,0,0,0]
            ]}
          />
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--sf-text-soft)' }}>
            <span>Less</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {['#E9F3FF', '#9CC8FF', '#5BA8FF', '#1B84FF', '#0954B0'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: 3, background: c }}/>)}
            </div>
            <span>More</span>
          </div>
        </Card>

        <Card title="Hours trend" subtitle="By day · last 14 days">
          <AreaChart
            labels={Array.from({length: 14}).map((_,i) => 14-i + '').reverse()}
            series={[{ color: 'var(--sf-primary)', data: days.slice().reverse().map(d => d.hours) }]}
            h={220}
          />
        </Card>
      </div>

      <Card title="Daily log" padding={false}>
        <Table
          columns={[
            { key: 'date', label: 'Date', render: (_,r) => (
              <div>
                <div style={{ fontWeight: 600 }}>{r.date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                <div style={{ fontSize: 11, color: 'var(--sf-text-faint)' }}>{r.date.toLocaleDateString('en-US', { year: 'numeric' })}</div>
              </div>
            )},
            { key: 'status', label: 'Status', render: v => v === 'off' ? <Badge tone="neutral">Weekend</Badge> : <Badge tone={STATUS_TONE[v]} dot>{STATUS_LABEL[v] || v}</Badge>},
            { key: 'clockIn', label: 'Clock in', render: v => v ? <span className="sf-tabular">{v}</span> : '—' },
            { key: 'clockOut', label: 'Clock out', render: v => v ? <span className="sf-tabular">{v}</span> : '—' },
            { key: 'hours', label: 'Hours', align: 'right', render: v => v ? <span className="sf-tabular" style={{ fontWeight: 600 }}>{v.toFixed(1)}h</span> : '—' },
            { key: 'site', label: 'Site', render: v => <span style={{ fontSize: 12, color: 'var(--sf-text-muted)' }}><Icon name="mapPin" size={12}/> {v}</span>},
            { key: '_', label: '', render: () => <Button size="sm" variant="ghost" iconRight="chevronRight">Details</Button>, align: 'right'},
          ]}
          rows={days}
        />
      </Card>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// Page 4: Attendance Dashboard (Admin Overview)
// ═══════════════════════════════════════════════════════════
const PageDashboard = () => {
  const presentCount = TEAM.filter(t => t.status === 'present').length;
  const lateCount = TEAM.filter(t => t.status === 'late').length;
  const absentCount = TEAM.filter(t => t.status === 'absent').length;
  const wfhCount = TEAM.filter(t => t.status === 'wfh').length;
  const total = TEAM.length;

  return (
    <>
      <PageHeader
        eyebrow="Live overview"
        title="Attendance Dashboard"
        description="Real-time attendance across all worksites. Updated every 30 seconds."
        meta={<><Badge tone="success" dot>Live</Badge><span>Last refresh: just now</span><span>·</span><span>Today, {new Date().toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'})}</span></>}
        actions={
          <>
            <Select value="all" options={[{value:'all',label:'All worksites'},{value:'pa',label:'Plant A'},{value:'pb',label:'Plant B'}]} onChange={()=>{}}/>
            <Button variant="secondary" icon="refresh">Refresh</Button>
            <Button variant="primary" icon="reports">Generate report</Button>
          </>
        }
      />

      <div className="sf-stats sf-stats--row">
        <StatCard label="Present" value={presentCount + ' / ' + total} delta={3} icon="checkCircle" tone="success"
          footer={<Progress value={presentCount} max={total} tone="success" size="sm"/>}/>
        <StatCard label="Late arrivals" value={lateCount} delta={-1} icon="clock" tone="warning"
          footer={<><Progress value={lateCount} max={total} tone="warning" size="sm"/></>}/>
        <StatCard label="Absent" value={absentCount} icon="xCircle" tone="danger"
          footer={<><Progress value={absentCount} max={total} tone="danger" size="sm"/></>}/>
        <StatCard label="Remote" value={wfhCount} icon="globe" tone="info"
          footer={<><Progress value={wfhCount} max={total} tone="info" size="sm"/></>}/>
      </div>

      <div className="sf-grid sf-grid--dash">
        <Card title="Attendance trend" subtitle="Present vs. late · last 7 days" action={<Tabs value="7d" onChange={()=>{}} variant="pill" items={[{value:'7d',label:'7d'},{value:'30d',label:'30d'},{value:'90d',label:'90d'}]}/>}>
          <AreaChart
            labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']}
            series={[
              { color: 'var(--sf-primary)', data: [142, 138, 144, 140, 145, 60, 22], name: 'Present' },
              { color: 'var(--sf-warning)', data: [4, 6, 3, 5, 4, 1, 0], name: 'Late' },
            ]}
            h={260}
          />
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: 'var(--sf-text-muted)' }}>
            <span><span style={{ display:'inline-block', width: 10, height: 10, borderRadius: 3, background: 'var(--sf-primary)', marginRight: 6 }}/>Present</span>
            <span><span style={{ display:'inline-block', width: 10, height: 10, borderRadius: 3, background: 'var(--sf-warning)', marginRight: 6 }}/>Late</span>
          </div>
        </Card>

        <Card title="By department" subtitle="Today's status">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Donut
              size={150} thickness={20}
              centerValue={Math.round((presentCount + wfhCount) / total * 100) + '%'}
              centerLabel="On duty"
              data={[
                { value: presentCount, color: 'var(--sf-success)' },
                { value: wfhCount, color: 'var(--sf-info)' },
                { value: lateCount, color: 'var(--sf-warning)' },
                { value: absentCount, color: 'var(--sf-danger)' },
              ]}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Present', count: presentCount, color: 'var(--sf-success)' },
                { label: 'Remote', count: wfhCount, color: 'var(--sf-info)' },
                { label: 'Late', count: lateCount, color: 'var(--sf-warning)' },
                { label: 'Absent', count: absentCount, color: 'var(--sf-danger)' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: r.color }}/>
                  <span style={{ flex: 1, color: 'var(--sf-text-muted)' }}>{r.label}</span>
                  <span className="sf-tabular" style={{ fontWeight: 600 }}>{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Live check-ins" subtitle="Streaming · last 10 events" action={<Badge tone="success" dot>Live</Badge>}>
          <div className="sf-list sf-list--feed">
            {TEAM.filter(t => t.clockIn).slice(0, 6).map((t, i) => (
              <div key={t.id} className="sf-feeditem" style={{ animationDelay: `${i*0.05}s` }}>
                <Avatar name={t.name} size={32}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}><span className="sf-truncate">{t.name}</span> <span style={{ color: 'var(--sf-text-soft)', fontWeight: 400 }}>checked in at {t.site}</span></div>
                  <div style={{ fontSize: 11, color: 'var(--sf-text-faint)' }}>{t.clockIn} · Face match {(96 + Math.random() * 3).toFixed(1)}%</div>
                </div>
                <Badge tone={STATUS_TONE[t.status]} size="sm">{t.clockIn}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Worksite activity" subtitle="Capacity by site">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { site: 'Plant A — Cikarang', cap: 80, now: 64 },
              { site: 'Plant B — Karawang', cap: 60, now: 38 },
              { site: 'HQ — Jakarta', cap: 30, now: 22 },
              { site: 'Warehouse — Bekasi', cap: 25, now: 18 },
            ].map(s => (
              <div key={s.site}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: 'var(--sf-text)', fontWeight: 500 }}>{s.site}</span>
                  <span className="sf-tabular" style={{ color: 'var(--sf-text-soft)' }}>{s.now}/{s.cap}</span>
                </div>
                <Progress value={s.now} max={s.cap} tone={s.now/s.cap > 0.85 ? 'warning' : 'primary'} size="md"/>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Today's roster" subtitle={`${TEAM.length} staff scheduled`}
        action={<><Input icon="search" placeholder="Search..." size="sm" style={{ width: 200 }}/></>}
        padding={false}
      >
        <Table
          columns={[
            { key: 'name', label: 'Staff', render: (_,r) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={r.name} size={36} status={r.status === 'present' ? 'online' : r.status === 'late' ? 'away' : 'offline'}/>
                <div>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--sf-text-soft)' }}>{r.role}</div>
                </div>
              </div>
            )},
            { key: 'dept', label: 'Department', render: v => <Badge tone="neutral">{v}</Badge>},
            { key: 'status', label: 'Status', render: v => <Badge tone={STATUS_TONE[v]} dot>{STATUS_LABEL[v]}</Badge>},
            { key: 'clockIn', label: 'Clock in', render: v => v ? <span className="sf-tabular">{v}</span> : <span style={{ color: 'var(--sf-text-faint)' }}>—</span> },
            { key: 'site', label: 'Worksite', render: v => <span style={{ fontSize: 13, color: 'var(--sf-text-muted)' }}>{v}</span> },
            { key: 'shift', label: 'Shift'},
            { key: '_', label: '', render: () => <IconButton icon="more" size="sm"/>, align: 'right', width: 50 },
          ]}
          rows={TEAM}
        />
        <div className="sf-pagi">
          <span className="sf-pagi__info">Showing 1–8 of 142</span>
          <div className="sf-pagi__nav">
            <button><Icon name="chevronLeft" size={14}/></button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>…</button>
            <button>18</button>
            <button><Icon name="chevronRight" size={14}/></button>
          </div>
        </div>
      </Card>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// Page 5: Attendance Reviews (Approval queue)
// ═══════════════════════════════════════════════════════════
const PageReviews = () => {
  const [tab, setTab] = React.useState('pending');
  const reviews = [
    { id: 1, type: 'late', staff: 'Budi Santoso', dept: 'Production', at: 'Today, 08:34', reason: 'Heavy traffic on Tol Cikarang due to accident. Submitted GPS proof.', status: 'pending', priority: 'high', submittedAgo: '2h ago' },
    { id: 2, type: 'missing', staff: 'Rian Hidayat', dept: 'Engineering', at: 'Yesterday', reason: 'Forgot to clock out — left at 17:30. Witnessed by supervisor.', status: 'pending', priority: 'med', submittedAgo: '1d ago' },
    { id: 3, type: 'leave', staff: 'Maya Kusuma', dept: 'Logistics', at: 'Apr 24, full day', reason: 'Family medical emergency — hospital documentation attached.', status: 'pending', priority: 'high', submittedAgo: '3h ago' },
    { id: 4, type: 'overtime', staff: 'Putri Anggraini', dept: 'Production', at: 'Apr 23, 17:00–22:00', reason: 'Production line repair extending past shift.', status: 'pending', priority: 'low', submittedAgo: '2d ago' },
    { id: 5, type: 'wfh', staff: 'Dewi Lestari', dept: 'HR', at: 'Apr 22', reason: 'Remote work request for policy drafting.', status: 'approved', priority: 'low', submittedAgo: '5d ago' },
  ];
  const filtered = reviews.filter(r => tab === 'all' || r.status === tab);

  const TYPE_ICON = { late: 'clock', missing: 'alert', leave: 'calendar', overtime: 'zap', wfh: 'globe' };
  const TYPE_TONE = { late: 'warning', missing: 'danger', leave: 'info', overtime: 'primary', wfh: 'info' };

  return (
    <>
      <PageHeader
        eyebrow="Approval queue"
        title="Attendance Reviews"
        description="Approve or decline attendance corrections, leave requests, and overtime claims from your team."
        actions={
          <>
            <Button variant="secondary" icon="filter">Filters</Button>
            <Button variant="primary" icon="check">Approve all visible</Button>
          </>
        }
      />

      <div className="sf-stats sf-stats--row">
        <StatCard label="Awaiting your action" value="12" icon="alert" tone="warning"/>
        <StatCard label="Approved today" value="34" delta={12} icon="checkCircle" tone="success"/>
        <StatCard label="Avg. resolution" value="2.4h" delta={-18} icon="zap" tone="primary"/>
        <StatCard label="Auto-flagged" value="3" icon="flag" tone="danger" footer="Anomaly detection"/>
      </div>

      <Card padding={false}>
        <div className="sf-toolbar">
          <Tabs value={tab} onChange={setTab} variant="pill" items={[
            { value: 'pending', label: 'Pending', count: reviews.filter(r=>r.status==='pending').length },
            { value: 'approved', label: 'Approved', count: reviews.filter(r=>r.status==='approved').length },
            { value: 'declined', label: 'Declined', count: 0 },
            { value: 'all', label: 'All' },
          ]}/>
          <div style={{ flex: 1 }}/>
          <Select size="sm" value="all" options={[{value:'all',label:'All types'},{value:'late',label:'Late'},{value:'leave',label:'Leave'}]} onChange={()=>{}}/>
          <Select size="sm" value="newest" options={[{value:'newest',label:'Newest first'},{value:'priority',label:'By priority'}]} onChange={()=>{}}/>
        </div>

        <div className="sf-reviews">
          {filtered.map(r => (
            <div key={r.id} className="sf-review">
              <div className={cls('sf-review__icon', `sf-stat__icon--${TYPE_TONE[r.type]}`)}><Icon name={TYPE_ICON[r.type]} size={18}/></div>
              <div className="sf-review__main">
                <div className="sf-review__head">
                  <div>
                    <span className="sf-review__staff">{r.staff}</span>
                    <span className="sf-review__type"> · requested a <strong>{r.type}</strong> correction</span>
                  </div>
                  <div className="sf-review__meta">
                    {r.priority === 'high' && <Badge tone="danger" dot size="sm">High priority</Badge>}
                    <span style={{ fontSize: 11.5, color: 'var(--sf-text-faint)' }}>{r.submittedAgo}</span>
                  </div>
                </div>
                <div className="sf-review__when"><Icon name="calendar" size={13}/> {r.at} <span style={{ marginLeft: 12, color: 'var(--sf-text-faint)' }}>·</span> <span style={{ marginLeft: 12 }}>{r.dept}</span></div>
                <div className="sf-review__reason">{r.reason}</div>
                <div className="sf-review__actions">
                  {r.status === 'pending' ? (
                    <>
                      <Button size="sm" variant="success" icon="check">Approve</Button>
                      <Button size="sm" variant="secondary" icon="close">Decline</Button>
                      <Button size="sm" variant="ghost" icon="message">Ask for info</Button>
                      <div style={{ flex: 1 }}/>
                      <Button size="sm" variant="ghost" iconRight="external">Open full case</Button>
                    </>
                  ) : (
                    <Badge tone="success" dot>Approved by you · 2 days ago</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <Empty icon="checkCircle" title="All caught up" description="No pending reviews. Take a coffee break."/>}
        </div>
      </Card>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// Page 6: Worksites & Geofences
// ═══════════════════════════════════════════════════════════
const PageWorksites = () => {
  const [selectedSite, setSelectedSite] = React.useState(0);
  const sites = [
    { id: 1, name: 'Plant A — Cikarang', address: 'Jl. Industri Selatan 5, Cikarang Selatan', radius: 150, capacity: 80, present: 64, lat: '-6.343', lng: '107.156', status: 'active', staff: 92 },
    { id: 2, name: 'Plant B — Karawang', address: 'KIIC Lot D-12, Karawang Barat', radius: 120, capacity: 60, present: 38, lat: '-6.302', lng: '107.298', status: 'active', staff: 54 },
    { id: 3, name: 'HQ — Jakarta', address: 'Sudirman Tower 28F, Jakarta Pusat', radius: 80, capacity: 30, present: 22, lat: '-6.224', lng: '106.811', status: 'active', staff: 28 },
    { id: 4, name: 'Warehouse — Bekasi', address: 'MM2100 Block J-7, Cikarang Barat', radius: 100, capacity: 25, present: 18, lat: '-6.298', lng: '107.073', status: 'active', staff: 22 },
    { id: 5, name: 'Mobile — Field Ops', address: 'Dynamic geofences (per assignment)', radius: 0, capacity: 0, present: 5, lat: '—', lng: '—', status: 'mobile', staff: 12 },
  ];
  const sel = sites[selectedSite];

  return (
    <>
      <PageHeader
        eyebrow="Locations"
        title="Worksites & Geofences"
        description="Configure worksites, set GPS geofence radius, and monitor staff capacity."
        actions={
          <>
            <Button variant="secondary" icon="upload">Import locations</Button>
            <Button variant="primary" icon="plus">Add worksite</Button>
          </>
        }
      />

      <div className="sf-stats sf-stats--row">
        <StatCard label="Active worksites" value="4" icon="building" tone="primary"/>
        <StatCard label="Total capacity" value="195" icon="users" tone="info"/>
        <StatCard label="Currently on-site" value="142" delta={6} icon="signal" tone="success"
          spark={<Sparkline data={[120,128,135,140,138,142]} w={100} h={28} stroke="var(--sf-success)"/>}/>
        <StatCard label="Geofence breaches" value="2" icon="alert" tone="warning" footer="Last 24h"/>
      </div>

      <div className="sf-grid sf-grid--worksites">
        <Card padding={false} title="All worksites" subtitle={`${sites.length} locations`}>
          <div className="sf-sitelist">
            {sites.map((s, i) => (
              <button key={s.id} className={cls('sf-siteitem', selectedSite === i && 'sf-siteitem--active')} onClick={() => setSelectedSite(i)}>
                <div className={cls('sf-siteitem__icon', s.status === 'mobile' ? 'sf-stat__icon--info' : 'sf-stat__icon--primary')}>
                  <Icon name={s.status === 'mobile' ? 'globe' : 'building'} size={18}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }} className="sf-truncate">{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--sf-text-soft)' }} className="sf-truncate">{s.staff} assigned · {s.present} on-site now</div>
                </div>
                <Icon name="chevronRight" size={14} style={{ color: 'var(--sf-text-faint)' }}/>
              </button>
            ))}
          </div>
        </Card>

        <Card padding={false} className="sf-mapcard">
          <div className="sf-map">
            {/* Synthetic stylized map */}
            <svg width="100%" height="100%" viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--sf-border)" strokeWidth="1" opacity=".5"/>
                </pattern>
              </defs>
              <rect width="800" height="480" fill="var(--sf-bg-subtle)"/>
              <rect width="800" height="480" fill="url(#grid)"/>
              {/* roads */}
              <path d="M 0 280 Q 200 240 400 260 T 800 220" stroke="var(--sf-border-strong)" strokeWidth="3" fill="none" opacity=".5"/>
              <path d="M 380 0 Q 400 240 360 480" stroke="var(--sf-border-strong)" strokeWidth="3" fill="none" opacity=".5"/>
              <path d="M 0 100 L 800 100" stroke="var(--sf-border-strong)" strokeWidth="2" fill="none" opacity=".3"/>
              {/* water */}
              <path d="M 600 0 L 800 0 L 800 80 Q 700 60 600 80 Z" fill="var(--sf-primary-light)" opacity=".6"/>
              {/* markers */}
              {[
                { x: 220, y: 200, idx: 0 },
                { x: 480, y: 180, idx: 1 },
                { x: 360, y: 320, idx: 2 },
                { x: 580, y: 280, idx: 3 },
                { x: 660, y: 380, idx: 4 },
              ].map(m => {
                const active = selectedSite === m.idx;
                return (
                  <g key={m.idx} onClick={() => setSelectedSite(m.idx)} style={{ cursor: 'pointer' }}>
                    {active && <circle cx={m.x} cy={m.y} r="44" fill="var(--sf-primary)" opacity=".15"/>}
                    {active && <circle cx={m.x} cy={m.y} r="44" fill="none" stroke="var(--sf-primary)" strokeWidth="1.5" strokeDasharray="4 4"/>}
                    <circle cx={m.x} cy={m.y} r="14" fill={active ? 'var(--sf-primary)' : 'var(--sf-bg-elev)'} stroke={active ? 'var(--sf-primary)' : 'var(--sf-primary)'} strokeWidth="2"/>
                    <circle cx={m.x} cy={m.y} r="5" fill={active ? '#fff' : 'var(--sf-primary)'}/>
                  </g>
                );
              })}
            </svg>
            <div className="sf-map__overlay">
              <div className="sf-map__legend">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 50, background: 'var(--sf-primary)' }}/>
                  Active geofence
                </span>
              </div>
              <div className="sf-map__zoom">
                <button><Icon name="plus" size={14}/></button>
                <button><Icon name="minus" size={14}/></button>
              </div>
            </div>
          </div>

          <div className="sf-sitedetail">
            <div className="sf-sitedetail__head">
              <div>
                <div className="sf-sitedetail__name">{sel.name}</div>
                <div className="sf-sitedetail__addr"><Icon name="mapPin" size={14}/> {sel.address}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="secondary" size="sm" icon="edit">Edit</Button>
                <Button variant="secondary" size="sm" icon="external">Open in Maps</Button>
              </div>
            </div>
            <div className="sf-sitedetail__grid">
              <DetailField label="Geofence radius" value={sel.radius ? `${sel.radius} m` : 'Dynamic'} />
              <DetailField label="Capacity" value={sel.capacity || '—'} />
              <DetailField label="On-site now" value={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span className="sf-tabular">{sel.present}</span>
                  {sel.capacity > 0 && <Badge tone={sel.present/sel.capacity > .85 ? 'warning' : 'success'} size="sm">{Math.round(sel.present/sel.capacity*100)}%</Badge>}
                </span>
              } />
              <DetailField label="Coordinates" value={<span className="sf-tabular" style={{ fontSize: 12 }}>{sel.lat}, {sel.lng}</span>} />
            </div>
            {sel.capacity > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--sf-text-soft)', marginBottom: 6 }}>
                  <span>Capacity utilization</span>
                  <span className="sf-tabular">{sel.present}/{sel.capacity}</span>
                </div>
                <Progress value={sel.present} max={sel.capacity} tone={sel.present/sel.capacity > .85 ? 'warning' : 'primary'}/>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

const DetailField = ({ label, value }) => (
  <div className="sf-detail">
    <div className="sf-detail__label">{label}</div>
    <div className="sf-detail__value">{value}</div>
  </div>
);

Object.assign(window, { PageMyAttendance, PageFaceEnrollment, PageHistory, PageDashboard, PageReviews, PageWorksites });
