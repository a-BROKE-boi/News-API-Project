const { fetchComments } = require("../models/comments-model");

exports.getComments = (request, response, next) => {
  const { article_id } = request.params;
  fetchComments(article_id)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};
