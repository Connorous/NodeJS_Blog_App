const app = require("./app");
const request = require("supertest");
const supertest = require("supertest");
var assert = require("assert");

describe("my user test suite", () => {
  /*test("index route works", (done) => {
  request(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect({ name: "frodo" })
    .expect(200, done);
});*/

  test("testing login does not work if only email provided", (done) => {
    request(app).post("/login").send({ email: "testUser" }).expect(401, done);
  });

  test("testing login does not work if only email and password are empty", (done) => {
    request(app)
      .post("/login")
      .send({ email: "", password: "" })
      .expect(401, done);
  });

  test("testing login does not work if only email provided but password empty", (done) => {
    request(app)
      .post("/login")
      .send({ email: "testUser", password: "" })
      .expect(401, done);
  });

  /*test("testing can create user", (done) => {
    request(app)
      .post("/user")
      .send({
        email: "testUser2",
        password: "testpass2",
        confirmpassword: "testpass2",
      })
      .expect(200, done);
  });*/

  /*test("testing can delete user", (done) => {
    request(app)
      .post("/user/" + 9)
      .send({
        email: "testUser2",
        password: "testpass2",
        confirmpassword: "testpass2",
      })
      .expect(200, done);
  });*/

  test("testing can get user", (done) => {
    request(app)
      .get("/user/" + 10)
      .expect(200, done);
  });

  test("testing can login user", (done) => {
    request(app)
      .post("/login")
      .send({ email: "testUser2", password: "testpass2" })
      .expect(200, done);
  });

  test("testing can't get list of authors when not logged in'", (done) => {
    request(app).get("/authors").expect(401, done);
  });
});

describe("blog post test suit", () => {
  test("testing can't get blog posts of an author when not logged in'", (done) => {
    request(app)
      .get("/blogposts/:" + 1)
      .expect(401, done);
  });
});
