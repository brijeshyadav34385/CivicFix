import express from "express";
import Issue from "../models/Issue.js";
import { protect, adminOnly } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// @route POST /api/issues
// @desc  Report a new issue
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, longitude, latitude, address } = req.body;

    if (!title || !description || !longitude || !latitude) {
      return res.status(400).json({ message: "Title, description and location are required" });
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      reportedBy: req.user._id,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address,
      },
    });

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/issues
// @desc  Get all issues, optionally filtered by category/status,
//        or "near me" using lng/lat/radius (in km) via geospatial $near query
router.get("/", async (req, res) => {
  try {
    const { category, status, lng, lat, radius } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    if (lng && lat) {
      filter.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: (parseFloat(radius) || 5) * 1000, // km -> meters
        },
      };
    }

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/issues/analytics
// @desc  Aggregated stats for admin dashboard
router.get("/analytics", protect, adminOnly, async (req, res) => {
  try {
    const byCategory = await Issue.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const byStatus = await Issue.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const total = await Issue.countDocuments();

    res.json({ total, byCategory, byStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/issues/:id
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name")
      .populate("comments.user", "name");
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/issues/:id/upvote
router.put("/:id/upvote", protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const alreadyUpvoted = issue.upvotes.some(
      (u) => u.toString() === req.user._id.toString()
    );

    if (alreadyUpvoted) {
      issue.upvotes = issue.upvotes.filter(
        (u) => u.toString() !== req.user._id.toString()
      );
    } else {
      issue.upvotes.push(req.user._id);
    }

    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/issues/:id/comments
router.post("/:id/comments", protect, async (req, res) => {
  try {
    const { text } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.comments.push({ user: req.user._id, text });
    await issue.save();
    const populated = await issue.populate("comments.user", "name");
    res.status(201).json(populated.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/issues/:id/status
// @desc  Admin updates issue status
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route DELETE /api/issues/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const isOwner = issue.reportedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this issue" });
    }

    await issue.deleteOne();
    res.json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
