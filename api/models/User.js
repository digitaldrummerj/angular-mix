/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    email: {
      required: true,
      unique: true,
      type: 'string'
    },
    encryptedPassword: {
      required: true,
      type: 'string'
    },
    todoItems: {
      collection: 'todo',
      via: 'user',
    },
    toJSON: function () {
      var obj = this.toObject();
      delete obj.encryptedPassword;
      delete obj.password;
      return obj;
    }
  }
};

