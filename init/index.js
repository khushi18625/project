const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  mongoose.connect(mongo_url);
}
main()
  .then((result) => {
    console.log("Connection is established");
  })
  .catch((err) => {
    console.log(err);
  });
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "685fba965e68adde9797b386",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initalize");
};
initDB();
