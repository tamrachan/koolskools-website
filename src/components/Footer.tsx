function Footer() {
    return (
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
    );
}

export default Footer;
