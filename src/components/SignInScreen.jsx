import { BookOpen } from "lucide-react";

export default function SignInScreen({ onSignIn, error, working }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center mb-6">
        <BookOpen size={30} className="text-navy-bg" />
      </div>
      <h1 className="text-2xl font-bold text-ink mb-2">Verses</h1>
      <p className="text-[14px] text-ink-muted mb-10 leading-relaxed">
        Sign in to save your notes, prayers, and reading streak across
        devices.
      </p>
      <button
        onClick={onSignIn}
        disabled={working}
        className="w-full flex items-center justify-center gap-3 bg-white text-[#1F1F1F] font-semibold py-3.5 rounded-full disabled:opacity-60"
      >
        <GoogleG />
        {working ? "Signing in…" : "Continue with Google"}
      </button>
      {error && <p className="text-red-400 text-[13px] mt-4">{error}</p>}
      <p className="text-[11px] text-ink-faint mt-8 leading-relaxed">
        By continuing you agree to keep this space kind and prayerful.
      </p>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.92c1.7-1.57 2.68-3.88 2.68-6.64z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.27c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34C2.44 15.98 5.48 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.34z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.95l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
