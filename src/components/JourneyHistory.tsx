import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, stagger, svg, utils } from "animejs";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaCalendar, FaHouse, FaLocationDot } from "react-icons/fa6";
import journeyMapImage from "../assets/images/journey_map.svg";
import boatImage from "../assets/images/boat.svg";
import { journeySteps, finale, seaRoute, type JourneyStep } from "./journeySteps";

const MAP_W = 1481;
const MAP_H = 911;
const FINALE = journeySteps.length + 1; // 0 = overview, 1..7 = steps, 8 = shipped to the UK

/* Leaving the journey: the Home button returns to where the journey was opened from,
 * finishing it carries on to the next section of the home page */
const HOME_LINK = "/#journey";
const FINISH_LINK = "/#revolution";

/* Matches the `side:` variant in index.css: card beside the map rather than below it */
const SIDE_QUERY = "(min-width: 768px), (min-width: 560px) and (orientation: landscape)";
const isSide = () => window.matchMedia(SIDE_QUERY).matches;

type Pausable = { pause: () => unknown };

/* Where the camera sits for a step: the step's marker is pinned to an anchor
 * point on screen, leaving room for the info card (right on side layouts, below otherwise) */
function cameraFor(step: number, w: number, h: number) {
    const fit = Math.min(w / MAP_W, h / MAP_H) * 0.92;
    const wide = isSide();
    let focus: [number, number] = [MAP_W / 2, MAP_H / 2];
    let zoom = 1;
    let anchor: [number, number] = wide ? [0.56, 0.5] : [0.5, 0.55];

    if (step >= 1 && step < FINALE) {
        const s = journeySteps[step - 1];
        focus = s.marker;
        zoom = wide ? s.zoom : s.zoom * 1.7; // narrow screens fit to width, so zoom further
        anchor = wide ? [0.3, 0.5] : [0.5, 0.26];
    } else if (step === FINALE) {
        zoom = wide ? 0.85 : 1;
        anchor = wide ? [0.36, 0.5] : [0.5, 0.3];
    }

    const scale = fit * zoom;
    return {
        translateX: anchor[0] * w - focus[0] * scale,
        translateY: anchor[1] * h - focus[1] * scale,
        scale,
    };
}

/* Gently curved line between two markers */
function trailPath([ax, ay]: [number, number], [bx, by]: [number, number]) {
    const mx = (ax + bx) / 2 + (by - ay) * 0.25;
    const my = (ay + by) / 2 - (bx - ax) * 0.25;
    return `M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`;
}

function JourneyHistory() {
    const [step, setStep] = useState(0);
    const stepRef = useRef(step);
    const stageRef = useRef<HTMLDivElement>(null);
    const cameraRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const seaRef = useRef<SVGPathElement>(null);
    const boatRef = useRef<SVGGElement>(null);
    const firstRun = useRef(true);
    const navigate = useNavigate();

    const go = useCallback((next: number) => {
        setStep(Math.max(0, Math.min(FINALE, next)));
    }, []);

    // Keyboard navigation
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            if (e.key === "ArrowRight" && stepRef.current === FINALE) {
                e.preventDefault();
                navigate(FINISH_LINK);
                return;
            }
            const keys: Record<string, number> = {
                ArrowRight: stepRef.current + 1,
                ArrowLeft: stepRef.current - 1,
                Home: 0,
                Escape: 0,
                End: FINALE,
            };
            if (!(e.key in keys)) return;
            e.preventDefault();
            go(keys[e.key]);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go, navigate]);

    // Keep the camera framed when the window resizes
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const observer = new ResizeObserver(() => {
            if (cameraRef.current) {
                utils.set(cameraRef.current, cameraFor(stepRef.current, stage.clientWidth, stage.clientHeight));
            }
        });
        observer.observe(stage);
        return () => observer.disconnect();
    }, []);

    // Play the animation for the current step
    useLayoutEffect(() => {
        stepRef.current = step;
        const stage = stageRef.current;
        const cam = cameraRef.current;
        if (!stage || !cam) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const ms = (n: number) => (reduce ? 0 : n);
        const wide = isSide();
        const first = firstRun.current;
        firstRun.current = false;
        const running: Pausable[] = [];
        const play = (anim: Pausable) => running.push(anim);

        // Camera: fly to the step, then everything else arrives once it's nearly there
        const target = cameraFor(step, stage.clientWidth, stage.clientHeight);
        if (first) utils.set(cam, target);
        else play(animate(cam, { ...target, duration: ms(1400), ease: "inOutQuart" }));
        const arrive = first ? ms(200) : ms(950);
        const overview = step === 0 || step === FINALE;

        // Markers
        cam.querySelectorAll<SVGGElement>("[data-marker]").forEach((el, i) => {
            const n = i + 1;
            if (step === 0) {
                play(animate(el, {
                    opacity: [0, 1], scale: [0, 1], translateY: [-40, 0],
                    delay: arrive + ms(i * 140), duration: ms(900), ease: "outBounce",
                }));
            } else if (n === step) {
                play(animate(el, {
                    opacity: 1, scale: [0.4, 1.5], translateY: [-60, 0],
                    delay: arrive, duration: ms(1100), ease: "outElastic(1, .55)",
                }));
            } else {
                play(animate(el, {
                    opacity: overview || n < step ? 1 : 0.35,
                    scale: overview ? 1 : n < step ? 0.9 : 0.75,
                    translateY: 0,
                    duration: ms(500), ease: "outQuad",
                }));
            }
        });

        // Trail between markers, drawn up to the current step
        const trail = svg.createDrawable(cam.querySelectorAll("[data-trail]"));
        trail.forEach((segment, i) => {
            const drawn = overview || i + 2 <= step;
            play(animate(segment, {
                draw: drawn ? "0 1" : "0 0",
                delay: step === 0 ? arrive + ms(300 + i * 140) : drawn ? Math.max(0, arrive - ms(350)) : 0,
                duration: ms(drawn ? 700 : 300),
                ease: "inOutSine",
            }));
        });

        // Boat sails to Southampton in the finale
        const sea = seaRef.current;
        const boat = boatRef.current;
        if (sea && boat) {
            const [seaLine] = svg.createDrawable(sea);
            const length = sea.getTotalLength();
            const sail = { progress: 0 };
            const placeBoat = () => {
                const p = sea.getPointAtLength(sail.progress * length);
                boat.setAttribute("transform", `translate(${p.x} ${p.y})`);
            };
            placeBoat();
            if (step === FINALE) {
                const voyage = { delay: arrive, duration: ms(3200), ease: "inOutSine" };
                play(animate(seaLine, { draw: ["0 0", "0 1"], ...voyage }));
                play(animate(sail, { progress: [0, 1], ...voyage, onUpdate: placeBoat }));
                play(animate(boat, { opacity: [0, 1], delay: arrive, duration: ms(400) }));
            } else {
                utils.set(seaLine, { draw: "0 0" });
                utils.set(boat, { opacity: 0 });
            }
        }

        // Overview title or step card
        const panel = cardRef.current;
        if (panel) {
            play(animate(panel, {
                opacity: [0, 1],
                translateX: [wide && step !== 0 ? 60 : 0, 0],
                translateY: [wide || step === 0 ? 0 : 40, 0],
                delay: Math.max(0, arrive - ms(300)), duration: ms(700), ease: "outQuart",
            }));
            play(animate(panel.querySelectorAll("[data-reveal]"), {
                opacity: [0, 1], translateY: [16, 0],
                delay: stagger(ms(80), { start: arrive }), duration: ms(600), ease: "outQuart",
            }));
            play(animate(panel.querySelectorAll("[data-photo]"), {
                opacity: [0, 1], scale: [0.8, 1],
                rotate: { from: stagger([-9, 9]), to: stagger([-1.5, 1.5]) },
                delay: stagger(ms(120), { start: arrive + ms(250) }), duration: ms(900), ease: "outBack(1.4)",
            }));
            play(animate(svg.createDrawable(panel.querySelectorAll("[data-draw]")), {
                draw: ["0 0", "0 1"],
                delay: stagger(ms(250), { start: arrive + ms(200) }), duration: ms(900), ease: "inOutSine",
            }));
        }

        return () => running.forEach((anim) => anim.pause());
    }, [step]);

    const current = step >= 1 && step < FINALE ? journeySteps[step - 1] : null;

    return (
        <main className="relative h-[calc(100svh-5rem)] overflow-hidden bg-bg text-left">
            {/* Map camera: 1 map unit = 1px before scaling, so overlays share the map's coordinates */}
            <div ref={stageRef} className="absolute inset-0">
                <div
                    ref={cameraRef}
                    className="absolute left-0 top-0 origin-top-left"
                    style={{ width: MAP_W, height: MAP_H }}
                >
                    {/* Routes sit beneath the map image so its place labels cover the lines */}
                    <svg
                        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                        className="absolute inset-0 h-full w-full overflow-visible"
                        aria-hidden="true"
                    >
                        {journeySteps.slice(1).map((s, i) => (
                            <path
                                key={s.title}
                                data-trail
                                d={trailPath(journeySteps[i].marker, s.marker)}
                                fill="none"
                                stroke="var(--color-accent)"
                                strokeWidth={3}
                                strokeLinecap="round"
                            />
                        ))}

                        <path ref={seaRef} d={seaRoute} fill="none" stroke="var(--color-accent)" strokeWidth={3} strokeLinecap="round" />
                    </svg>

                    <img
                        src={journeyMapImage}
                        alt="Map showing the KoolSkools supply-chain journey between India and Southampton"
                        className="absolute inset-0 h-full w-full"
                        draggable={false}
                    />

                    {/* Boat and markers above the map */}
                    <svg
                        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                        className="absolute inset-0 h-full w-full overflow-visible"
                        aria-hidden="true"
                    >
                        <g ref={boatRef} style={{ opacity: 0 }}>
                            <image href={boatImage} x={-55} y={-75} width={110} height={110} />
                        </g>

                        {journeySteps.map((s, i) => (
                            <g key={s.title} transform={`translate(${s.marker[0]} ${s.marker[1]})`}>
                                {i + 1 === step && (
                                    <circle
                                        r={15}
                                        fill={s.color}
                                        className="origin-center opacity-50 [transform-box:fill-box] motion-safe:animate-ping"
                                    />
                                )}
                                <g data-marker style={{ opacity: 0, transformBox: "fill-box", transformOrigin: "center" }}>
                                    <circle r={15} fill={s.color} stroke="var(--color-heading)" strokeWidth={2} />
                                    <text
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fill="var(--color-surface)"
                                        className="font-heading text-[17px]"
                                    >
                                        {i + 1}
                                    </text>
                                </g>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            {/* Always-available way back to the home page */}
            <Link
                to={HOME_LINK}
                className="pressable absolute left-4 top-4 z-20 flex h-10 items-center gap-2 rounded-full border border-accent-dark bg-surface px-4 text-sm font-bold text-heading no-underline side:left-6"
            >
                <FaHouse aria-hidden="true" /> Home
            </Link>

            {/* Overview title or step card, remounted per step so it animates in fresh */}
            <div aria-live="polite">
                {step === 0 && (
                    <div
                        key="overview"
                        ref={cardRef}
                        style={{ opacity: 0 }}
                        className="absolute inset-x-4 top-18 flex max-w-md flex-col gap-3 rounded-3xl bg-surface/80 p-5 shadow-lg backdrop-blur-sm side:bottom-20 side:left-8 side:top-auto side:max-w-sm side:p-6"
                    >
                        <p data-reveal style={{ opacity: 0 }} className="text-sm font-semibold uppercase tracking-widest text-accent">
                            The Journey
                        </p>
                        <h1 data-reveal style={{ opacity: 0 }} className="font-heading text-4xl text-heading side:text-5xl lg:text-6xl">
                            From Seed to School
                        </h1>
                        <p data-reveal style={{ opacity: 0 }} className="text-body side:text-lg">
                            Follow the {journeySteps.length} steps that turn organic cotton grown in India
                            into a KoolSkools uniform.
                        </p>
                        <p data-reveal style={{ opacity: 0 }} className="flex items-center gap-2 text-sm text-inactive [@media(pointer:coarse)]:hidden">
                            Press
                            <kbd className="rounded-md border border-border bg-surface px-2 py-0.5 font-body text-heading">→</kbd>
                            or click Start to begin
                        </p>
                        <p data-reveal style={{ opacity: 0 }} className="text-sm text-inactive [@media(pointer:fine)]:hidden">
                            Tap the arrow below to begin
                        </p>
                    </div>
                )}

                {current && (
                    <StepCard key={step} ref={cardRef} number={step} step={current} />
                )}

                {step === FINALE && (
                    <StepCard key="finale" ref={cardRef} step={{ ...finale, photos: [] }} boat />
                )}
            </div>

            {/* Controls */}
            <nav
                aria-label="Journey steps"
                className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2 px-4 sm:gap-3"
            >
                <button
                    type="button"
                    onClick={() => go(step - 1)}
                    disabled={step === 0}
                    aria-label="Previous step"
                    className="pressable flex size-11 items-center justify-center rounded-full border border-accent-dark bg-surface text-heading disabled:pointer-events-none disabled:opacity-40"
                >
                    <FaArrowLeft />
                </button>

                <ol className="m-0 flex list-none items-center gap-1 p-0 sm:gap-1.5">
                    {Array.from({ length: FINALE + 1 }, (_, i) => {
                        const label = i === 0 ? "Overview" : i === FINALE ? finale.title : `${i}. ${journeySteps[i - 1].title}`;
                        const color = i === 0 ? "var(--color-inactive)" : i === FINALE ? finale.color : journeySteps[i - 1].color;
                        return (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => go(i)}
                                    aria-label={label}
                                    aria-current={i === step ? "step" : undefined}
                                    title={label}
                                    className={`block h-3 rounded-full border border-accent-dark transition-all duration-300 ${i === step ? "w-8" : "w-3 opacity-50 hover:opacity-100"}`}
                                    style={{ backgroundColor: color }}
                                />
                            </li>
                        );
                    })}
                </ol>

                {step === FINALE ? (
                    <Link
                        to={FINISH_LINK}
                        aria-label="Finish and return to the home page"
                        className="pressable flex h-11 items-center justify-center gap-2 rounded-full border border-accent-dark bg-accent px-4 font-bold text-surface no-underline"
                    >
                        <span className="max-sm:hidden">Finish</span>
                        <FaArrowRight />
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={() => go(step + 1)}
                        aria-label="Next step"
                        className="pressable flex h-11 items-center justify-center gap-2 rounded-full border border-accent-dark bg-accent px-4 font-bold text-surface"
                    >
                        <span className="max-sm:hidden">{step === 0 ? "Start" : "Next"}</span>
                        <FaArrowRight />
                    </button>
                )}
            </nav>
        </main>
    );
}

type CardStep = Pick<JourneyStep, "title" | "place" | "body" | "tags" | "photos" | "color"> & { when?: string };

function StepCard({ ref, step, number, boat }: {
    ref: React.Ref<HTMLDivElement>;
    step: CardStep;
    number?: number;
    boat?: boolean;
}) {
    const photos = step.photos;
    return (
        <div
            ref={ref}
            style={{ opacity: 0, backgroundColor: step.color }}
            className="absolute inset-x-4 bottom-20 max-h-[52%] overflow-y-auto rounded-[2rem] p-3 shadow-xl side:inset-x-auto side:top-4 side:bottom-20 side:right-6 side:my-auto side:h-fit side:max-h-[calc(100%-6rem)] side:w-[min(30rem,46vw)] lg:right-14"
        >
            <article
                className="flex flex-col gap-4 rounded-[1.5rem] p-5 side:p-7"
                style={{ backgroundColor: `color-mix(in srgb, ${step.color} 12%, var(--color-surface))` }}
            >
                <p data-reveal style={{ opacity: 0 }} className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-inactive">
                    <span className="flex items-center gap-1.5"><FaLocationDot /> {step.place}</span>
                    {step.when && <span className="flex items-center gap-1.5"><FaCalendar /> {step.when}</span>}
                </p>
                <h2 data-reveal style={{ opacity: 0 }} className="font-heading text-3xl uppercase leading-tight text-heading md:text-4xl">
                    {number && <>{number}. </>}{step.title}
                </h2>
                <p data-reveal style={{ opacity: 0 }} className="leading-relaxed text-body">
                    {step.body}
                </p>
                <ul data-reveal style={{ opacity: 0 }} className="m-0 flex list-none flex-wrap gap-2 p-0">
                    {step.tags.map((tag) => (
                        <li
                            key={tag}
                            className="rounded-full border px-3 py-1 text-sm font-semibold text-heading"
                            style={{ borderColor: step.color, backgroundColor: "var(--color-surface)" }}
                        >
                            {tag}
                        </li>
                    ))}
                </ul>

                {photos.length > 0 && (
                    <div className="grid gap-3 pt-1" style={{ gridTemplateColumns: `repeat(${photos.length}, 1fr)` }}>
                        {photos.map((photo) => (
                            <img
                                key={photo.src}
                                data-photo
                                src={photo.src}
                                alt={photo.alt}
                                style={{ opacity: 0 }}
                                className={`w-full rounded-xl border-4 border-surface object-cover shadow-md ${photos.length === 1 ? "aspect-video" : photos.length === 2 ? "aspect-[4/3]" : "aspect-square"}`}
                            />
                        ))}
                    </div>
                )}

                {photos.length === 0 && !boat && <Seedlings />}
            </article>
        </div>
    );
}

/* Line drawing of seedlings in the style of the map, drawn on with anime.js */
function Seedlings() {
    const line = { fill: "none", stroke: "var(--color-heading)", strokeWidth: 2.5, strokeLinecap: "round" as const };
    return (
        <svg viewBox="0 0 240 110" className="mx-auto h-auto w-full max-w-xs" aria-hidden="true">
            <path data-draw {...line} d="M8 96 C50 88 80 102 120 95 S190 87 232 97" />
            <g>
                <path data-draw {...line} d="M80 94 C80 78 78 66 80 50" />
                <path data-draw {...line} stroke="var(--color-green)" d="M80 68 C66 56 50 58 44 66 C56 74 70 74 80 68" />
                <path data-draw {...line} stroke="var(--color-green)" d="M80 56 C92 40 110 38 118 46 C108 58 92 60 80 56" />
            </g>
            <g>
                <path data-draw {...line} d="M160 94 C160 84 159 78 160 70" />
                <path data-draw {...line} stroke="var(--color-green)" d="M160 80 C150 72 140 73 136 78 C144 84 154 84 160 80" />
                <path data-draw {...line} stroke="var(--color-green)" d="M160 74 C168 64 180 63 185 68 C178 76 168 77 160 74" />
            </g>
        </svg>
    );
}

export default JourneyHistory;
