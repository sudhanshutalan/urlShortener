import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  return res.json({ status: "Server is up and running" });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
