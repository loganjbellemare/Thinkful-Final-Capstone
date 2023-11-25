/**
 * Express API error handler.
 */
function errorHandler(error, request, response, next) {
  const { status = 500, message = "Something went wrong!" } = error;
  //debug delete later
  console.log("error", message);
  response.status(status).json({ error: message });
}

module.exports = errorHandler;
