const mongoose = require("mongoose");

const Product = require("../models/product");

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id productImage created_at")
    .sort({ price: 1 }) // sort by price asc order
    .limit(1000) //uptp displaying the products length....
    .exec()
    .then(docs => {
      console.log("docs get all products", docs);
      const response = {
        total_count: docs.length,
        message: "success",
        products: docs.map(res => {
          return {
            _id: res.id,
            name: res.name,
            price: res.price,
            productImage: res.productImage,
            created_at: res.created_at,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + res._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_create_product = (req, res, next) => {
  console.log("file storage:", req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then(result => {
      console.log("result of product: ", result);
      res.status(201).json({
        message: "Created product successfully!",
        createdProduct: {
          _id: result.id,
          name: result.name,
          price: result.price,
          created_at: result.created_at,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price productImage _id")
    .exec()
    .then(response => {
      console.log("response", response);
      if (response) {
        res.status(200).json({
          product: response,
          url: "http://localhost:3000/products"
        });
      } else {
        res
          .status(404)
          .json({ message: "No Valid entry found for provided Id" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product Updated successfully!",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted successfully!",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
