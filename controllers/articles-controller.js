const { fetchArticle, fetchAllArticles } = require("../models/articles-model");

exports.getArticle = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticle(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAllArticles = (request, response, next) => {
  fetchAllArticles().then((allArticles) => {
    response.status(200).send(allArticles);
  });
};
