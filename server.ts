import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initDb, db } from "./src/lib/db";
import { users, progress } from "./src/lib/schema";
import { eq, and } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  initDb();

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get user profile
  app.get("/api/user", async (req, res) => {
    try {
      const email = "rajakodingg@gmail.com";
      let user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        const result = await db.insert(users).values({
          email,
          name: "Raja Koding",
        }).returning();
        user = result[0];
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Get progress
  app.get("/api/progress", async (req, res) => {
    try {
      const email = "rajakodingg@gmail.com";
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) return res.json([]);

      const userProgress = await db.query.progress.findMany({
        where: eq(progress.userId, user.id),
      });

      res.json(userProgress);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Update progress
  app.post("/api/progress", async (req, res) => {
    try {
      const { algorithm, levelReached, completionPercentage, stars } = req.body;
      const email = "rajakodingg@gmail.com";
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      const existing = await db.query.progress.findFirst({
        where: and(
          eq(progress.userId, user.id),
          eq(progress.algorithm, algorithm)
        ),
      });

      if (existing) {
        await db.update(progress)
          .set({
            levelReached: Math.max(existing.levelReached || 1, levelReached),
            completionPercentage: Math.max(existing.completionPercentage || 0, completionPercentage),
            stars: Math.max(existing.stars || 0, stars),
          })
          .where(eq(progress.id, existing.id));
      } else {
        await db.insert(progress).values({
          userId: user.id,
          algorithm,
          levelReached,
          completionPercentage,
          stars,
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
