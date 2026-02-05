import express from "express";
import cors from "cors";
import accessoryRoute from "./routes/accessoryRoute.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors());

app.use("/api", accessoryRoute);

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
