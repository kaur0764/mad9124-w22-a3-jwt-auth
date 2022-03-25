import authenticate from "../../middleware/auth.js";
import Authentication_attempts from "../../models/Authentication_attempts.js";
import express from "express";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const authentication_attempts = await Authentication_attempts.find();
  res.json({
    data: authentication_attempts.map((authentication_attempt) =>
      formatResponseData(
        "authentication_attempts",
        authentication_attempt.toObject()
      )
    ),
  });
});

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. ' authentication_attempts'
 * @param {Object} resource An instance object from that collection
 * @returns
 */
function formatResponseData(type, resource) {
  const { _id, ...attributes } = resource;
  return { type, id: _id, attributes };
}

export default router;
