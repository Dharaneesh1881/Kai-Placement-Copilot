require("dotenv").config();
const express = require("express");
const bcrypt = require('bcrypt');
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const z = require("zod");
const userModel = require("./db");
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI);
const { JWT_SECRET } = require('./auth');
const { auth } = require('./auth');
const app = express();


app.use(express.json());
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
  })
);
app.use(require("cookie-parser")());



app.post("/signup", async function (req, res) {
  const requiredbody = z.object({
    name: z.string().min(3, "Name too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be 6 characters")
  });

  const parsedDatawithSuccess = requiredbody.safeParse(req.body);

  if (!parsedDatawithSuccess.success) {
    res.status(400).json({
      message: parsedDatawithSuccess.error.issues.map((e) => e.message).join(", ")
    });
    return;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  let error = false;
  try {
    const hashedpassword = await bcrypt.hash(password, 5);

    await userModel.create({
      name: name,
      email: email,
      password: hashedpassword

    });
  }
  catch (e) {
    console.error(e);
    error = true;
    res.status(409).json({
      message: "user already exists"
    });
  }
  if (!error) {
    res.json({
      message: "User signed up"
    });
  }

});

app.post("/login", async function (req, res) {
  const requiredbody = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be 6 characters")
  });

  const parsedDatawithSuccess = requiredbody.safeParse(req.body);

  if (!parsedDatawithSuccess.success) {
    res.status(400).json({
      message: parsedDatawithSuccess.error.issues.map((e) => e.message).join(", ")
    });
    return;
  }

  const email = req.body.email;
  const password = req.body.password;

  const user = await userModel.findOne({
    email: email
  });

  if (!user) {
    res.status(403).json({
      message: "user does not exist"
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    const token = jwt.sign({
      id: user._id
    }, JWT_SECRET);

    const isProduction = (process.env.CORS_ORIGINS || "").includes("https");
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax"
    });

    if (user.profile_url == undefined) {
      user.profile_url = "https://res.cloudinary.com/dbqdx1m4t/image/upload/v1771181818/profile_pics/nwirmfxg3fi59tqnxyyj.jpg",
        await user.save();
    }

    res.json({
      message: "Login success",
      token: token,
      name: user.name,
      profile_url: user.profile_url
    });

  }
  else {
    res.status(403).json({
      message: "incorrect cretentials"
    });
    return;
  }

});

app.post("/google-login", async function (req, res) {
  const { credential, clientId } = req.body;
  if (!credential) {
    return res.status(400).json({ message: "Google credential missing" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: clientId || process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await userModel.findOne({ email });

    if (!user) {
      // Create user if they don't exist
      try {
        const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 5);
        user = await userModel.create({
          name: name,
          email: email,
          profile_url: picture,
          password: randomPassword
        });
      } catch (err) {
        // Fallback in case the name is already taken
        if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
          const randomSuffix = Math.floor(Math.random() * 10000).toString();
          const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 5);
          user = await userModel.create({
            name: name + "_" + randomSuffix,
            email: email,
            profile_url: picture,
            password: randomPassword
          });
        } else {
          throw err;
        }
      }
    } else {
      // Update profile picture if missing
      if (!user.profile_url || user.profile_url === "https://res.cloudinary.com/dbqdx1m4t/image/upload/v1771181818/profile_pics/nwirmfxg3fi59tqnxyyj.jpg") {
        user.profile_url = picture;
        await user.save();
      }
    }

    const token = jwt.sign({
      id: user._id
    }, JWT_SECRET);

    const isProduction = (process.env.CORS_ORIGINS || "").includes("https");
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax"
    });

    res.json({
      message: "Google Login success",
      token: token,
      name: user.name,
      profile_url: user.profile_url || picture
    });

  } catch (error) {
    console.error("Google verify error:", error);
    res.status(403).json({ message: "Invalid Google credential" });
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
