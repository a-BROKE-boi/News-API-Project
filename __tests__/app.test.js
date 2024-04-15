const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("app.js", () => {
  it("status 404, responds with error message when passed a bad path", () => {
    return request(app)
      .get("/api/notPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path");
      });
  });
});

describe("GET /api/topics", () => {
  it("should respond with an array of topic objects, with the these properties. slug. description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});
