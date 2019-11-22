const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // for generates hash key password
const jwt = require("jsonwebtoken"); //for generating JWT_TOKEN

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User email already exists!"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log("signup_details:", result);
                res.status(201).json({
                  message: "User created successfully!"
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_signin = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "User Authentication failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              password: user[0].password,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          var decoded = jwt.decode(token);
          return res.status(200).json({
            message: "User Authentication successful!",
            token: token,
            decoded: decoded
          });
        }
        return res.status(401).json({
          message: "User Authentication failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      console.log("deleteuser:", result);
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
