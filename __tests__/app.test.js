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
  it("check if its the expected shape and length", () => {
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

describe("GET /api", () => {
  describe("should return a json file list of all the tables avalable in the db", () => {
    it("check length and if each key has a description of file", () => {
      const testJson = require("../endpoints.json");
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(testJson);
        });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("should return 200 and be equal to article 1", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual([
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        ]);
      });
  });

  // Check for the specific values expected for the requested article where applicable.
  // E.g. Given a request to GET /api/articles/1, for article_id on the response we would expect the value of 1 rather than .any(Number).
  //  Status 400: Bad request, invalid article_id
  // it("if given a bad request should return with status 400", () => {
  //   return request(app).get("/api/articles/notNumber").expect(400);
  // });

  // Responds with error object including status and message.
  // E.g. GET /api/articles/notanumber
  //  Status 404: Not found, article_id does not exist

  // Responds with error object including status and message.
  // E.g. GET /api/articles/9999
});
