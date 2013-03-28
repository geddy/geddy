# Add uncaught-exception handler in prod-like environments
if nails.config.environment != 'development'
  process.addListener 'uncaughtException', (err) ->
    nails.log.error JSON.stringify(err)
