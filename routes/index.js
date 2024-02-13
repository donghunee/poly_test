var express = require("express");
var router = express.Router();
const locationModel = require("../model/location");

/* GET home page. */

router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

module.exports = router;
