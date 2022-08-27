const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { TOKEN_SECRET } = process.env;

describe("User Controller", () => {
  let request = supertest("localhost:3003");

  let token;
  let user_id;

  it("should create an user on POST /users", (done) => {
    const testUser = {
      name: "John Doe",
      email: "john@doe.com",
      password: "ifiwantitimmahaveit",
    };

    request
      .post("/users")
      .send(testUser)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        token = res.body.token;
        // @ts-ignore
        const { user } = jwt.verify(token, TOKEN_SECRET);
        user_id = user.id;

        done();
      });
  });

  it("should require an authorization on GET /users", (done) => {
    request.get("/users").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should require an authorization on GET /users/${id}", (done) => {
    request.get("/users/1").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should require an authorization on DELETE /users/${id}", (done) => {
    request.delete("/users/1").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should get the list of users on /users", (done) => {
    request
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        done();
      });
  });

  it("should get a single user on /users/${id}", (done) => {
    request
      .get(`/users/${user_id}`)
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        done();
      });
  });
});
