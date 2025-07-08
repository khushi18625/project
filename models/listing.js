// const express = require("express");
// const mongoose=require("mongoose");
// const Review=require("./review.js");
// const path = require("path");
// const { app } = require("../app");
// const Schema=mongoose.Schema;

// const listingSchema=new Schema({
//     title:{
//         type:String,
//         required:true,
//     },
//     description:String,
//     image:{
//         type:String,
//         default:"https://images.unsplash.com/photo-1651955881691-ebe36be1a450?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         set: (v)=>v === ""
//         ? "https://images.unsplash.com/photo-1651955881691-ebe36be1a450?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
//     },
//     price:Number,
//     location:String,
//     country:String,
//     reviews:[{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Review",
//     }]
// });

// listingSchema.post("findOneAndDelete",async(listing)=>{
//     if(listing){
//         await Review.deleteMany({_id:{$in:listing.reviews}});
//     };
// });

// const Listing=mongoose.model("Listing",listingSchema);
// module.exports=Listing;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  // image: {
  //     filename:{
  //         type: String,
  //         },
  //     url:{type:String,
  //         default:
  //           "https://pixabay.com/photos/coast-landscape-nature-ocean-sea-1867704/",
  //         set: (v) =>
  //           v === ""
  //             ? "https://pixabay.com/photos/coast-landscape-nature-ocean-sea-1867704/"
  //             : v,
  //       }},

  image: {
    url: String,
    filename: String,
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type: String,
    enum: [
      "Amazing Pool",
      "Artic",
      "Trending",
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pool",
      "Camping",
      "Farm ",
      "Dome",
      " Boats",
    ],
    required: true,
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
