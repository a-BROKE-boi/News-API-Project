const db = require("../db/connection");
const testDB = require("../db/data/test-data/comments");

exports.fetchComments = (article_id) => {
  return db.query(`SELECT * FROM comments;`).then(({ rows }) => {
    if (rows.length < article_id) {
      return Promise.reject({
        status: 404,
        msg: "Invalid path",
      });
    } else {
      return db
        .query(
          `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC;`,
          [article_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    }
  });
};

exports.insertComment = (body, articleID, username) => {
  if (body === undefined || username === undefined) {
    return Promise.reject({
      status: 400,
      msg: "bad Request",
    });
  }
  return db.query(`SELECT * FROM comments;`).then(({ rows }) => {
    if (rows.length < articleID) {
      return Promise.reject({
        status: 404,
        msg: "Invalid path",
      });
    } else {
      return db
        .query(
          `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`,
          [body, articleID, username]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    }
  });
};

exports.eraseComment = (comment_id) => {
  if (testDB.length < comment_id) {
    return Promise.reject({
      status: 400,
      msg: `No comment for ${comment_id}`,
    });
  } else {
    return db.query(`DELETE FROM comments WHERE comment_id=$1 ;`, [comment_id]);
  }
};
