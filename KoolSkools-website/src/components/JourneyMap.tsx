import journeyMapImage from "../assets/images/journey_map.svg";
import boatImage from "../assets/images/boat.svg";

function JourneyMap() {
    return (
        <div className="relative mx-auto w-full max-w-5xl">
            <img
                src={journeyMapImage}
                alt="Map showing the KoolSkools supply-chain journey between India and Southampton"
                className="h-auto w-full"
            />
            <img
                src={boatImage}
                alt="Boat indicating journey path"
                aria-hidden="true"
                className="pointer-events-none absolute left-[27%] top-[31%] h-auto w-[7%] -translate-x-1/2 -translate-y-1/2"
            />
            {/* need to create route path so boat can actually follow it properly, above values are just temp static ones */}
        </div>
    );
}
export default JourneyMap;