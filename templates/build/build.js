window.nails = {}

// require model
nails.model = require('model');

// mix utilities into nails
var utilities = require('utilities');
utilities.mixin(nails, utilities);

// require socket.io-client
nails.io = require('socket.io-client');
nails.socket = nails.io.connect('/');

nails.io.listenForModelEvents = function (model) {
  var events = [
    'save'
  , 'update'
  , 'remove'
  ];

  for (var e in events) {
    (function (event) {
      nails.socket.on(model.modelName + ':' + event, function (data) {
        var instance;
        if (typeof data != 'string') {
          instance = model.create(data);
        }
        else {
         instance = data;
        }
        if (nails.debug == true) {
          console.log(event, instance);
        }
        model.emit(event, instance);
      });
    })(events[e]);
  };
}

nails.io.addListenersForModels = function (models) {
  for (var i in models) {
    (function (model) {
      nails.io.listenForModelEvents(model);
    })(nails.model[models[i]]);
  }
}



