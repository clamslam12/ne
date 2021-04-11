"use strict";

const httpStatus = require("http-status-codes");

module.exports = {
  //if a middleware uses next(error), 
  //logErrors and respondInternalError will be invoked in the order they were used in main.js 
  //(in this case, logErrors first, then ,respondInternalError last)
  logErrors: (error, req, res, next) => {
    console.error(error.stack);
    next(error);
  },
  respondNoResourceFound: (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.send(`${errorCode} | The page does not exist!`);
  },
  respondInternalError: (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`ERROR occurred: ${error.stack}`);
    res.status(errorCode);
    res.send(
      `${errorCode} | Sorry, our application is experiencing a problem!`
    );
  },
};
