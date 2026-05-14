export const CLINIC_ROLES = [
  { name: 'clinic-admin', description: 'Clinic admin — full scheduling & operational control' },
  { name: 'clinic-psikolog', description: 'Psychologist — own schedule + clinical notes' },
  { name: 'clinic-owner', description: 'Clinic owner — KPI dashboard & analytics' },
  { name: 'clinic-resepsionis', description: 'Front desk — check-in & walk-in booking' },
  { name: 'clinic-marketing', description: 'Marketing — read-only service catalog & capacity' },
  { name: 'clinic-intern', description: 'Intern — minimal access placeholder' },
];

export const CLINIC_PERMISSIONS = [
  { name: 'clinic.booking.read', module: 'clinic.booking', action: 'read' },
  { name: 'clinic.booking.write', module: 'clinic.booking', action: 'write' },
  { name: 'clinic.psikolog.read', module: 'clinic.psikolog', action: 'read' },
  { name: 'clinic.psikolog.write', module: 'clinic.psikolog', action: 'write' },
  { name: 'clinic.service.read', module: 'clinic.service', action: 'read' },
  { name: 'clinic.service.write', module: 'clinic.service', action: 'write' },
  { name: 'clinic.settings.write', module: 'clinic.settings', action: 'write' },
];

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  'clinic-admin': CLINIC_PERMISSIONS.map((p) => p.name),
  'clinic-psikolog': ['clinic.booking.read', 'clinic.psikolog.read'],
  'clinic-owner': ['clinic.booking.read', 'clinic.psikolog.read', 'clinic.service.read'],
  'clinic-resepsionis': ['clinic.booking.read', 'clinic.booking.write', 'clinic.psikolog.read'],
  'clinic-marketing': ['clinic.service.read', 'clinic.psikolog.read'],
  'clinic-intern': [],
};

export const DEV_USERS = [
  { email: 'admin@althea.local', username: 'clinic-admin', fullName: 'Clinic Admin', role: 'clinic-admin' },
  { email: 'psikolog@althea.local', username: 'clinic-psikolog', fullName: 'Dr. Psikolog Demo, M.Psi', role: 'clinic-psikolog' },
  { email: 'owner@althea.local', username: 'clinic-owner', fullName: 'Clinic Owner', role: 'clinic-owner' },
  { email: 'resepsionis@althea.local', username: 'clinic-resepsionis', fullName: 'Front Desk', role: 'clinic-resepsionis' },
  { email: 'marketing@althea.local', username: 'clinic-marketing', fullName: 'Marketing Demo', role: 'clinic-marketing' },
  { email: 'intern@althea.local', username: 'clinic-intern', fullName: 'Intern Demo', role: 'clinic-intern' },
];

export const SAMPLE_PSIKOLOG = [
  { email: 'farah@althea.local', username: 'farah-rahmadhani', fullName: 'Farah Rahmadhani, M.Psi', title: 'M.Psi', specialty: ['klinis_dewasa', 'pasangan'], color: '#5b8a66', license: 'SIPP-DEMO-001' },
  { email: 'budi@althea.local', username: 'budi-santoso', fullName: 'Budi Santoso, M.Psi', title: 'M.Psi', specialty: ['anak_remaja'], color: '#c97a5d', license: 'SIPP-DEMO-002' },
  { email: 'rina@althea.local', username: 'rina-amalia', fullName: 'Rina Amalia, M.Psi', title: 'M.Psi', specialty: ['klinis_dewasa', 'tes_psikologi'], color: '#6f8aa3', license: 'SIPP-DEMO-003' },
  { email: 'dimas@althea.local', username: 'dimas-pratama', fullName: 'Dimas Pratama, M.Psi', title: 'M.Psi', specialty: ['anak_remaja', 'terapi_anak'], color: '#9c7c3c', license: 'SIPP-DEMO-004' },
  { email: 'sari@althea.local', username: 'sari-puspita', fullName: 'Sari Puspita, M.Psi', title: 'M.Psi', specialty: ['pasangan', 'keluarga'], color: '#7aa382', license: 'SIPP-DEMO-005' },
  { email: 'aditya@althea.local', username: 'aditya-nugraha', fullName: 'Aditya Nugraha, M.Psi', title: 'M.Psi', specialty: ['klinis_dewasa'], color: '#3a4f4f', license: 'SIPP-DEMO-006' },
  { email: 'mira@althea.local', username: 'mira-cahyani', fullName: 'Mira Cahyani, M.Psi', title: 'M.Psi', specialty: ['terapi_anak', 'tumbuh_kembang'], color: '#e3a895', license: 'SIPP-DEMO-007' },
];

export const DEFAULT_OPERATING_HOURS = {
  monday: { open: '09:00', close: '18:00', isOpen: true },
  tuesday: { open: '09:00', close: '18:00', isOpen: true },
  wednesday: { open: '09:00', close: '18:00', isOpen: true },
  thursday: { open: '09:00', close: '18:00', isOpen: true },
  friday: { open: '09:00', close: '18:00', isOpen: true },
  saturday: { open: '10:00', close: '16:00', isOpen: true },
  sunday: { open: null, close: null, isOpen: false },
};
