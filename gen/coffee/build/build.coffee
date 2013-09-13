window.geddy = {}

# require model
geddy.model = require("model")

# mix utilities into geddy
utilities = require("utilities")
utilities.mixin geddy, utilities

# require socket.io-client
geddy.io = require("socket.io-client")
geddy.socket = geddy.io.connect("/")
geddy.io.listenForModelEvents = (model) ->
	events = ["save", "update", "remove"]
	for e of events
		((event) ->
			geddy.socket.on model.modelName + ":" + event, (data) ->
				instance = undefined
				unless typeof data is "string"
					instance = model.create(data)
				else
					instance = data
		    console.log event, instance  if geddy.debug is true
		    model.emit event, instance
		) events[e]

geddy.io.addListenersForModels = (models) ->
	for i of models
		((model) ->
			geddy.io.listenForModelEvents model
		) geddy.model[models[i]]