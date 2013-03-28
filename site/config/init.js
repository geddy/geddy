
// Add uncaught-exception handler in prod-like environments
if (nails.config.environment != 'development') {
  process.addListener('uncaughtException', function (err) {
    var msg = err.message;
    if (err.stack) {
      msg += '\n' + err.stack;
    }
    if (!msg) {
      msg = JSON.stringify(err);
    }
    nails.log.error(msg);
  });
}

