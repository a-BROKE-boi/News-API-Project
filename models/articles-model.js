exports.fetchArticle = (article_id) => {
  const db = require("../db/connection");
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then((result) => {
      return result.rows;
    });
};
