import { useState, type ReactNode, type SubmitEvent } from 'react';
import { FaLock } from 'react-icons/fa6';


const PASSWORD_HASH = 'ac42b002d6196276d464ab11a9c50b67f1a75c441ff10e6081919b91a5c2e4ac';

const STORAGE_KEY = 'koolskools-gate';


async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}


function hasStoredUnlock() {
  try {
    return localStorage.getItem(STORAGE_KEY) === PASSWORD_HASH;
  } catch {
    // Storage can throw when cookies/site data are blocked. Stay locked.
    return false;
  }
}


function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(hasStoredUnlock);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const attempt = password.trim();
    if (!attempt) return;

    // crypto.subtle is undefined outside secure contexts (plain HTTP & non-localhost)
    if (!crypto?.subtle) {
      setError('This site is not secure and cannot check the password.');
      return;
    }

    if ((await sha256Hex(attempt)) !== PASSWORD_HASH) {
      setPassword('');
      setError('Incorrect password. Please try again.');
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, PASSWORD_HASH);
    } catch {
      // Unlock the session anyway; they will need to re-enter next session
    }
    setUnlocked(true);
  }

  if (unlocked) return children;

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-bg px-6">
      <div className="flex flex-col gap-2">
        <p className="text-md/6 text-body">
          Enter the password to preview the Koolskools website.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md items-center gap-3 rounded-full border border-accent-subtle bg-surface py-1.5 pr-1.5 pl-5 shadow-lg shadow-accent-dark/10"
      >
        <FaLock className="shrink-0 text-inactive" aria-hidden="true" />
        <label htmlFor="site-password" className="sr-only">
          Site password
        </label>
        <input
          id="site-password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError('');
          }}
          autoFocus
          autoComplete="current-password"
          aria-describedby={error ? 'site-password-error' : undefined}
          placeholder="Password"
          className="min-w-0 flex-1 border-none bg-transparent py-2 text-body outline-none placeholder:text-sm placeholder:text-inactive"
        />
        <button
          type="submit"
          className="pressable flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-accent-dark bg-accent px-5 py-2 mr-0.5 font-semibold text-surface"
        >
          Enter
        </button>
      </form>
      <p
        id="site-password-error"
        role="alert"
        aria-live="polite"
        className={`mt-2 min-h-[1.5rem] text-center text-md text-error transition-opacity ${
          error ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {error || '\u00A0'}
      </p>
    </main>
  );
}

export default PasswordGate;
