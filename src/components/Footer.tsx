import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa6";
import goldAward from "../assets/images/footer/swft-gold-award-2019.png";
import fairtrade from "../assets/images/footer/fairtrade.png";
import sustainable from "../assets/images/footer/SUstainable Logo.png";
import sftfMember from "../assets/images/footer/SFTF-Member-logo-RGB.jpg";
import grs from "../assets/images/footer/Global Recycled Standard.png";
import gots from "../assets/images/footer/Global_Organic_Textile_Standard_logo.png";

/* Logos keep their proportions at any width: rows wrap instead of squeezing,
 * and object-contain scales an image down evenly if it's ever wider than its column */
const LOGO = "block w-auto max-w-full shrink-0 object-contain";
const TILE = "rounded bg-white p-2"; // white rounded tile shared by the certification logos

/* TODO: fill in the real links. Empty strings render without a link. */
const LINKS = {
    goldAward: "",
    fairtrade: "",
    facebook: "",
    twitter: "",
    youtube: "",
    sister: "https://su-stainable.com",
    newsletterForm: "",
    grs: "",
    gots: "",
    sftf: "",
    pressRelease: "",
};

/** Wraps children in a link only when there's somewhere to go */
function MaybeLink({ href, label, className, children }: {
    href: string;
    label?: string;
    className?: string;
    children: React.ReactNode;
}) {
    if (!href) return <span className={className ?? "block"}>{children}</span>;
    return (
        <a href={href} aria-label={label} target="_blank" rel="noreferrer" className={className ?? "block"}>
            {children}
        </a>
    );
}

const socials = [
    { label: "Facebook", href: LINKS.facebook, Icon: FaFacebook, color: "#1877f2", fill: "inset-[12%] rounded-full" },
    { label: "Twitter", href: LINKS.twitter, Icon: FaTwitter, color: "#1d9bf0", fill: "hidden" },
    { label: "YouTube", href: LINKS.youtube, Icon: FaYoutube, color: "#ff0000", fill: "inset-[30%]" },
];

function Footer() {
    return (
        <footer className="bg-border px-10 py-12 text-left text-surface">
            <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-[1fr_1fr_1.4fr] md:gap-0 md:divide-x md:divide-surface/30">
                {/* Contact Us */}
                <div className="flex flex-col items-start gap-4 md:pr-8">
                    <h3 className="font-heading text-3xl">Contact Us</h3>
                    <p className="text-md">
                        <strong>Tel</strong>. <a href="tel:02382026260" className="hover:underline">023 82 026 260</a>
                    </p>
                    <p className="text-md">
                        <strong>Email</strong>.{" "}
                        <a href="mailto:info@koolskools4u.co.uk" className="break-all hover:underline">info@koolskools4u.co.uk</a>
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-8">
                        <MaybeLink href={LINKS.goldAward}>
                            <img
                                src={goldAward}
                                alt="South West Fair Trade Business Awards Gold Award 2019"
                                className={`${LOGO} h-36`}
                            />
                        </MaybeLink>
                        <MaybeLink href={LINKS.fairtrade}>
                            <img src={fairtrade} alt="Fairtrade" className={`${LOGO} h-28`} />
                        </MaybeLink>
                    </div>
                </div>

                {/* Socials + Sister Site */}
                <div className="flex flex-col items-start gap-4 md:px-8">
                    <h3 className="font-heading text-3xl">Follow Our Socials</h3>
                    <ul className="m-0 flex list-none gap-6 p-0">
                        {socials.map(({ label, href, Icon, color, fill }) => (
                            <li key={label}>
                                <MaybeLink href={href} label={label} className="relative block text-5xl transition-transform hover:scale-110">
                                    {/* white behind the icon's cut-out so it reads like the brand logo */}
                                    <span aria-hidden="true" className={`absolute bg-white ${fill}`} />
                                    <Icon className="relative" style={{ color }} aria-hidden="true" />
                                </MaybeLink>
                            </li>
                        ))}
                    </ul>

                    <h3 className="mt-6 font-heading text-3xl">Visit Our Sister Site</h3>
                    <a href={LINKS.sister} target="_blank" rel="noreferrer" className="flex flex-wrap items-end gap-4">
                        <img src={sustainable} alt="SUstainable" className={`${LOGO} h-24`} />
                        <span className="text-xl text-accent-subtle underline">su-stainable.com</span>
                    </a>
                </div>

                {/* Newsletter + Certifications */}
                <div className="flex flex-col items-start gap-4 md:pl-8">
                    <h3 className="font-heading text-3xl">Read Our Newsletter</h3>
                    <form
                        action={LINKS.newsletterForm || undefined}
                        method="post"
                        className="flex w-full flex-wrap gap-4"
                    >
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            aria-label="Email address"
                            required
                            className="min-w-[12rem] flex-1 rounded-full border-2 border-accent-dark bg-surface px-6 py-3 text-heading"
                        />
                        <button
                            type="submit"
                            className="pressable cursor-pointer rounded-full border border-accent-dark bg-accent px-6 py-3 font-semibold text-surface"
                        >
                            Sign up
                        </button>
                    </form>

                    <h3 className="mt-2 font-heading text-3xl">Proud To Be...</h3>
                    <div className="flex flex-wrap items-center gap-6">
                        <MaybeLink href={LINKS.grs}>
                            <img src={grs} alt="Global Recycled Standard" className={`${LOGO} ${TILE} h-20`} />
                        </MaybeLink>
                        <MaybeLink href={LINKS.gots}>
                            <img src={gots} alt="Global Organic Textile Standard (GOTS)" className={`${LOGO} ${TILE} h-20`} />
                        </MaybeLink>
                        <MaybeLink href={LINKS.sftf}>
                            <img src={sftfMember} alt="Scottish Fair Trade Forum Member" className={`${LOGO} ${TILE} h-20`} />
                        </MaybeLink>
                    </div>
                    <p className="text-md text-surface/80">
                        See the FT SW Awards Press Release{" "}
                        <MaybeLink href={LINKS.pressRelease} className="text-accent-subtle underline">Here</MaybeLink>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
