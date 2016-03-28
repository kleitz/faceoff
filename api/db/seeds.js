var mongoose = require("mongoose");

var databaseURL = 'mongodb://localhost:27017/infamous-masterminds';
mongoose.connect(databaseURL);

var Criminal = require('../models/criminal');

var criminal1 = new Criminal({
  name: "Al Capone",
  location: "New York",
  status: "Dead"
});

criminal1.save();

var criminal2 = new Criminal({
  name: "Ronald Kray",
  location: "Hoxton",
  status: "Dead"
});

criminal2.save();

var criminal3 = new Criminal({
  name: "Charles Bronson",
  location: "Luton",
  status: "Alive"
});

criminal3.save();

var criminal4 = new Criminal({
  name: "Jordan Belfort",
  location: "Queens",
  status: "Alive"
});

criminal4.save();

var criminal5 = new Criminal({
  name: "Joseph Kony",
  location: "Uganda",
  status: "Unknown"
});

criminal5.save();

console.log("Successfully seeded data");
