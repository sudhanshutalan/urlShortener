import express from "express";
import db from "../db/index.js";
import { userTable } from "../models/index.js";
import { eq } from "drizzle-orm";
import { createHmac, randomBytes } from "crypto";
import { signupRouteRequestSchema } from "../validations/request.validation.js";

const router = express.Router();
// const app = express();

router.post("/signup", async (req, res) => {
  const validationResult = await signupRouteRequestSchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { firstName, lastName, email, password } = validationResult.data;

  const [existingUser] = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.email, email));

  if (existingUser) {
    return res
      .status(400)
      .json({ error: `user with email ${email} already exists` });
  }

  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [user] = await db
    .insert(userTable)
    .values({
      email,
      firstName,
      lastName,
      salt,
      password: hashedPassword,
    })
    .returning({ id: userTable.id });

  return res.status(201).json({
    success: true,
    message: "user created successfully",
    data: { userId: user.id },
  });
});

export default router;
