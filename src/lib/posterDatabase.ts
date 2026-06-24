import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export type FeaturedPosterRow = {
  id: number;
  title: string;
  artist: string;
  tag: string;
};

type SeedPoster = FeaturedPosterRow;

const seedPosters: SeedPoster[] = [
  { id: 0, title: "Generative Typography", artist: "Lina Park", tag: "Typography" },
  { id: 1, title: "Procedural Systems", artist: "Mateo Ruiz", tag: "Systems" },
  { id: 2, title: "Creative Forms", artist: "Ava Chen", tag: "Creative Coding" },
  { id: 3, title: "Noise Garden", artist: "Seth Waters", tag: "Particles" },
  { id: 4, title: "Vector Bloom", artist: "Noah Kim", tag: "Geometry" },
  { id: 5, title: "Wave Atlas", artist: "Mina Sol", tag: "Motion" },
  { id: 6, title: "Ink Protocol", artist: "Julian Kim", tag: "Plotter" },
  { id: 7, title: "Soft Mesh", artist: "Anika Rao", tag: "Simulation" },
  { id: 8, title: "Video 25", artist: "Creative Coding", tag: "Video" },
  { id: 9, title: "Video 596", artist: "Creative Coding", tag: "Video" },
  { id: 10, title: "Video 741", artist: "Creative Coding", tag: "Video" },
  { id: 11, title: "Video 607(1)", artist: "Creative Coding", tag: "Video" },
  { id: 12, title: "Ava + Ben", artist: "Ava & Ben", tag: "Poster" },
  { id: 13, title: "Jiadai", artist: "Jiadai", tag: "Poster" },
  { id: 14, title: "Video 370", artist: "Creative Coding", tag: "Video" },
  { id: 15, title: "Video 17", artist: "Creative Coding", tag: "Video" },
  { id: 16, title: "Video 444", artist: "Creative Coding", tag: "Video" },
  { id: 17, title: "Holland", artist: "Holland", tag: "Portrait" },
  { id: 18, title: "Video 180", artist: "Creative Coding", tag: "Video" },
  { id: 19, title: "Kris", artist: "Kris", tag: "Poster" },
];

let database: DatabaseSync | null = null;

function getDatabasePath() {
  return process.env.SQLITE_PATH ?? path.join(process.cwd(), "data", "ccnyc.sqlite");
}

function openDatabase() {
  if (database) {
    return database;
  }

  const databasePath = getDatabasePath();
  mkdirSync(path.dirname(databasePath), { recursive: true });

  database = new DatabaseSync(databasePath);
  database.exec(`
    CREATE TABLE IF NOT EXISTS posters (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      tag TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const insertPoster = database.prepare(`
    INSERT INTO posters (id, title, artist, tag, is_active)
    VALUES (?, ?, ?, ?, 1)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      artist = excluded.artist,
      tag = excluded.tag,
      is_active = 1;
  `);

  seedPosters.forEach((poster) => {
    insertPoster.run(poster.id, poster.title, poster.artist, poster.tag);
  });

  return database;
}

function getWeekStart(date: Date) {
  const weekStart = new Date(date);
  const day = weekStart.getUTCDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  weekStart.setUTCDate(weekStart.getUTCDate() - daysSinceMonday);
  weekStart.setUTCHours(0, 0, 0, 0);

  return weekStart.toISOString().slice(0, 10);
}

export function getFeaturedPostersForWeek(date = new Date(), limit = 4) {
  const db = openDatabase();
  const featuredWeekStart = getWeekStart(date);

  const rows = db
    .prepare(
      `
      WITH active_posters AS (
        SELECT
          id,
          title,
          artist,
          tag,
          ROW_NUMBER() OVER (ORDER BY id) - 1 AS poster_index,
          COUNT(*) OVER () AS poster_count
        FROM posters
        WHERE is_active = 1
      ),
      weekly_pick AS (
        SELECT
          id,
          title,
          artist,
          tag,
          ((poster_index - (CAST((julianday(?) - julianday('2026-01-05')) / 7 AS INTEGER) * ?)) + poster_count) % poster_count AS display_order
        FROM active_posters
      )
      SELECT id, title, artist, tag
      FROM weekly_pick
      ORDER BY display_order
      LIMIT ?;
    `,
    )
    .all(featuredWeekStart, limit, limit) as FeaturedPosterRow[];

  if (rows.length === 0) {
    throw new Error("No active posters are available for this week.");
  }

  return {
    featuredWeekStart,
    posters: rows,
  };
}
