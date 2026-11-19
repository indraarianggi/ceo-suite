/**
 * The listing map (`/images/spaces/listing-map.webp`, 881x1571) is a Figma
 * screenshot with ten grey door pins baked into the bitmap. Those pins are the
 * only locations the image can show, so each space is assigned one of these
 * slots (x/y as % of the image, measured at each pin's circle centre). The map
 * draws a highlighted pin on the slots of the spaces in the current results.
 *
 * MOCK: a real API would return coordinates and a real map would replace the
 * image. Every city shares this one (South Jakarta) base map for now.
 */
export const mapPinSlots = [
  { x: 51.9, y: 12.9 },
  { x: 28.4, y: 9.5 },
  { x: 23.9, y: 25.0 },
  { x: 42.6, y: 32.3 },
  { x: 68.9, y: 26.2 },
  { x: 42.6, y: 41.9 },
  { x: 27.4, y: 43.8 },
  { x: 34.6, y: 52.1 },
  { x: 71.5, y: 51.7 },
  { x: 35.3, y: 74.5 },
] as const;

export const listingMap = {
  src: "/images/spaces/listing-map.webp",
  width: 881,
  height: 1571,
  alt: "Map of South Jakarta with a pin for each available workspace",
} as const;
