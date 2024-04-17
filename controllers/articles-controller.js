const { fetchArticle } = require("../models/articles-model");

exports.getArticle = (request, response) => {
  const { article_id } = request.params;
  fetchArticle(article_id).then((article) => {
    response.status(200).send({ article });
  });
};
