import { useRef } from 'react';
import { FaXmark } from 'react-icons/fa6';

const SIZE_GUIDE_SRC = `${import.meta.env.BASE_URL}Sizes-chart-for-the-website-1-1-scaled.jpg`;

function SizeGuide() {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
            <button
                type="button"
                onClick={() => dialogRef.current?.showModal()}
                className="cursor-pointer font-bold text-accent-light underline"
            >
                Size Guide
            </button>
            <dialog
                ref={dialogRef}
                aria-label="Size guide"
                // A click on the dialog element itself can only be on the backdrop
                onClick={(event) => {
                    if (event.target === dialogRef.current) dialogRef.current.close();
                }}
                className="m-auto w-[calc(100%-2rem)] max-w-5xl rounded-2xl bg-white p-0 backdrop:bg-accent-dark/60"
            >
                <div className="relative">
                    <button
                        type="button"
                        aria-label="Close size guide"
                        onClick={() => dialogRef.current?.close()}
                        className="absolute top-3 left-3 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-border bg-surface text-heading"
                    >
                        <FaXmark aria-hidden="true" />
                    </button>
                    <img
                        src={SIZE_GUIDE_SRC}
                        alt="Koolskools size guide: chest, length and sleeve measurements in centimetres for polo shirts and T-shirts, sweatshirts and hoodies, and cardigans, from age 3-4 to XXXXL. Hoodies start from size 9-10."
                        loading="lazy"
                        className="w-full"
                    />
                </div>
            </dialog>
        </>
    );
}

export default SizeGuide;
