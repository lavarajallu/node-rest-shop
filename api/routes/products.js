const express = require("express");
const router = express.Router();
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");
const ProductsController = require("../controllers/products");

//store the files in local here
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

//choose filetype here filterization
const fileFilter = (req, file, cb) => {
  //reject a file
  console.log(file);

  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//file uploaded max size, storage and filter of the file type
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

//GET all products
router.get("/", checkAuth, ProductsController.products_get_all);

// create Product with file or image like
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductsController.products_create_product
);

//GET Product by Id
router.get("/:productId", checkAuth, ProductsController.products_get_product);

//UPDATE or PATCH the Product
router.patch(
  "/:productId",
  checkAuth,
  ProductsController.products_update_product
);

//DELETE the Product
router.delete(
  "/:productId",
  checkAuth,
  ProductsController.products_delete_product
);

module.exports = router;
