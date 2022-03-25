import authenticate from "../../middleware/auth.js";
import Authentication_attempts from "../../models/Authentication_attempts.js";
import express from "express";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const authentication_attempts = await Authentication_attempts.find();
  res.json({ data: authentication_attempts });
});

export default router;
