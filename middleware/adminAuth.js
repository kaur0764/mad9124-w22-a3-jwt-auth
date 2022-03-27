import User from "../models/User.js";

export default async function (req, res, next) {
  const user = await User.findById(req.user._id);
  if (!user.isAdmin) {
    return res.status(401).json({
      errors: [
        {
          status: "403",
          title: "Forbidden",
          description: "You are not authorized to perform this operation!",
        },
      ],
    });
  } else {
    next();
  }
}
