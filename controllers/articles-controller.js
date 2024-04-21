const { request, response } = require("../app");
const {
  fetchArticle,
  fetchAllArticles,
  updateArticle,
} = require("../models/articles-model");

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
  fetchAllArticles()
    .then((allArticles) => {
      response.status(200).send(allArticles);
    })
    .catch(next);
};

exports.patchArticle = (request, response, next) => {
  const votesNum = request.body.inc_votes;
  const articleID = request.params.article_id;
  updateArticle(votesNum, articleID)
    .then((updatedArticle) => {
      response.status(200).send(updatedArticle);
    })
    .catch(next);
};
