var debug = require('debug')('busyapi:server');

module.exports = function(app){
    app.post('/api/usages', function(req, res){

        // Store the supplied usage data
        app.usages.push(req.body);

        //This seems like a terribly inefficient way to calculate this...
        var usageId = app.usages.length;

        //Synchronous function
        debug(app.usages);
        console.log('Stored usage count: ' + usageId);

        res.status(201).json({'id':usageId});
    });
}
