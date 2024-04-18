//all your doing is grabbing the article id info from the request and getting it from comments simple
const db = require("../db/connection");

exports.fetchComments = (article_id) => {
  return db
    .query(`SELECT * FROM comments ORDER BY created_at DESC;`)
    .then(({ rows }) => {
      const filterdComments = rows.filter(
        (comment) => comment.article_id == article_id
      );
      return filterdComments;
    });
};
