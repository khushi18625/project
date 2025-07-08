if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { title } = require("process");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
exports.app = app;

async function main() {
  mongoose.connect(dbUrl);
}
main()
  .then((result) => {
    console.log("Connection is established");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.post("/listings/:id/category", async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  console.log(req.body.category);
  listing.category = req.body.category;
  await listing.save();
});

app.get("/listings/category/:category", async (req, res) => {
  const { category } = req.params;

  const allListings = await Listing.find({ category: category });
  if (allListings.length === 0) {
    req.flash("error", `No listings Found in ${category}`);
    return res.redirect("/listings");
  }
  res.render("listings/index", { allListings });
});

app.get("/listings/search", async (req, res) => {
  const { location } = req.query;
  try {
    const allListings = await Listing.find({
      location: { $regex: new RegExp(location, "i") },
    });
    // console.log(location);
    if (allListings.length === 0) {
      req.flash("error", `No listing found !!`);
      return res.redirect("/listings");
    }
    res.render("listings/index", { allListings });
  } catch (err) {
    console.log(err);
    res.send("Error Occurred");
  }
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found !!"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Page Not Found" } = err;
  res.status(statusCode).render("error.ejs", { err });
});
app.listen(8080, () => {
  console.log("Server is listing..");
});
