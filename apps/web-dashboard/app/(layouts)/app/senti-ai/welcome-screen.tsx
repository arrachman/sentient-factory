'use client';

import {
  Activity,
  Briefcase,
  BrainCircuit,
  Euro,
  Package,
  TrendingUp,
  WandSparkles,
} from 'lucide-react';

const promptSuggestions = [
  {
    label: 'Bandingkan pertumbuhan sales vs collection 3 bulan terakhir',
    description: 'Lihat apakah kenaikan penjualan diikuti perbaikan cash-in per bulan.',
    icon: TrendingUp,
  },
  {
    label: 'Deteksi customer berisiko dari aging piutang di atas 90 hari',
    description: 'Prioritaskan akun dengan nilai outstanding terbesar dan aging terlama.',
    icon: Euro,
  },
  {
    label: 'Forecast stok yang berpotensi habis dalam 14 hari ke depan',
    description: 'Gabungkan stok saat ini, outbound rate, dan buffer minimum gudang.',
    icon: Package,
  },
  {
    label: 'Margin purchase vs selling per kategori item bulan berjalan',
    description: 'Temukan kategori dengan tekanan margin dan potensi markup terendah.',
    icon: Briefcase,
  },
  {
    label: 'Cash outflow operasional terbesar minggu ini beserta penyebabnya',
    description: 'Kelompokkan pengeluaran terbesar agar cepat terlihat sumber pemborosan.',
    icon: Activity,
  },
  {
    label: 'Supplier dengan lead time paling lambat dan dampaknya ke stok',
    description: 'Tandai vendor yang berpotensi menyebabkan keterlambatan replenishment.',
    icon: WandSparkles,
  },
] as const;

export interface WelcomeScreenProps {
  onSelectSuggestion: (label: string) => void;
}

export function WelcomeScreen({ onSelectSuggestion }: WelcomeScreenProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-[780px] flex-col items-center justify-center px-4 py-7 text-center lg:-translate-y-14">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <BrainCircuit className="size-56 text-[#009EF7] opacity-[0.05] dark:opacity-[0.07]" strokeWidth={1.1} />
      </div>
      <div className="relative z-10 max-w-3xl">
        <div className="mx-auto inline-flex items-center rounded-full border border-sky-100 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#009EF7] shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] backdrop-blur dark:border-sky-500/20 dark:bg-slate-950/70 dark:text-sky-300">
          Advanced Prompt Studio
        </div>
        <h2 className="text-[28px] font-semibold tracking-tight text-[#181C32] dark:text-slate-100">
          Ask anything to start your analysis.
        </h2>
        <p className="mt-3 text-sm text-[#7E8299] dark:text-slate-400">
          Sentient Factory siap membantu analisis finance, warehouse, purchase, dan sales dari satu workspace.
        </p>
      </div>
      <div className="relative z-10 mt-5 grid w-full max-w-[780px] gap-2 md:grid-cols-2 xl:grid-cols-3">
        {promptSuggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            type="button"
            onClick={() => onSelectSuggestion(suggestion.label)}
            className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] transition hover:-translate-y-0.5 hover:border-[#009EF7] hover:bg-[#F1FAFF] dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-500/40 dark:hover:bg-slate-900"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#F1FAFF] text-[#009EF7] dark:bg-sky-500/10 dark:text-sky-300">
              <suggestion.icon className="size-3.5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                {suggestion.label}
              </span>
              <span className="mt-1 block text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                {suggestion.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { promptSuggestions };
