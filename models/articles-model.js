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
  // the psql should be invalid if it cannot find the article id
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id=$2 RETURNING *;`,
      [votesNum, articleID]
    )
    .then(({ rows }) => {
      article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for article: ${articleID}`,
        });
      }
      return article;
    });
};
