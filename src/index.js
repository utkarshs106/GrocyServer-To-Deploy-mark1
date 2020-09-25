var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://rko:rkorko@cluster0.ztfun.gcp.mongodb.net/people",
  { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }
);
const peopleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: Number, unique: true, required: true },
  password: { type: String, required: true },
  ShopList: []
});

const ShopSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  shopItems: [{ itemName: String, itemPrice: Number }],
  shopAddress: {
    type: String
  },
  shopType: {
    type: String
  },
  shopZip: {
    type: Number
  },
  shopOwner: {
    type: String
  },
  shopPhone: {
    type: Number
  }
});
const ImageSchema = new mongoose.Schema({
  imageData: String
});
const Image = mongoose.model("Image", ImageSchema);

const People = mongoose.model("People", peopleSchema);
const Shop = mongoose.model("Shop", ShopSchema);

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.post("/testAPI", function (req, res) {
  var a = { name: "Akash", typeOfperson: "very stupid", age: "10" };
  console.log(req.body);
  console.log("entered");
  res.send(JSON.stringify(a));
});
app.post("/addImage", function (req, res) {
  console.log(req);
});

app.get("/", function (req, res) {
  res.send("hellow");
});

app.get("/home", function (req, res) {
  console.log("home reached");
  var ab = { name: "Rahul" };
  res.send(JSON.stringify(ab));
});

app.post("/login", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  People.find({ email: email, password: password }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/change", function (req, res) {
  console.log(req);
});
app.post("/register", function (req, res) {
  const user = new People({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password
  });
  user.save(function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(JSON.stringify(result));
    }
  });
});

app.post("/goToShopList", function (req, res) {
  var email = req.body.email;
  People.find({ email: email }, function (err, result) {
    if (err) {
      console.log("err" + err);
    }
    if (result) {
      res.send(result[0].ShopList);
    }
  });
});

app.post("/addShop", function (req, res) {
  var email = req.body.email;
  console.log("request came");
  const shop = new Shop({
    shopName: req.body.shop,
    shopType: req.body.typeofshop,
    shopPhone: req.body.phoneOfShop,
    shopOwner: req.body.ownerOfShop,
    shopAddress: req.body.addressofShop,
    shopZip: req.body.zipOfShop
  });
  shop.save(function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      People.update(
        { email: email },
        { $push: { ShopList: { $each: [result._id] } } },
        function (err, sucess) {
          if (err) {
            console.log(err);
          }
          if (sucess) {
            console.log(sucess);
          }
        }
      );

      res.send({ id: result._id });
    }
  });
});
app.post("/addItemToShop", function (req, res) {
  var itemName = req.body.itemName;
  var itemPrice = req.body.itemPrice;
  var _id = req.body.shopId;

  var shopItem = { itemName: itemName, itemPrice: itemPrice };

  Shop.updateOne({ _id: _id }, { $push: { shopItems: shopItem } }, function (
    err,
    result
  ) {
    if (err) {
      console.log("err" + err);
      res.send(err);
    }
    if (result) {
      console.log("result" + result);
      res.send(result);
    }
  });
});
app.post("/retrieveItemListFromShopList", function (req, res) {
  Shop.find({ _id: req.body.shopid }, { shopItems: 1 }, function (err, result) {
    if (err) {
      console.log("err" + err);
    }
    if (result) {
      console.log("result" + result);
      res.send(result);
    }
  });
});

app.post("/deleteItemsFromShop", function (req, res) {
  var itemId = req.body.itemId;
  var shopId = req.body.shopId;

  Shop.updateOne(
    { _id: shopId },
    { $pull: { shopItems: { _id: itemId } } },
    function (err, result) {
      console.log("err" + err);
      console.log("result" + result);
    }
  );
});

app.post("/deleteItemsFromShops", function (req, res) {
  var shopId = req.body.shopId;
  var deleteArray = req.body.deleteArray;

  Shop.updateMany(
    { _id: shopId },
    { $pull: { shopItems: { _id: deleteArray } } },
    function (err, result) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (result) {
        console.log(result);
        res.send("sucess");
      }
    }
  );
});

app.post("/updateItemsFromShops", function (req, res) {
  Shop.update(
    { _id: req.body.shopId, "shopItems._id": req.body.itemId },
    {
      $set: {
        "shopItems.$.itemName": req.body.newItemName,
        "shopItems.$.itemPrice": req.body.newItemPrice
      }
    },
    function (err, result) {
      if (err) throw err;
      if (result) {
        console.log(result);
      }
    }
  );
});

app.listen(3000, function () {
  console.log("server listning at port sucessfuly");
});
