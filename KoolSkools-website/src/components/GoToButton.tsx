import { FaArrowRight } from "react-icons/fa6";

function GoToButton({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} className="pressable flex w-fit bg-accent text-bg font-bold border border-accent-dark rounded-full px-4 py-2">
            {children}
            <FaArrowRight className="inline-block ml-2 mt-1" />
        </a>
    );
}

export default GoToButton;
