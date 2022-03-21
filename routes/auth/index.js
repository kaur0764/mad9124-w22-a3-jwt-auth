import sanitizeBody from "../../middleware/sanitizeBody.js";
import User from "../../models/User.js";
import createDebug from "debug";
import express from "express";

const debug = createDebug("a3:routes:auth");
const router = express.Router();

router.post("/users", sanitizeBody, async (req, res) => {
  try {
    let newUser = new User(req.sanitizedBody);
    await newUser.save();
    res.status(201).json(formatResponseData(newUser));
  } catch (err) {
    debug("Error saving new user: ", err.message);
    res.status(500).send({
      errors: [
        {
          status: "500",
          title: "Server error",
          description: "Problem saving document to the database.",
        },
      ],
    });
  }
});

function formatResponseData(payload, type = "users") {
  if (payload instanceof Array) {
    return { data: payload.map((resource) => format(resource)) };
  } else {
    return { data: format(payload) };
  }

  function format(resource) {
    const { _id, ...attributes } = resource.toJSON
      ? resource.toJSON()
      : resource;
    return { type, id: _id, attributes };
  }
}

export default router;
