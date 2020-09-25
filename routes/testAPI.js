var express = require("express");
var router = express.Router();

var a = { name: "Akash", typeOfperson: "very stupid", age: "10" };
router.post("/", function (req, res, next) {
  console.log("came");
  res.send(a);
});

module.exports = router;
