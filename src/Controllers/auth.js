const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


// Register User Callback
const SIGNUP = async (req, res) => {
  const { email, password } = req.body;

  if (!sanityCheck(email, password)) return res.status(400).json({ error: "Email or password input is invalid" });

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ error: "User already exists" });

    const hashed_password = await bcrypt.hash(password, 10);

    user = new User({
      email,
      password: hashed_password,
      images: []
    });

    await user.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};


// Login User Callback
const LOGIN = async (req, res) => {
  const { email, password } = req.body;

  if (!sanityCheck(email, password)) return res.status(400).json({ error: "Email or password input is invalid" });

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        images: user.images
      },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};


// JWT Middleware Verifier
const VerifyJWT = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const jwtToken = req.headers.authorization;
      const verify = jwt.verify(jwtToken, process.env.JWT_SECRET);

      req.token = verify;
      next();
    } else return res.status(401).json({ message: "Unauthorized; invalid JWT." });
  } catch (err) {
    return res.status(400).json({ message: "Something went wrong." });
  }
}


// Parameter Sanity Check Middleware
const sanityCheck = (email, password) => {  
  if (!email || !password || email.length <= 1 || password.length <= 1 || !email.includes('@')) return false;
  
  return true;
}

module.exports = { SIGNUP, LOGIN, VerifyJWT };
