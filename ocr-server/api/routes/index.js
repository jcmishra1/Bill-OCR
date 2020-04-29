const express = require("express");
const router = express.Router();
const multer = require("multer");

// Middleware
const FileMiddleware = require("../middlewares/FileMiddleware");
const FilterMiddleware = require("../middlewares/FilterMiddleware");

// Controllers
var BillController = require("../controllers/BillController.js");

router.get("/all", BillController.get_all_bill);

router.post(
  "/upload/:moduleName/:elementId",
  multer().any(),
  FileMiddleware.upload_file
);

module.exports = router;
