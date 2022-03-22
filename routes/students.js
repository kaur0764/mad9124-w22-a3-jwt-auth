import authenticate from "../middleware/auth.js";
import sanitizeBody from "../middleware/sanitizeBody.js";
import Student from "../models/Student.js";
import express from "express";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const students = await Student.find();
  res.json({
    data: students.map((student) =>
      formatResponseData("students", student.toObject())
    ),
  });
});

router.post("/", sanitizeBody, authenticate, async (req, res) => {
  let newStudent = new Student(req.sanitizedBody);
  try {
    await newStudent.save();
    res
      .status(201)
      .json({ data: formatResponseData("students", newStudent.toObject()) });
  } catch (err) {
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

router.get("/:id", authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("students", student.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.patch("/:id", sanitizeBody, authenticate, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...req.sanitizedBody },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!student) throw new Error("Resource not found");
    res.json({ data: formatResponseData("students", student.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.put("/:id", sanitizeBody, authenticate, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...req.sanitizedBody },
      {
        new: true,
        overwrite: true,
        runValidators: true,
      }
    );
    if (!student) throw new Error("Resource not found");
    res.json({ data: formatResponseData("students", student.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const student = await Student.findByIdAndRemove(req.params.id);
    if (!student) throw new Error("Resource not found");
    res.send({ data: formatResponseData("students", student.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. 'students'
 * @param {Object} resource An instance object from that collection
 * @returns
 */
function formatResponseData(type, resource) {
  const { _id, ...attributes } = resource;
  return { type, id: _id, attributes };
}

function sendResourceNotFound(req, res) {
  res.status(404).send({
    errors: [
      {
        status: "404",
        title: "Resource does not exist",
        description: `We could not find a student with id: ${req.params.id}`,
      },
    ],
  });
}

export default router;
