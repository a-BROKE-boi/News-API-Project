const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const commentsDB = require("../db/data/test-data/comments");

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
        expect(response.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  it("if given a request thats not a number, should return with status 400 and message", () => {
    return request(app)
      .get(`/api/articles/notID`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad Request");
      });
  });

  it("if given a request exceeding amount, should return with status 404", () => {
    return request(app)
      .get(`/api/articles/9999`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user found for article id: 9999");
      });
  });
});

describe("GET /api/articles", () => {
  it("should return an array of article objects and if its the expected shape and length", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(13);
        response.body.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(article.body).toBe(undefined);
        });
      });
  });
  it("if given a bad request it should return an error message", () => {
    return request(app)
      .get("/api/notArticle")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("should return an array of comments, check shape and length", () => {
    const articleId = 2;
    const arrayOfIdComments = commentsDB.filter(
      (comment) => comment.article_id == articleId
    );
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.comment)).toBe(true);
        expect(response.body.comment.length).toBe(arrayOfIdComments.length);
        response.body.comment.forEach((commentInArr) => {
          expect(typeof commentInArr.comment_id).toBe("number");
          expect(typeof commentInArr.body).toBe("string");
          expect(typeof commentInArr.article_id).toBe("number");
          expect(typeof commentInArr.author).toBe("string");
          expect(typeof commentInArr.votes).toBe("number");
          expect(typeof commentInArr.created_at).toBe("string");
        });
      });
  });
  it("checks if the array is in date order first being the most recent", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comment[0]).toEqual({
          article_id: 1,
          author: "icellusedkars",
          body: "I hate streaming noses",
          comment_id: 5,
          created_at: "2020-11-03T21:00:00.000Z",
          votes: 0,
        });
      });
  });
  it("should return an empty array empty array if article id is valid, but no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comment).toEqual([]);
      });
  });
  it("should return a 400 when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/notID/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad Request");
      });
  });
  it("passed a valid id type but not in DB return 404 status ", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("should accept a username and body and return the comment", () => {
    const userComment = { username: "butter_bridge", body: "this is chill" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(userComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment.body).toBe("this is chill");
        expect(typeof response.body.comment.votes).toBe("number");
        expect(response.body.comment.author).toBe("butter_bridge");
        expect(typeof response.body.comment.article_id).toBe("number");
        expect(typeof response.body.comment.created_at).toBe("string");
      });
  });
  it("when passed more than two keys 201 status and they dont get added to the table", () => {
    const userComment = {
      username: "butter_bridge",
      body: "this is chill",
      beans: "yummy",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(userComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment.body).toBe("this is chill");
        expect(typeof response.body.comment.votes).toBe("number");
        expect(response.body.comment.author).toBe("butter_bridge");
        expect(typeof response.body.comment.article_id).toBe("number");
        expect(typeof response.body.comment.created_at).toBe("string");
        expect(typeof response.body.comment.beans).toBe("undefined");
      });
  });
  it("when passed an invalid id should return 400 status ", () => {
    const userComment = { username: "butter_bridge", body: "this is chill" };
    return request(app)
      .post("/api/articles/notID/comments")
      .send(userComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad Request");
      });
  });
  it("passed a valid id type but id is not in DB return 404 status ", () => {
    const userComment = { username: "butter_bridge", body: "this is chill" };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(userComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path");
      });
  });
  it("when sending an object if any of the parameters are missing status 400 ", () => {
    const userComment = {};
    return request(app)
      .post("/api/articles/1/comments")
      .send(userComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad Request");
      });
  });
  it("passed a valid id type but username doesnt exist in database return 404 status ", () => {
    const userComment = {
      username: "notValidUsername",
      body: "this comment stinks",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(userComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username does not exist");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("updates the votes in a article by its id", () => {
    const newVote = 20;
    const articleVotesMod = { inc_votes: newVote };
    return request(app)
      .patch("/api/articles/1")
      .send(articleVotesMod)
      .expect(200)
      .then((response) => {
        expect(response.body.votes).toBe(100 + newVote);
      });
  });
  it("if given a request thats not a number, should return with status 400 and message", () => {
    const newVote = 20;
    const articleVotesMod = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/notID`)
      .send(articleVotesMod)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad Request");
      });
  });
  it("if given a request exceeding amount, should return with status 404", () => {
    const newVote = 20;
    const articleVotesMod = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/9999`)
      .send(articleVotesMod)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment found for article: 9999");
      });
  });
  it("if votes is not a number, should return with status 400 and message", () => {
    const newVote = "NotANumber";
    const articleVotesMod = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/3`)
      .send(articleVotesMod)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("when passed a comment id deletes that comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {});
  });
  it("400 Invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/notID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad Request");
      });
  });
  it("404 when article_id number that does not exist in db", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment for 9999");
      });
  });
});
