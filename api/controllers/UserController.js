/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Passwords = require('machinepack-passwords');
var EmailAddresses = require('machinepack-emailaddresses');

module.exports = {
  create: function createFn(req, res) {
    if (_.isUndefined(req.param('email'))) {
      return res.badRequest('An email address is required!');
    }

    if (_.isUndefined(req.param('password'))) {
      return res.badRequest('A password is required!');
    }

    if (req.param('password').length < 6) {
      return res.badRequest('Password must be at least 6 characters!');
    }

    EmailAddresses.validate({
      string: req.param('email'),
    }).exec({
      error: function (err) {
        return res.serverError(err);
      },

      invalid: function () {
        return res.badRequest('Does not look like an email address to me!');
      },

      success: function () {
        Passwords.encryptPassword({
          password: req.param('password'),
        }).exec({
          error: function (err) {
            return res.serverError(err);
          },

          success: function (result) {
            var body = {
              email: req.param('email'),
              encryptedPassword: result
            };

            User.create(body)
              .exec(function (err, createdUser) {
                if (err) {
                  if (err.invalidAttributes
                    && err.invalidAttributes.email
                    && err.invalidAttributes.email[0]
                    && err.invalidAttributes.email[0].rule === 'unique') {
                    return res.alreadyInUse(err);
                  }

                  res.serverError(err);
                }

                req.session.user = createdUser.id;

                return res.ok(createdUser);
              });
          },
        });
      },
    });
  },

  login: function loginFn(req, res) {
    if (_.isUndefined(req.param('email'))) {
      return res.badRequest('An email address is required!');
    }

    if (_.isUndefined(req.param('password'))) {
      return res.badRequest('A password is required!');
    }

    User.findOne({ email: req.param('email') }
      , function foundUser(err, user) {
        if (err) return res.negotiate(err);
        if (!user) return res.notFound();

        Passwords.checkPassword({
          passwordAttempt: req.param('password'),
          encryptedPassword: user.encryptedPassword
        }).exec({
          error: function (err) {
            return res.negotiate(err);
          },

          incorrect: function () {
            return res.forbidden('Incorrect password');
          },

          success: function () {
            req.session.user = user.id;

            return res.ok(user);
          }
        });
      });
  },
  logout: function (req, res) {
    // log the user-agent out.
    req.session.user = null;

    return res.ok();
  },
  delete: function (req, res) {

    User.update({
      id: req.session.user.id
    }, {
        deleted: true
      }, function (err, removedUser) {

        if (err) return res.negotiate(err);
        if (removedUser.length === 0) {
          return res.notFound();
        }

        req.session.user = null;
        return res.ok();
      });
  },

  update: function (req, res) {
    User.update(req.session.user, req.body)
      .exec(function (err, user) {
        if (err) return res.negotiate(err);

        if (user.length === 0) {
          return res.notFound();
        }

        return res.json(user);
      });
  },

  find: function findFn(req, res) {
    User.find({
      id: req.session.user
    })
      .populate('todoItems')
      .exec(function (err, user) {
        if (err) return res.negotiate(err);

        if (user.length === 0) {
          return res.notFound();
        }

        return res.ok(user);
      });
  },
  findOne: function findOneFn(req, res) {
    User.findOne({
      id: req.session.user
    })
      .populate('todoItems')
      .exec(function (err, user) {
        if (err) return res.negotiate(err);

        if (!user) {
          return res.notFound();
        }

        return res.ok(user);
      });
  },

  userIdentity: function (req, res) {
    if (req.session.user) {
      return res.ok(req.session.user.toString());
    } else {
      return res.forbidden("Not Logged In");
    }
  },
};

