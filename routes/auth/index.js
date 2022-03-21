import authenticate from "../../middleware/auth.js";
import sanitizeBody from "../../middleware/sanitizeBody.js";
import User from "../../models/User.js";
import createDebug from "debug";
import express from "express";

const debug = createDebug("a3:routes:auth");
const router = express.Router();

router.post("/users", sanitizeBody, async (req, res) => {
  try {
    let newUser = new User(req.sanitizedBody);

    const itExists = Boolean(
      await User.countDocuments({ email: newUser.email })
    );
    if (itExists) {
      return res.status(400).json({
        errors: [
          {
            status: "400",
            title: "Validation Error",
            detail: `Email address '${newUser.email}' is already registered.`,
            source: { pointer: "/data/attributes/email" },
          },
        ],
      });
    }

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

router.post("/tokens", sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody;
  const user = await User.authenticate(email, password);

  if (!user) {
    return res.status(401).json({
      errors: [
        {
          status: "401",
          title: "Incorrect username or password.",
        },
      ],
    });
  }

  res
    .status(201)
    .json(
      formatResponseData({ accessToken: user.generateAuthToken() }, "tokens")
    );
});

router.get("/users/me", authenticate, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(formatResponseData(user));
});

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. 'cars'
 * @param {Object | Object[]} payload An array or instance object from that collection
 * @returns
 */
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
