// const Joi = require('joi');

// module.exports. listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     price: Joi.number().required().min(0),
//     location: Joi.string().required(),
//     country: Joi.string().required(),
//   //   image: Joi.object({
//   //     url: Joi.string().uri().required(),
//   //     filename: Joi.string().allow('', null)
//   //   }).required()
//   // }).required()
//   // image:
//   // Joi.string().uri().allow('').optional()
//   // }).required()
//   image:Joi.alternatives().try(
//     Joi.string().uri().allow('').optional(),
//     Joi.object({
//       url:Joi.string().uri().allow(''),
//       filename:Joi.string().allow('',null)
//     })
//   ).optional()
// })
// });

// module.exports.reviewSchema = Joi.object({
//     review : Joi.object({
//         rating:Joi.number().required().min(1).max(5),
//         comment :Joi.string().required()
//     }).required()
// })

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string().allow("", null),
    category: Joi.string().valid(
      "Trending",
      "Rooms",
      "Camping",
      "Farm",
      "Moutains",
      "Boats",
      "Dome",
      "Amazing Pool",
      "Artic",
      "Iconic Cities",
      "Castles"
    ),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
