import express from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/user.routes.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ status: "Server is up and running" });
});

app.use("/user", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
