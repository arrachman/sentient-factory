export default function AppHomePage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card px-8 py-12 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Sentient Factory
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Selamat Datang
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
          Anda berhasil masuk ke aplikasi. Silakan pilih menu yang ingin digunakan dari sidebar.
        </p>
      </div>
    </div>
  );
}
