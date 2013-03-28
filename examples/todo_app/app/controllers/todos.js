
var Todos = function () {
  this.respondsWith = ['html', 'json', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;
    nails.model.Todo.all(function(err, todos){
      self.respond({params: params, todos: todos});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , todo = nails.model.Todo.create({
          title: params.title
        , status: 'open'
        });
    todo.save(function (err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      }
      else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;
    nails.model.Todo.first(params.id, function(err, todo){
      self.respond({params: params, todo: todo});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;
    nails.model.Todo.first(params.id, function(err, todo){
      self.respond({params: params, todo: todo});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;
    nails.model.Todo.first(params.id, function (err, todo) {
      todo.updateProperties(params);

      todo.save(function (err, data) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        }
        else {
          self.redirect({controller: self.name});
        }
      });
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;
    nails.model.Todo.remove(params.id, function(err){
      if (err) {
        params.errors = err;
        self.transfer('edit');
      }
      else {
        self.redirect({controller: self.name});
      }
    });
  }

};

exports.Todos = Todos;

