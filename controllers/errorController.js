"use strict";

const httpStatus = require("http-status-codes");
//only invokes if an error obj is received
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack);
  next(error);
};
//only invokes no error obj is received
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  res.send(`${errorCode} | The page does not exist!`);
};
//only invokes if an error obj is received
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  console.log(`ERROR occurred: ${error.stack}`);
  res.status(errorCode);
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
};
