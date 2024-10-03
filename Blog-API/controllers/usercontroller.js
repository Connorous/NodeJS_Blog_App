const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const jsonwebtoken = require("jsonwebtoken");

exports.list_users = asyncHandler(async (req, res, next) => {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      dateCreated: true,
    },
  });
  if (users) {
    res.status(200).json({
      success: true,
      users: users,
    });
  } else {
    res.status(401).json({
      success: false,
      msg: "Unknown error getting users",
    });
  }
});

exports.list_authors = asyncHandler(async (req, res, next) => {
  const authors = await prisma.user.findMany({
    where: {
      author: true,
    },
    select: {
      id: true,
      email: true,
      dateCreated: true,
    },
  });
  if (authors) {
    res.status(200).json({
      success: true,
      authors: authors,
    });
  } else {
    res.status(401).json({
      success: false,
      msg: "Unknown error getting authors",
    });
  }
});

exports.get_user = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: {
      id: true,
      email: true,
      dateCreated: true,
      author: true,
    },
  });

  if (!user) {
    res.status(401).json({
      success: false,
      msg: "User with the details provided does not exist",
    });
  } else {
    res.status(200).json({
      success: true,
      user: user,
    });
  }
});

exports.login_user = asyncHandler(async (req, res, next) => {
  body("email", "Email must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape();
  body("password", "password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send("401").json({ msg: errors });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      author: true,
    },
  });

  if (!user) {
    res.status(401).json({
      success: false,
      msg: "User with the details provided does not exist",
    });
    return;
  } else {
    var match;
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      match = await bcrypt.compare(hashedPassword, user.password);
    });
    if (!match) {
      const payload = { sub: user.id, iat: Date.now() };
      const expiresIn = "1d";
      const secretorkey = process.env.SECRET;
      const signedToken = jsonwebtoken.sign(payload, secretorkey, {
        expiresIn: expiresIn,
      });
      const token = "Bearer " + signedToken;
      res.status(200).json({
        success: true,
        token: token,
        expiresIn: expiresIn,
        user: user,
      });
    } else {
      res.status(401).json({
        success: false,
        msg: "Incorrect password",
      });
    }
  }
});

exports.logout_user = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, token: null, expiresIn: null });
});

exports.post_user = [
  body("email", "Email must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmpassword", "confirm password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmpassword", "Both passwords must match").custom(
    (value, { req }) => {
      return value === req.body.password;
    }
  ),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).json({
        success: false,
        msg: errors,
      });
    } else {
      const emailExists = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
        select: {
          email: true,
        },
      });
      if (emailExists) {
        res.status(401).json({
          success: false,
          msg: "User with the details provided already exists",
        });
      } else {
        try {
          var password = req.body.password;
          bcrypt.hash(password, 10, async (err, hashedPassword) => {
            const newUser = await prisma.user.create({
              data: {
                email: req.body.email,
                password: hashedPassword,
                author: false,
              },
            });
            console.log(newUser);
            if (newUser) {
              res.status(200).json({
                success: true,
                msg: "User created successfully",
              });
            } else {
              res.status(401).json({
                success: true,
                msg: "User creation failed for unknown reassons",
              });
            }
          });
        } catch (err) {
          console.log(err);
          return next(err);
        }
      }
    }
  }),
];

exports.post_author = [
  body("email", "Email must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmpassword", "confirm password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmpassword", "Both passwords must match").custom(
    (value, { req }) => {
      return value === req.body.password;
    }
  ),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).json({
        success: false,
        msg: errors,
      });
    } else {
      const emailExists = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
        select: {
          email: true,
        },
      });
      if (emailExists) {
        res.status(401).json({
          success: false,
          msg: "User with the details provided already exists",
        });
      } else {
        try {
          var password = req.body.password;
          bcrypt.hash(password, 10, async (err, hashedPassword) => {
            const newUser = await prisma.user.create({
              data: {
                email: req.body.email,
                password: hashedPassword,
                author: true,
              },
            });
            if (newUser) {
              res.status(200).json({
                success: true,
                msg: "User created successfully",
              });
            } else {
              res.status(401).json({
                success: true,
                msg: "User creation failed for unknown reassons",
              });
            }
          });
        } catch (err) {
          console.log(err);
          return next(err);
        }
      }
    }
  }),
];

exports.put_user = asyncHandler(async (req, res, next) => {
  const userToUpdate = await prisma.user.update({
    where: {
      id: Number(req.params.id),
    },
    data: {
      author: Boolean(req.body.author),
    },
  });
  if (userToUpdate) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(401).json({
      success: false,
      msg: "Unknown error updating user",
    });
  }
});

exports.delete_user = asyncHandler(async (req, res, next) => {
  const userToDelete = await prisma.user.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  if (userToDelete) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(401).json({
      success: false,
      msg: "Unknown error deleting user",
    });
  }
});
