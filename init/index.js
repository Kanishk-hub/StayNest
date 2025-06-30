require("dotenv").config(); 
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../model/listing.js");

const ATLAS_URL = "mongodb+srv://kanishkvalorant100:Kanishk%40%23123@cluster0.pt0ph1b.mongodb.net/bnb?retryWrites=true&w=majority&appName=Cluster0";


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
  async function main() {
    await mongoose.connect(ATLAS_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=> ({...obj , owner:"68627ed8934c38f468a4a1e6"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();   