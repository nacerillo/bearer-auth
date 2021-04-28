"use strict";

const supergoose = require("@code-fellows/supergoose");
const auth = require("../src/auth/middleware/basic-auth-middleware.js");
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

      return auth(req, res, next).then(() => {
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
      });
    }); // it()

    it("logs in an admin user with the right credentials", () => {
      // Change the request to match this test case
      req.headers = {
        authorization: "Basic YWRtaW46cGFzc3dvcmQ=",
      };

      return auth(req, res, next).then(() => {
        expect(next).toHaveBeenCalledWith();
      });
    }); // it()
  });
});
// Pre-load our database with fake users
/*beforeAll(async (done) => {
  await new Users(users.admin).save();
  done();
});

describe("Auth Middleware", () => {
  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v

  describe("user authentication", () => {
    it("fails a login for a user (admin) with the incorrect basic credentials", () => {
      let req = {
        headers: {
          authorization: "Basic YWRtaW46Zm9v",
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth;

      return middleware(req, res, next).then(() => {
        expect(next).toHaveBeenCalledWith("Invalid Login");
      });
    }); // it()

    it("logs in an admin user with the right credentials", () => {
      let req = {
        headers: {
          authorization: "Basic YWRtaW46cGFzc3dvcmQ=",
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth;

      return middleware(req, res, next).then(() => {
        expect(next).toHaveBeenCalledWith();
      });
    }); // it()
  });
});*/
