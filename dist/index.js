import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import spinRoutes from "./routes/spinRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import pityRoutes from "./routes/pityRoutes.js";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
// Serve static files from public directory
app.use(express.static('public'));
// API Routes
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/spin", spinRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/pity", pityRoutes);
// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Cassina API is running" });
});
app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
//# sourceMappingURL=index.js.map