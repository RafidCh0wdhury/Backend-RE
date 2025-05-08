const express = require('express');

const {
  uploadResource,
  getAllResources,
  getMyResources,
  deleteResource,
  addToList,
  getMyList,
  deleteFromList,
  fetchAllCounts,
} = require("../controllers/resource");

const router = express.Router();

router.get("/get-my-list/:userId", getMyList);
router.get("/my-resources/:userId", getMyResources);
router.get("/all-resources/:userId", getAllResources);
router.get("/resources-count/:id", fetchAllCounts);

router.post("/api/resource", uploadResource);
router.post("/add-to-list", addToList);

router.delete("/delete-resource/:resourceId", deleteResource);
router.delete("/delete-from-list/:resourceId", deleteFromList);

module.exports = router;
