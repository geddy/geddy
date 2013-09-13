init = (cb) ->
	# Add uncaught-exception handler in prod-like environments
	unless geddy.config.environment is "development"
		process.addListener "uncaughtException", (err) ->
		msg = err.message
		msg += "\n" + err.stack  if err.stack
		msg = JSON.stringify(err)  unless msg
		geddy.log.error msg
	cb()
	return

exports.init = init