/**
 * TodoController
 *
 * @description :: Server-side logic for managing Todoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function createFn(req, res) {
    var body = req.body;
    body.user = req.session.user;

    return Todo.create(body)
      .then(result => res.ok(result))
      .catch(error => res.serverError(error));
  },
  find: function findFn(req, res) {
    return Todo.find({ user: req.session.user })
      .populate('user')
      .then(result => res.ok(result))
      .catch(error => res.serverError(error));
  },
  findOne: function findOneFn(req, res) {
    var id = req.param('id');
    if (id === undefined) {
      return res.badRequest('id is required');
    }

    return Todo.findOne({ id: id, user: req.session.user })
      .populate('user')
      .then(result => res.ok(result))
      .catch(error => res.serverError(error));
  },
  update: function updateFn(req, res) {
    var id = req.param('id');
    if (id === undefined) {
      return res.badRequest('id is required');
    }

    var user = req.session.user;
    var body = req.body;
    body.user = user;

    return Todo.update({ id: id, user: user }, body)
      .then(result => res.ok(result))
      .catch(error => res.serverError(error));

  },
  delete: function deleteFn(req, res) {
    var id = req.param('id');
    if (id === undefined) {
      return res.badRequest('id is required');
    }

    return Todo.delete({ id: id, user: req.session.user })
      .then(result => res.ok(result))
      .catch(error => res.serverError(error));
  }
};

