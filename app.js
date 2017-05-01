// Module Dependencies
const express = require('express');

// Initalizes the express 'app' variable
const app = express();

// Attaches the routes to the 'app'.
const routes = require('./routes/index');
app.use('/', routes);

// Catches 404 and forwards to error handlers
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {

    // sends the error in json
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

// Exports all app settings 
module.exports = app;
