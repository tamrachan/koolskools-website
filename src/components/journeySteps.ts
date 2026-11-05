import harvestCotton from "../assets/images/journey/harvest-cotton.jpg";
import ginningPress from "../assets/images/journey/ginning-press.jpg";
import ginningCleaning from "../assets/images/journey/ginning-cleaning.jpg";
import spinningSliver from "../assets/images/journey/spinning-sliver.jpg";
import spinningFrame from "../assets/images/journey/spinning-frame.jpg";
import spinningCones from "../assets/images/journey/spinning-cones.jpg";
import knittingMachine from "../assets/images/journey/knitting-machine.jpg";
import dyeingFabric from "../assets/images/journey/dyeing-fabric.jpg";
import cmtStitching from "../assets/images/journey/cmt-stitching.jpg";

export type JourneyPhoto = { src: string; alt: string };

export type JourneyStep = {
    title: string;
    place: string;
    when?: string;
    body: string;
    tags: string[];
    photos: JourneyPhoto[];
    /** Theme colour for the marker and card frame */
    color: string;
    /** Marker position in journey_map.svg units (viewBox 0 0 1481 911) */
    marker: [number, number];
    /** Camera zoom relative to the fitted overview */
    zoom: number;
};

/* Marker positions are illustrative, placed near the state labels on the map.
 * Update `place` and `marker` if a factory moves. */
export const journeySteps: JourneyStep[] = [
    {
        title: "Cotton Planting",
        place: "Orissa, India",
        when: "May to June",
        body: "Every year our cotton is planted in May and June. Farmers use non-GMO seeds to grow our organic cotton.",
        tags: ["Non-GMO seeds", "Organic"],
        photos: [],
        color: "var(--color-green)",
        marker: [945, 600],
        zoom: 2.2,
    },
    {
        title: "Cotton Harvest",
        place: "Orissa, India",
        when: "October to January",
        body: "The cotton is picked between October and December or January. In a good year the fields are picked 3-4 times; in a not-so-good year, 2-3 times.",
        tags: ["3-4 pickings in a good year", "2-3 in a poor year"],
        photos: [{ src: harvestCotton, alt: "A man lying in a huge pile of freshly picked white cotton" }],
        color: "var(--color-sand)",
        marker: [985, 588],
        zoom: 2.2,
    },
    {
        title: "Ginning Factory",
        place: "Telangana, India",
        body: "At the ginning factory the cotton is cleaned. The seeds and bits of plant are removed, leaving soft, clean fibres ready to be spun.",
        tags: ["Cleaning the cotton"],
        photos: [
            { src: ginningCleaning, alt: "A worker sorting a large heap of raw cotton" },
            { src: ginningPress, alt: "A bale press inside the ginning factory" },
        ],
        color: "var(--color-rose)",
        marker: [845, 675],
        zoom: 2.2,
    },
    {
        title: "Spinning Factory",
        place: "Tamil Nadu, India",
        body: "The clean cotton is combed into soft ropes, then twisted and spun into organic cotton yarn and wound onto cones.",
        tags: ["Organic cotton yarn"],
        photos: [
            { src: spinningSliver, alt: "A hand holding a rope of combed cotton above large cans" },
            { src: spinningFrame, alt: "A cone of white yarn in front of rows of spinning machines" },
            { src: spinningCones, alt: "A pyramid of yarn cones packed and ready to leave the spinning factory" },
        ],
        color: "var(--color-teal)",
        marker: [725, 735],
        zoom: 2,
    },
    {
        title: "Knitting Factory",
        place: "Tamil Nadu, India",
        body: "The yarn is knitted into fabric: 100% Fairtrade organic cotton for our T-shirts, and knitted together with recycled polyester for our polo shirts and the fleece fabric of our sweatshirts, hoodies and cardigans.",
        tags: ["100% Fairtrade organic cotton", "Recycled polyester blends"],
        photos: [{ src: knittingMachine, alt: "Fresh fabric coming off a circular knitting machine" }],
        color: "var(--color-sky)",
        marker: [768, 728],
        zoom: 2,
    },
    {
        title: "Dyeing Factory",
        place: "Tamil Nadu, India",
        body: "The fabric is coloured using planet-friendly dyes. The wastewater is cleaned and recycled using Reverse Osmosis (RO) plants.",
        tags: ["Planet-friendly dyes", "Recycled wastewater"],
        photos: [{ src: dyeingFabric, alt: "Rolls of finished fabric stacked on shelves in a factory" }],
        color: "var(--color-accent-light)",
        marker: [752, 852],
        zoom: 2,
    },
    {
        title: "CMT Factory",
        place: "Tamil Nadu, India",
        body: "'Cut, Make and Trim'. The finished, dyed fabric arrives in rolls and is cut into garment panels, stitched together, labelled using recycled cotton and packed in environmentally friendly packaging.",
        tags: ["Recycled cotton labels", "Eco-friendly packaging"],
        photos: [{ src: cmtStitching, alt: "Rows of workers sewing garments at their machines" }],
        color: "var(--color-accent)",
        marker: [790, 848],
        zoom: 2,
    },
];

export const finale = {
    title: "Off to School!",
    place: "Southampton, UK",
    body: "The finished uniforms are sent mainly by ship to KoolSkools in the UK, ready for pupils to wear.",
    tags: ["Shipped by sea"],
    color: "var(--color-green)",
};

/* Sea route for the boat, from the southern tip of India round to Southampton */
export const seaRoute = "M790 860 C770 905 640 890 575 790 S470 560 400 490 S260 345 198 296";
