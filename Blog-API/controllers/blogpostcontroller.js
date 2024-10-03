const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.list_blogposts = asyncHandler(async (req, res, next) => {
  const blogposts = await prisma.blogpost.findMany({
    where: {
      ownerId: Number(req.params.id),
      published: true,
    },
    select: {
      id: true,
      dateCreated: true,
      title: true,
      content: true,
      owner: true,
      ownerId: true,
      comments: true,
    },
    orderBy: {
      dateCreated: "desc",
    },
  });
  if (blogposts) {
    for (var i = 0; i < blogposts.length; i++) {
      for (var j = 0; j < blogposts[i].comments.length; j++) {
        var commentAuthor = await prisma.user.findUnique({
          where: {
            id: Number(blogposts[i].comments[j].ownerId),
          },
          select: {
            email: true,
          },
        });

        blogposts[i].comments[j].author = commentAuthor.email;
      }
    }
    res.status(200).json({
      success: true,
      blogposts: blogposts,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting blog posts",
    });
  }
});

exports.list_blogposts_published = asyncHandler(async (req, res, next) => {
  const blogposts = await prisma.blogpost.findMany({
    where: {
      ownerId: Number(req.params.id),
    },
    select: {
      id: true,
      dateCreated: true,
      title: true,
      content: true,
      owner: true,
      ownerId: true,
      comments: true,
      published: true,
    },
    orderBy: {
      dateCreated: "desc",
    },
  });
  if (blogposts) {
    for (var i = 0; i < blogposts.length; i++) {
      for (var j = 0; j < blogposts[i].comments.length; j++) {
        var commentAuthor = await prisma.user.findUnique({
          where: {
            id: Number(blogposts[i].comments[j].ownerId),
          },
          select: {
            email: true,
          },
        });

        blogposts[i].comments[j].author = commentAuthor.email;
      }
    }
    res.status(200).json({
      success: true,
      blogposts: blogposts,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting blog posts",
    });
  }
});

exports.get_blogpost = asyncHandler(async (req, res, next) => {
  const blogpost = await prisma.blogpost.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: {
      id: true,
      dateCreated: true,
      title: true,
      content: true,
      owner: true,
      ownerId: true,
      comments: true,
      published: true,
    },
  });
  if (blogpost) {
    res.send({
      success: true,
      blogpost: blogpost,
    });
    res.status(200).json({
      success: true,
      blogpost: blogpost,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting blog post",
    });
  }
});

exports.post_blogpost = [
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("content", "content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        msg: "Blogpost provided was invalid",
      });
    } else {
      const blogpostExists = await prisma.blogpost.findFirst({
        where: {
          title: req.body.title,
          ownerId: Number(req.body.ownerId),
        },
        select: {
          title: true,
          content: true,
        },
      });

      if (blogpostExists) {
        res.status(400).json({
          success: false,
          msg: "You already have a blogpost with the title provided",
        });
      } else {
        const newBlogPost = await prisma.blogpost.create({
          data: {
            title: req.body.title,
            content: req.body.content,
            ownerId: req.body.ownerId,
            published: Boolean(req.body.publish),
          },
        });
        if (newBlogPost) {
          res.status(200).json({
            success: true,
            msg: "Blog post created successfully",
          });
        } else {
          res.status(400).json({
            success: false,
            msg: "Blog post creation failed for unknown reassons",
          });
        }
      }
    }
  }),
];

exports.put_blogpost = asyncHandler(async (req, res, next) => {
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape();
  body("content", "content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      msg: "Blogpost information provided was invalid",
    });
  } else {
    const blogpostToUpdate = await prisma.blogpost.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    });
    if (blogpostToUpdate) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(0).json({
        success: false,
        msg: "Unknown error updating blog post",
      });
    }
  }
});

exports.put_blogpost_publish = asyncHandler(async (req, res, next) => {
  const blogpostToUpdate = await prisma.blogpost.update({
    where: {
      id: Number(req.params.id),
    },
    data: {
      published: Boolean(req.body.published),
    },
  });
  if (blogpostToUpdate) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(0).json({
      success: false,
      msg: "Unknown error updating blog post",
    });
  }
});

exports.delete_blogpost = asyncHandler(async (req, res, next) => {
  const blogpostToDelete = await prisma.blogpost.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });
  if (blogpostToDelete) {
    const deleteComments = await prisma.comment.deleteMany({
      where: {
        blogpostId: Number(blogpostToDelete.id),
      },
    });
    const deleteBlogpost = await prisma.blogpost.delete({
      where: {
        id: Number(blogpostToDelete.id),
      },
    });
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Blog post to be deleted could not be found",
    });
  }
});

exports.post_comment = [
  body("content", "content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        msg: "Comment provided was invalid",
      });
    } else {
      const newComment = await prisma.comment.create({
        data: {
          content: req.body.content,
          blogpostId: req.body.blogpostId,
          ownerId: req.body.ownerId,
        },
      });
      if (newComment) {
        res.status(200).json({
          success: true,
          msg: "Comment created successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          msg: "Comment creation failed for unknown reassons",
        });
      }
    }
  }),
];

exports.put_comment = asyncHandler(async (req, res, next) => {
  body("content", "content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      msg: "Comment information provided was invalid",
    });
  } else {
    const commentToUpdate = await prisma.comment.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        content: req.body.content,
      },
    });
    if (commentToUpdate) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Unknown error updating comment",
      });
    }
  }
});

exports.delete_comment = asyncHandler(async (req, res, next) => {
  const commentToDelete = await prisma.comment.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  if (commentToDelete) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error deleting comment",
    });
  }
});

exports.delete_comments = asyncHandler(async (req, res, next) => {
  const commentsToDelete = await prisma.comment.deleteMany({
    where: {
      blogpostId: Number(req.params.id),
    },
  });
  if (commentsToDelete) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error deleting comments",
    });
  }
});
