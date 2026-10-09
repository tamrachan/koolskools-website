import Carousel from "../components/Carousel";
import SchoolSearch from "../components/SchoolSearch";
import SectionDivider from "../components/SectionDivider";
import BlobFrame from "../components/BlobFrame";
import GoToButton from "../components/GoToButton";
import JourneyMap from "../components/JourneyMap";
import handsImage from "../assets/images/hands_IMG_8681.jpeg";
import aboutImage from "../assets/images/school_IMG_8175.jpeg";
import thirdImage from "../assets/images/IMG_9114.jpg";
import earthImage from "../assets/images/earth.svg";
import heroVideo from "../assets/images/hero_video.mp4";
import goldAward from "../assets/images/goldaward.jpg";
import {FaEarthEurope} from "react-icons/fa6";

function Home() {
    return (
        <>
            {/* Hero */}
            <section className="h-[calc(100svh-5rem)]">
                <Carousel
                    className="h-full"
                    label="Uniforms that change the world"
                    images={[
                        <video src={heroVideo} autoPlay muted loop playsInline className="opacity-90" />,
                        <img src={handsImage} alt="Hands" className="opacity-85" />,
                        <img src={aboutImage} alt="Schoolchildren" className="opacity-85" />,
                        <img src={thirdImage} alt="Schoolchildren" className="opacity-85" />
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

            {/* The Journey*/}
            <section className="relative flex min-h-svh items-center justify-center bg-accent-subtle">
                <SectionDivider fill="fill-accent-subtle" flip />
                
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-24">
                    
                    <div className="flex justify-end pr-8">
                        <GoToButton href="/journey">
                            The Journey <FaEarthEurope className="ml-2 shrink-0 translate-y-[3px]"/>
                        </GoToButton>
                    </div>
                    <JourneyMap />
                </div>

                {/* <p className="rounded-2xl border-2 border-dashed border-inactive px-10 py-8 font-heading text-3xl text-inactive">
                    The Journey
                </p> */}
            </section>

            {/* Join The Revolution */}
            <section className="relative flex min-h-svh items-center justify-center bg-sky">
                <SectionDivider fill="fill-sky" />
                <div className="relative flex w-full max-w-3xl flex-col items-center"> 
                    <div className="relative flex w-full max-w-xl items-center justify-center"> 
                        <img src={earthImage} alt="Earth" className="h-auto w-full max-w-md"/>
                        <div className=" absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                            <h2 className="font-heading text-center font-bold text-5xl sm:text-5xl md:text-6xl">
                                <span className="text-heading"> Join The </span> 
                                <span className="whitespace-nowrap text-accent">Revolution.</span>
                            </h2> 
                            <GoToButton href="/contact"> {/* might need to change link to a signup school page? */}
                                Sign up your school now 
                            </GoToButton>
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="flex flex-col bg-neutral-900 text-white px-10 py-12 text-left md:flex-row md:justify-between md:gap-10">

            {/* Contact Us */}
            <div className="flex w-full flex-1 flex-col items-start text-left md:border-r md:border-white/20 md:pr-8">
                <h3 className="font-heading text-2xl mb-4">Contact Us</h3>
                <p className="text-sm mb-2">
                <strong>Tel</strong>. <a href="tel:02382026260" className="hover:underline">023 82 026 260</a>
                </p>
                <p className="text-sm mb-6">
                <strong>Email</strong>. <a href="mailto:info@koolskools4u.co.uk" className="hover:underline">info@koolskools4u.co.uk</a>
                </p>

                <div className="flex gap-4">
                <a href="[BADGE_1_LINK]">
                    <img src="goldaward" alt="South West Fair Trade Business Awards Gold Award 2019" className="h-20 w-auto" />
                </a>
                <a href="[BADGE_2_LINK]">
                    <img src="[BADGE_2_IMAGE_SRC]" alt="[BADGE_2_ALT_TEXT]" className="h-20 w-auto" />
                </a>
                </div>
            </div>

            {/* Socials + Sister Site */}
            <div className="flex w-full flex-1 flex-col items-start text-left mt-10 md:mt-0 md:border-r md:border-white/20 md:px-8">
                <h3 className="font-heading text-2xl mb-4">Follow Our Socials</h3>
                <div className="flex gap-3 mb-8">
                <a href="[FACEBOOK_URL]">
                    <img src="[FACEBOOK_ICON_SRC]" alt="Facebook" className="h-9 w-9 rounded-full" />
                </a>
                <a href="[TWITTER_URL]">
                    <img src="[TWITTER_ICON_SRC]" alt="Twitter" className="h-9 w-9 rounded-full" />
                </a>
                <a href="[YOUTUBE_URL]">
                    <img src="[YOUTUBE_ICON_SRC]" alt="YouTube" className="h-9 w-9 rounded-full" />
                </a>
                </div>

                <h3 className="font-heading text-2xl mb-4">Visit Our Sister Site</h3>
                <a href="[SISTER_SITE_URL]" className="block mb-2">
                <img src="[SISTER_SITE_LOGO_SRC]" alt="[SISTER_SITE_NAME]" className="h-16 w-auto" />
                </a>
                <a href="[SISTER_SITE_URL]" className="text-sm underline">[SISTER_SITE_DISPLAY_URL]</a>
            </div>

            {/* Newsletter + Certifications bit */}
            <div className="flex w-full flex-1 flex-col items-start text-left mt-10 md:mt-0 md:pl-8">
                <h3 className="font-heading text-2xl mb-4">Read Our Newsletter</h3>
                <form
                action="[NEWSLETTER_FORM_ACTION]"
                method="post"
                className="flex flex-wrap gap-2 mb-8"
                >
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="flex-1 min-w-[160px] rounded-full px-5 py-3 text-sm text-black bg-neutral-100"
                />
                <button
                    type="submit"
                    className="rounded-full px-6 py-3 text-sm bg-blue-950 text-white"
                >
                    Sign up
                </button>
                </form>

                <h3 className="font-heading text-2xl mb-4">Proud To Be...</h3>
                <div className="flex flex-wrap gap-3 mb-3">
                <a href="[CERT_1_LINK]">
                    <img src="[CERT_1_IMAGE_SRC]" alt="[CERT_1_ALT_TEXT]" className="h-16 w-auto bg-white p-1 rounded" />
                </a>
                <a href="[CERT_2_LINK]">
                    <img src="[CERT_2_IMAGE_SRC]" alt="[CERT_2_ALT_TEXT]" className="h-16 w-auto bg-white p-1 rounded" />
                </a>
                <a href="[CERT_3_LINK]">
                    <img src="[CERT_3_IMAGE_SRC]" alt="[CERT_3_ALT_TEXT]" className="h-16 w-auto bg-white p-1 rounded" />
                </a>
                </div>
                <p className="text-sm text-white/70">
                See the FT SW Awards Press Release{" "}
                <a href="[PRESS_RELEASE_URL]" className="underline text-white">Here</a>
                </p>
            </div>

            </footer>
        </>
    );
}

export default Home;
