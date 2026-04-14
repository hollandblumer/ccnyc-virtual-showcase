export type PosterRecord = {
  id: number;
  title: string;
  artist: string;
  tag: string;
  palette: [string, string, string, string];
  imageUrl: string;
};

export const posters: PosterRecord[] = [
  {
    id: 0,
    title: "Generative Typography",
    artist: "Lina Park",
    tag: "Typography",
    palette: ["#111111", "#e65b4f", "#f4d35e", "#f6f1e8"],
    imageUrl: "https://picsum.photos/seed/ccnyc-home-1/720/960",
  },
  {
    id: 1,
    title: "Procedural Systems",
    artist: "Mateo Ruiz",
    tag: "Systems",
    palette: ["#315cbb", "#f18f6b", "#f6eadf", "#1f2d3a"],
    imageUrl: "https://picsum.photos/seed/ccnyc-home-2/720/960",
  },
  {
    id: 2,
    title: "Creative Forms",
    artist: "Ava Chen",
    tag: "Creative Coding",
    palette: ["#181818", "#dbd6cb", "#7e8aa2", "#f09153"],
    imageUrl: "https://picsum.photos/seed/ccnyc-home-3/720/960",
  },
  {
    id: 3,
    title: "Noise Garden",
    artist: "Seth Waters",
    tag: "Particles",
    palette: ["#1d3f32", "#ead9a3", "#f5974a", "#f4efe7"],
    imageUrl: "https://picsum.photos/seed/ccnyc-home-4/720/960",
  },
  {
    id: 4,
    title: "Vector Bloom",
    artist: "Noah Kim",
    tag: "Geometry",
    palette: ["#f4efe7", "#0e0e0e", "#cd3c31", "#d8df15"],
    imageUrl: "https://picsum.photos/seed/ccnyc-home-5/720/960",
  },
  {
    id: 5,
    title: "Wave Atlas",
    artist: "Mina Sol",
    tag: "Motion",
    palette: ["#3140b9", "#f07fa6", "#f7d7a5", "#f4efe7"],
    imageUrl: "https://picsum.photos/seed/ccnyc-home-6/720/960",
  },
  {
    id: 6,
    title: "Ink Protocol",
    artist: "Julian Kim",
    tag: "Plotter",
    palette: ["#0f0f0f", "#ffffff", "#e5ddd1", "#9f8d7a"],
    imageUrl: "https://picsum.photos/seed/ccnyc-home-7/720/960",
  },
  {
    id: 7,
    title: "Soft Mesh",
    artist: "Anika Rao",
    tag: "Simulation",
    palette: ["#2f5a7d", "#f4efe7", "#d67f6c", "#16212b"],
    imageUrl: "https://picsum.photos/seed/ccnyc-home-8/720/960",
  },
];

export const artistDots = [
  "https://picsum.photos/seed/ccnyc-artist-1/80/80",
  "https://picsum.photos/seed/ccnyc-artist-2/80/80",
  "https://picsum.photos/seed/ccnyc-artist-3/80/80",
  "https://picsum.photos/seed/ccnyc-artist-4/80/80",
  "https://picsum.photos/seed/ccnyc-artist-5/80/80",
];
