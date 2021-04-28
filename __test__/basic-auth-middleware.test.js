"use strict";

const supergoose = require("@code-fellows/supergoose");
const basic = require("../src/auth/middleware/basic-auth-middleware.js");
const Users = require("../src/auth/models/user.js");

let users = {
  admin: { username: "admin", password: "password" },
};
// Load database with fake users
beforeAll(async (done) => {
  await new Users(users.admin).save();
  done();
});

describe("Auth Middleware", () => {
  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();

  describe("user authentication", () => {
    it("fails a login for a user (admin) with the incorrect basic credentials", () => {
      // Change the request to match this test case
      req.headers = {
        authorization: "Basic YWRtaW46Zm9v",
      };

      return basic(req, res, next).then(() => {
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
      });
    }); // it()

    it("logs in an admin user with the right credentials", () => {
      // Change the request to match this test case
      req.headers = {
        authorization: "Basic YWRtaW46cGFzc3dvcmQ=",
      };

      return basic(req, res, next).then(() => {
        expect(next).toHaveBeenCalledWith();
      });
    }); // it()
  });
});
