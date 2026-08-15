import Carousel from "../components/Carousel";
import SchoolSearch from "../components/SchoolSearch";
import SectionDivider from "../components/SectionDivider";
import BlobFrame from "../components/BlobFrame";
import GoToButton from "../components/GoToButton";
import handsImage from "../assets/images/hands_IMG_8681.jpeg";
import aboutImage from "../assets/images/school_IMG_8175.jpeg";


function Home() {
    return (
        <>
            {/* Hero */}
            <section className="h-[calc(100svh-5rem)]">
                <Carousel
                    className="h-full"
                    label="Uniforms that change the world"
                    images={[
                        <img src={handsImage} alt="Hands" className="opacity-85" />,
                        <img src={aboutImage} alt="Schoolchildren" className="opacity-85" />
                    ]}
                >
                    <h1 className="flex flex-col font-quote uppercase leading-[0.85] text-surface drop-shadow-lg drop-shadow-accent-dark/15 [-webkit-text-stroke:0.2em_var(--color-accent-dark)] [paint-order:stroke_fill]">
                        <span className="text-6xl tracking-[0.08em] md:text-8xl">Uniforms</span>
                        <span className="text-4xl md:text-6xl">
                            That <span className="text-accent-light">Change</span> The{" "}
                            <span className="text-green">World</span>
                        </span>
                    </h1>
                    <SchoolSearch />
                </Carousel>
            </section>

            {/* About Us */}
            <section className="relative flex min-h-svh items-center bg-bg">
                <SectionDivider fill="fill-bg" />
                <div className="mx-auto grid w-full max-w-[1126px] items-center gap-12 px-10 py-20 text-left md:grid-cols-[1fr_1.2fr]">
                    <div className="flex flex-col gap-6">
                        <h2 className="font-heading text-5xl text-heading">
                            About Us
                        </h2>
                        <p className="text-md/6 text-body">
                            School life is tough on clothes; ours are tougher. Made without harmful
                            chemicals, our garments are soft on sensitive skin and built to survive
                            both the playground and the washing machine. It’s high-performance school
                            wear that feels as good as it looks, wash after wash...
                        </p>
                        <GoToButton href="/about">Learn More</GoToButton>
                    </div>
                    <BlobFrame
                        src={aboutImage}
                        alt="Eight schoolchildren holding up signs saying 'Happy Fairtrade in Education Week'"
                        className="mx-auto max-w-md"
                    />
                </div>
            </section>

            {/* The Journey — placeholder */}
            <section className="relative flex min-h-svh items-center justify-center bg-accent-subtle">
                <SectionDivider fill="fill-accent-subtle" flip />
                <p className="rounded-2xl border-2 border-dashed border-inactive px-10 py-8 font-heading text-3xl text-inactive">
                    The Journey
                </p>
            </section>

            {/* Join The Revolution — placeholder */}
            <section className="relative flex min-h-svh items-center justify-center bg-sky">
                <SectionDivider fill="fill-sky" />
                <p className="rounded-2xl border-2 border-dashed border-surface/70 px-10 py-8 font-heading text-3xl text-surface">
                    Join The Revolution
                </p>
            </section>

            {/* Footer — placeholder */}
            <footer className="flex min-h-80 items-center justify-center bg-border">
                <p className="rounded-2xl border-2 border-dashed border-inactive px-10 py-8 font-heading text-3xl text-muted">
                    Footer
                </p>
            </footer>
        </>
    );
}

export default Home;
