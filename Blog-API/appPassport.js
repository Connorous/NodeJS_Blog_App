const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

//const bcrypt = require("bcryptjs");

const appPassport = new passport.Passport();

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

/*const strategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });
      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);*/

const jwtStrategy = new JwtStrategy(opts, async function (jwt_payload, done) {
  console.log("JWT payload", jwt_payload);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(jwt_payload.sub),
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    if (!user) {
      return done(null, false, { message: "Invalid token" });
    } else {
      return done(null, user);
    }
  } catch (err) {
    return done(err, false);
  }
});

//appPassport.use("local", strategy);

appPassport.use("jwt", jwtStrategy);

/*
appPassport.serializeUser((user, done) => {
  done(null, user.id);
});

appPassport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});
*/
module.exports = appPassport;
