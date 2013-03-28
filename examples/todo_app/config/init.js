
// Add uncaught-exception handler in prod-like environments
if (nails.config.environment != 'development') {
  process.addListener('uncaughtException', function (err) {
    nails.log.error(JSON.stringify(err));
  });
}