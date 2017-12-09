var debug = require('debug')('busyapi:server:usages');
var shortid = require('shortid');
var fs = require('fs');
const dir = 'blob/'

module.exports = function(app){
    app.post('/api/usages', function(req, res){

        // Store the supplied usage data
        var payload = JSON.stringify(req.body);  //We don't need a try/catch here because the app object already catches invalid json
        var usageId = shortid.generate();
        //This version assumes that we need to wait for the operation to complete before sending the response (ie, if we need a database generated ID for the response content)
        //In real life, this would probably be a call to a database API.  However, a deaddrop to a folder is a valud solution.  There would be another job watching that folder and gobbling up the payloads.  The tradoff is that we don't get any direct acknowledgement that hte process is complete before sending the response.  Sometimes that's OK.
        try {
          fs.writeFile(dir + usageId, payload, (err) => {
            if (err) throw err;
            console.log('Stored usage count: ' + usageId);
            res.status(201).json({'id':usageId});
          });
        } catch (e) {
          res.status(400).send(e.message);
        }

        /*
        //Alternatively, this should be even faster on a single core since we don't even wait on the callback of the save event.  It potentially isn't viable, based on whether we need information back from the API
        try {
          app.outstream.write(usageId + '|' + payload + '\t');
          res.status(201).json({'id':usageId});
        } catch (e) {
          res.status(400).send(e.message);
        }

        */
    });
}
