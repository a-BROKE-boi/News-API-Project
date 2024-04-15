const { fetchTopics } = require("./model");

exports.getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};
