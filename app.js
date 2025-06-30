if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");



const listingRouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");

app.set("views" , path.join(__dirname,"views"));
app.set("view engine" , "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const ATLAS_URL = process.env.ATLAS_URL;
async function main() {
    await mongoose.connect(ATLAS_URL);
}

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

const store = MongoStore.create({
  mongoUrl: ATLAS_URL,
  crypto: {
    secret: process.env.secret
  },
  touchAfter: 24 * 3600,
});

const sessionOption = {
  store,
  secret: process.env.secret,
  resave: false,
  saveUninitialized: true,
  cookie:{
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
  },
};

// app.get("/",(req,res)=>{
//    res.send("api is working");
// });


app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demoUser",async(req,res)=>{
//     let fakeUser = new User({
//       email: "student@gmail.com",
//       username: "User1"
//     });
//    let registeredUser = await User.register(fakeUser,"helloworld");
//    res.send(registeredUser); 
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter); 
app.use("/",userRouter);

app.all('/{*any}',(req,res,next)=>{
  next(new ExpressError(404 , "Page Not Found"));
});

app.use((err,req,res,next)=>{
  let {statusCode =500 , message = "Something Went Wrong!"} = err;
  res.status(statusCode).render("listings/error.ejs" , {message});
  //res.status(statusCode).send(message);
});

app.listen(3000,()=>{
  console.log("sever is running on port : 3000.");
});

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description: "By the Beach",
//         price:1200,
//         location: "Goa",
//         country: "India",
//     })

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful.");
// });