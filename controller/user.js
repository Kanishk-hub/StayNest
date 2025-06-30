const User = require("../model/user.js");

module.exports.renderSignUp = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.userSignUp = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.logIn(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to BNB");
            res.redirect("/listings");
        } );
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
   
};

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.userLogin = async (req,res)=>{
    req.flash("success","Welcome back to BNB!");
    const redirectUrl =  res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.userLogOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    })
};