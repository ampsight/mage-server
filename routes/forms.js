module.exports = function(app, security) {
  var Form = require('../models/form')
    , access = require('../access');

  var p***REMOVED***port = security.authentication.p***REMOVED***port
    , authenticationStrategy = security.authentication.authenticationStrategy;

  app.all('/api/forms*', p***REMOVED***port.authenticate(authenticationStrategy));

  var validateFormParams = function(req, res, next) {
    var form = req.body;
    req.newForm = form;
    next();
  }

  // TODO when we switch to events we need to change all the *_LAYER roles
  // to *_EVENT roles

  // get all form
  app.get(
    '/api/forms',
    access.authorize('READ_LAYER'),
    function (req, res) {
      Form.getAll(function (err, forms) {
        res.json(forms);
      });
    }
  );

  // get form
  app.get(
    '/api/forms/:formId',
    access.authorize('READ_LAYER'),
    function (req, res) {
      res.json(req.form);
    }
  );

  // Create a new form
  app.post(
    '/api/forms',
    access.authorize('CREATE_LAYER'),
    validateFormParams,
    function(req, res) {
      Form.create(req.newForm, function(err, form) {
        if (err) {
          return res.send(400, err);
        }

        res.json(form);
      });
    }
  );

  // Update a form
  app.put(
    '/api/forms/:formId',
    access.authorize('UPDATE_LAYER'),
    validateFormParams,
    function(req, res) {
      Form.update(req.form.id, req.newForm, function(err, form) {
        if (err) {
          return res.send(400, err);
        } 

        res.json(form);
      });
    }
  );

  // Delete a form
  app.delete(
    '/api/forms/:id',
    access.authorize('DELETE_LAYER'),
    function(req, res) {
      Form.remove(req.param('id'), function(err) {
        if (err) return res.send(400, "Could not delete form");

        res.send(204);
      });
    }
  );
}
