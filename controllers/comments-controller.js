const {
  fetchComments,
  insertComment,
  eraseComment,
} = require("../models/comments-model");

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

exports.postComment = (request, response, next) => {
  const body = request.body.body;
  const articleID = request.params.article_id;
  const username = request.body.username;
  insertComment(body, articleID, username)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  eraseComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};
