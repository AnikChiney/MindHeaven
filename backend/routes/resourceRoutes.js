const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Resource = require("../models/Resource");

const router = express.Router();

/**
 * ✅ 1. Add new resource (Auth required)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, type, ageGroups, url } = req.body;

    if (!title || !type || !url) {
      return res.status(400).json({ message: "Title, type, and URL are required" });
    }

    const newResource = new Resource({
      title,
      description,
      type,
      ageGroups,
      url,
      uploadedBy: req.user.id
    });

    await newResource.save();
    res.status(201).json({ message: "Resource added successfully", resource: newResource });
  } catch (error) {
    console.error("Error adding resource:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ 2. Get all resources (Public)
 */
router.get("/", async (req, res) => {
  try {
    const { ageGroup, type } = req.query;
    let filter = {};

    if (ageGroup) {
      filter.ageGroups = ageGroup;
    }
    if (type) {
      filter.type = type;
    }

    const resources = await Resource.find(filter).populate("uploadedBy", "name email");
    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ 3. Get a single resource
 */
router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate("uploadedBy", "name email");
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  } catch (error) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ 4. Update a resource (Only uploader or admin)
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Resource updated successfully", resource: updatedResource });
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ 5. Delete a resource (Only uploader or admin)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await resource.deleteOne();
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;