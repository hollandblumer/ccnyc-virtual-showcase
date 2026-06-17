import video607 from "../../assets/posters/Video-607(1).png";
import video370 from "../../assets/posters/Video-370.png";
import video17 from "../../assets/posters/Video-17.png";
import video444 from "../../assets/posters/Video-444.png";
import video180 from "../../assets/posters/Video-180.png";
import posterAvaBen from "../../assets/posters/poster-2026-03-10-ava-ben.png";
import posterJiadai from "../../assets/posters/poster-2025-11-04-jiadai.png";
import hollandPoster from "../../assets/posters/holland.jpeg";
import posterKris from "../../assets/posters/2026-03-31-kris.png";

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
    imageUrl: new URL(
      "../../assets/posters/poster-2024-11-26-2.png",
      import.meta.url,
    ).href,
  },
  {
    id: 1,
    title: "Procedural Systems",
    artist: "Mateo Ruiz",
    tag: "Systems",
    palette: ["#315cbb", "#f18f6b", "#f6eadf", "#1f2d3a"],
    imageUrl: new URL(
      "../../assets/posters/poster-2025-11-18-kezia.png",
      import.meta.url,
    ).href,
  },
  {
    id: 2,
    title: "Creative Forms",
    artist: "Ava Chen",
    tag: "Creative Coding",
    palette: ["#181818", "#dbd6cb", "#7e8aa2", "#f09153"],
    imageUrl: new URL(
      "../../assets/posters/poster-2025-11-25-jake.png",
      import.meta.url,
    ).href,
  },
  {
    id: 3,
    title: "Noise Garden",
    artist: "Seth Waters",
    tag: "Particles",
    palette: ["#1d3f32", "#ead9a3", "#f5974a", "#f4efe7"],
    imageUrl: new URL(
      "../../assets/posters/poster-2025-12-16-marcos.png",
      import.meta.url,
    ).href,
  },
  {
    id: 4,
    title: "Vector Bloom",
    artist: "Noah Kim",
    tag: "Geometry",
    palette: ["#f4efe7", "#0e0e0e", "#cd3c31", "#d8df15"],
    imageUrl: new URL(
      "../../assets/posters/poster-2026-01-13-sai.png",
      import.meta.url,
    ).href,
  },
  {
    id: 5,
    title: "Wave Atlas",
    artist: "Mina Sol",
    tag: "Motion",
    palette: ["#3140b9", "#f07fa6", "#f7d7a5", "#f4efe7"],
    imageUrl: new URL(
      "../../assets/posters/poster-2026-01-27-kezia.png",
      import.meta.url,
    ).href,
  },
  {
    id: 6,
    title: "Ink Protocol",
    artist: "Julian Kim",
    tag: "Plotter",
    palette: ["#0f0f0f", "#ffffff", "#e5ddd1", "#9f8d7a"],
    imageUrl: new URL(
      "../../assets/posters/poster-2026-02-24-russell.png",
      import.meta.url,
    ).href,
  },
  {
    id: 7,
    title: "Soft Mesh",
    artist: "Anika Rao",
    tag: "Simulation",
    palette: ["#2f5a7d", "#f4efe7", "#d67f6c", "#16212b"],
    imageUrl: new URL(
      "../../assets/posters/poster-2026-03-03-ligea.png",
      import.meta.url,
    ).href,
  },
  {
    id: 8,
    title: "Video 25",
    artist: "Creative Coding",
    tag: "Video",
    palette: ["#111111", "#f2b63c", "#f5e6d2", "#4a95e2"],
    imageUrl: new URL("../../assets/posters/Video-25.png", import.meta.url)
      .href,
  },
  {
    id: 9,
    title: "Video 596",
    artist: "Creative Coding",
    tag: "Video",
    palette: ["#0c1624", "#c9d9ff", "#7f91ff", "#edf3ff"],
    imageUrl: new URL("../../assets/posters/Video-596.png", import.meta.url)
      .href,
  },
  {
    id: 10,
    title: "Video 741",
    artist: "Creative Coding",
    tag: "Video",
    palette: ["#101722", "#b4d1ff", "#78a3ff", "#ebf2ff"],
    imageUrl: new URL("../../assets/posters/Video-741.png", import.meta.url)
      .href,
  },
  {
    id: 11,
    title: "Video 607(1)",
    artist: "Creative Coding",
    tag: "Video",
    palette: ["#122030", "#91b4ff", "#5c8cff", "#e9f2ff"],
    imageUrl: video607.src,
  },
  {
    id: 12,
    title: "Ava + Ben",
    artist: "Ava & Ben",
    tag: "Poster",
    palette: ["#1c2433", "#ffe1c2", "#afb4ff", "#d7e7ff"],
    imageUrl: posterAvaBen.src,
  },
  {
    id: 13,
    title: "Jiadai",
    artist: "Jiadai",
    tag: "Poster",
    palette: ["#0f1c2f", "#fce7d8", "#7e8aff", "#cbd7ff"],
    imageUrl: posterJiadai.src,
  },
  {
    id: 14,
    title: "Video 370",
    artist: "Creative Coding",
    tag: "Video",
    palette: ["#101f31", "#bbe1ff", "#8ab7ff", "#f1f8ff"],
    imageUrl: video370.src,
  },
  {
    id: 15,
    title: "Video 17",
    artist: "Creative Coding",
    tag: "Video",
    palette: ["#0e1621", "#c8d9ff", "#8db2ff", "#e7f2ff"],
    imageUrl: video17.src,
  },
  {
    id: 16,
    title: "Video 444",
    artist: "Creative Coding",
    tag: "Video",
    palette: ["#1b2230", "#f7e7d8", "#aab6d8", "#dcdff5"],
    imageUrl: video444.src,
  },
  {
    id: 18,
    title: "Video 180",
    artist: "Creative Coding",
    tag: "Video",
    palette: ["#171b27", "#dfe7ff", "#90afff", "#f7f7ff"],
    imageUrl: video180.src,
  },
  {
    id: 17,
    title: "Holland",
    artist: "Holland",
    tag: "Portrait",
    palette: ["#1b2230", "#f7e7d8", "#aab6d8", "#dcdff5"],
    imageUrl: hollandPoster.src,
  },
  {
    id: 17,
    title: "Kris",
    artist: "Kris",
    tag: "Poster",
    palette: ["#1c2738", "#f6e9dc", "#98b5ff", "#d7e8ff"],
    imageUrl: posterKris.src,
  },
];

export const artistDots = [
  "https://picsum.photos/seed/ccnyc-artist-1/80/80",
  "https://picsum.photos/seed/ccnyc-artist-2/80/80",
  "https://picsum.photos/seed/ccnyc-artist-3/80/80",
  "https://picsum.photos/seed/ccnyc-artist-4/80/80",
  "https://picsum.photos/seed/ccnyc-artist-5/80/80",
];
