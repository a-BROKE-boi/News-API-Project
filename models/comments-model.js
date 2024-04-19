const db = require("../db/connection");
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
          `SELECT * FROM comments WHERE article_id = ${article_id} ORDER BY created_at DESC;`
        )
        .then(({ rows }) => {
          return rows;
        });
    }
  });
};

exports.insertComment = (body, articleID, username) => {
  return db
    .query(
      `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`,
      [body, articleID, username]
    )
    .then(({ rows }) => {
      console.log(rows[0]);
      return rows[0];
    });
};
