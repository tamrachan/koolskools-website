import { useEffect, useState } from 'react';
import SectionDivider from '../components/SectionDivider';

/* TEMPORARY — the About page is co-opted as a palette review surface for the
   colour meeting. Nothing else imports from here; delete the file's contents and
   restore the real About page afterwards.

   Hex codes are read from the live computed styles rather than hardcoded, so the
   labels always describe the palette currently applied to <html>. */

const TOKEN_GROUPS = [
    { label: 'Neutral', tokens: ['bg', 'surface', 'border', 'heading', 'body', 'inactive', 'muted'] },
    { label: 'Accent', tokens: ['accent', 'accent-dark', 'accent-light', 'accent-subtle'] },
    { label: 'Extra', tokens: ['teal', 'sky', 'rose', 'sand', 'green'] },
    { label: 'Status', tokens: ['success', 'warning', 'error'] },
];

const ALL_TOKENS = TOKEN_GROUPS.flatMap((group) => group.tokens);

/** Live values of every colour token, re-read whenever the palette changes. */
function useTokenValues() {
    const [values, setValues] = useState<Record<string, string>>({});

    useEffect(() => {
        const read = () => {
            const style = getComputedStyle(document.documentElement);
            setValues(
                Object.fromEntries(
                    ALL_TOKENS.map((token) => [
                        token,
                        style.getPropertyValue(`--color-${token}`).trim(),
                    ]),
                ),
            );
        };

        read();
        const observer = new MutationObserver(read);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-palette'],
        });
        return () => observer.disconnect();
    }, []);

    return values;
}

/** Every palette defined in the stylesheets, so the switcher needs no upkeep. */
function usePaletteNames() {
    const [names, setNames] = useState<string[]>([]);

    useEffect(() => {
        const found = new Set<string>();
        for (const sheet of Array.from(document.styleSheets)) {
            let rules: CSSRuleList;
            try {
                rules = sheet.cssRules;
            } catch {
                continue; // cross-origin sheet, not ours
            }
            for (const rule of Array.from(rules)) {
                const selector = (rule as CSSStyleRule).selectorText;
                const match = selector && /\[data-palette=["']?([^"'\]]+)["']?\]/.exec(selector);
                if (match) found.add(match[1]);
            }
        }
        setNames([...found]);
    }, []);

    return names;
}

function Swatch({ token, value }: { token: string; value: string }) {
    return (
        <div className="flex flex-col gap-1 text-left">
            <div
                className="h-11 w-full rounded-md border border-inactive"
                style={{ backgroundColor: `var(--color-${token})` }}
            />
            <span className="text-[0.7rem] font-semibold leading-tight text-heading">{token}</span>
            <span className="font-mono text-[0.65rem] uppercase leading-none text-inactive">
                {value || '—'}
            </span>
        </div>
    );
}

function PaletteSwitcher() {
    const names = usePaletteNames();
    const [active, setActive] = useState(() => document.documentElement.dataset.palette ?? '');

    const apply = (name: string) => {
        if (name) document.documentElement.dataset.palette = name;
        else delete document.documentElement.dataset.palette;
        setActive(name);
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            {['', ...names].map((name) => (
                <button
                    key={name || 'default'}
                    type="button"
                    onClick={() => apply(name)}
                    className={`cursor-pointer rounded-full border border-accent px-3 py-1 text-xs font-semibold transition-colors ${
                        active === name
                            ? 'bg-accent text-surface'
                            : 'bg-surface text-accent hover:bg-accent-subtle'
                    }`}
                >
                    {name || 'index.css'}
                </button>
            ))}
        </div>
    );
}

/* Shapes only — every block is a token, nothing is real content. Sized to sit
   beside the swatches on one screen. Hidden from assistive tech because it
   carries no information, only colour. */
function MockScreen() {
    return (
        <div
            aria-hidden="true"
            className="w-full overflow-hidden rounded-xl border-2 border-border shadow-lg shadow-accent-dark/10"
        >
            {/* nav */}
            <div className="flex items-center gap-2 border-b-2 border-muted bg-surface px-3 py-2">
                <div className="h-5 w-11 rounded bg-accent" />
                <div className="ml-3 flex gap-2">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-1.5 w-7 rounded-full bg-inactive" />
                    ))}
                </div>
                <div className="ml-auto flex gap-1.5">
                    <div className="h-5 w-11 rounded-full bg-muted" />
                    <div className="h-5 w-11 rounded-full bg-accent" />
                </div>
            </div>

            {/* hero */}
            <div className="relative flex h-32 flex-col items-center justify-center gap-2 bg-accent-light">
                <div className="absolute left-2 top-1/2 size-5 -translate-y-1/2 rounded-full bg-surface" />
                <div className="absolute right-2 top-1/2 size-5 -translate-y-1/2 rounded-full bg-surface" />
                <div className="h-4 w-40 rounded-full bg-surface" />
                <div className="flex gap-1.5">
                    <div className="h-3 w-14 rounded-full bg-surface" />
                    <div className="h-3 w-12 rounded-full bg-accent-subtle" />
                    <div className="h-3 w-10 rounded-full bg-green" />
                </div>
                <div className="mt-1 flex h-7 w-52 items-center rounded-full bg-surface px-1.5">
                    <div className="h-1.5 w-20 rounded-full bg-inactive" />
                    <div className="ml-auto h-5 w-14 rounded-full bg-accent" />
                </div>
            </div>

            {/* about */}
            <div className="relative bg-bg px-5 py-6">
                <SectionDivider fill="fill-bg" />
                <div className="grid grid-cols-2 items-center gap-5">
                    <div className="flex flex-col gap-2">
                        <div className="h-3.5 w-20 rounded-full bg-heading" />
                        <div className="h-1.5 w-full rounded-full bg-body" />
                        <div className="h-1.5 w-11/12 rounded-full bg-body" />
                        <div className="h-1.5 w-8/12 rounded-full bg-body" />
                        <div className="pressable mt-1 h-6 w-20 rounded-full bg-accent" />
                    </div>
                    <div className="relative mx-auto aspect-3/2 w-full max-w-[9rem]">
                        <div className="h-full w-full rounded-[46%_54%_58%_42%/48%_44%_56%_52%] bg-accent-light" />
                        <div className="pointer-events-none absolute -inset-1.5 rounded-[52%_48%_42%_58%/44%_56%_50%_50%] border-3 border-accent" />
                    </div>
                </div>

                {/* a small card, where status colours actually belong */}
                <div className="mt-5 flex w-44 items-center gap-2 rounded-lg bg-surface p-2 shadow-md shadow-accent-dark/10">
                    <div className="h-1.5 flex-1 rounded-full bg-muted" />
                    <div className="size-2.5 rounded-full bg-success" />
                    <div className="size-2.5 rounded-full bg-warning" />
                    <div className="size-2.5 rounded-full bg-error" />
                </div>
            </div>

            {/* journey */}
            <div className="relative flex items-center justify-center gap-3 bg-accent-subtle px-5 py-8">
                <SectionDivider fill="fill-accent-subtle" flip />
                <div className="size-5 rounded-full bg-teal" />
                <div className="h-1 w-8 rounded-full bg-inactive" />
                <div className="size-5 rounded-full bg-rose" />
                <div className="h-1 w-8 rounded-full bg-inactive" />
                <div className="size-5 rounded-full bg-sand" />
                <div className="h-1 w-8 rounded-full bg-inactive" />
                <div className="size-5 rounded-full bg-green" />
            </div>

            {/* revolution */}
            <div className="relative flex flex-col items-center gap-3 bg-sky px-5 py-8">
                <SectionDivider fill="fill-sky" />
                <div className="size-16 rounded-full bg-green" />
                <div className="pressable h-6 w-28 rounded-full bg-accent" />
            </div>

            {/* footer */}
            <div className="bg-border px-5 py-5">
                <div className="grid grid-cols-3 gap-4">
                    {[0, 1, 2].map((column) => (
                        <div key={column} className="flex flex-col gap-1.5">
                            <div className="h-2 w-12 rounded-full bg-muted" />
                            <div className="h-1.5 w-full rounded-full bg-inactive" />
                            <div className="h-1.5 w-10/12 rounded-full bg-inactive" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-2 bg-accent-dark" />
        </div>
    );
}

function About() {
    const values = useTokenValues();

    return (
        <section className="flex min-h-svh flex-col gap-5 bg-bg px-6 py-6">
            <PaletteSwitcher />

            <div className="mx-auto grid w-full max-w-7xl items-start gap-8 lg:grid-cols-2">
                <div className="flex flex-col gap-4">
                    {TOKEN_GROUPS.map((group) => (
                        <div key={group.label} className="flex flex-col gap-2">
                            <span className="text-left text-[0.65rem] font-bold uppercase tracking-widest text-inactive">
                                {group.label}
                            </span>
                            <div className="grid grid-cols-4 gap-3 xl:grid-cols-5">
                                {group.tokens.map((token) => (
                                    <Swatch key={token} token={token} value={values[token] ?? ''} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <MockScreen />
            </div>
        </section>
    );
}

export default About;
