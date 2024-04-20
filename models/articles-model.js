const db = require("../db/connection");

exports.fetchArticle = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No user found for article id: ${article_id}`,
        });
      } else {
        return article;
      }
    });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT title, topic, author, created_at, article_img_url, votes FROM articles ORDER BY created_at DESC ;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.updateArticle = (votesNum, articleID) => {
  // we need to update the table with a new vote number we need the
  // new vote number to be added onto the old
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id=$2 RETURNING *;`,
      [votesNum, articleID]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
