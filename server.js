//server.js

//call the packages we need

var express = require('express'); // call express
var app = express();        //define our app using express
var bodyParser = require('body-parser')
var mongoose   = require('mongoose');

//mongoose.connect('mongodb://admin:admin@ds027749.mongolab.com:27749/abuja-meetup'); // connect to our database
mongoose.connect('mongodb://127.0.0.1:27017/eclinic'); // connect to our database

var Member = require('./app/models/member');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to Abuja Tech Meetup API' });
});

// more routes for our API will happen here
// REGISTER OUR ROUTES -------------------------------
// on routes that end in /members
// ----------------------------------------------------
router.route('/members')

    // create a member (accessed at POST http://localhost:8080/api/members)
    .post(function(req, res) {

        var member = new Member();      // create a new instance of the Member model
        member.name = req.body.name;  // set the members name (comes from the request)
        member.expertise = req.body.expertise;  // set the members expertise (comes from the request)

        // save the bear and check for errors
        member.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'A member was created!' });
        });

    })

    // get all the members (accessed at GET http://localhost:8080/api/members)
   .get(function(req, res) {
       Member.find(function(err, members) {
           if (err)
               res.send(err);

           res.json(members);
       });
   });

   // on routes that end in /members/:member_id
// ----------------------------------------------------

router.route('/members/:member_id')

    // get the member with that id (accessed at GET http://localhost:8080/api/members/:member_id)
    .get(function(req, res) {
        Member.findById(req.params.member_id, function(err, member) {
            if (err)
                res.send(err);
            res.json(member);
        });
    })

    .put(function(req, res) {

        // use our member model to find the member we want
        Member.findById(req.params.member_id, function(err, member) {

            if (err)
                res.send(err);

            member.name = req.body.name;  // update the members info

            // save the member
            member.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Member updated!' });
            });

        });
    })

    // delete the member with this id (accessed at DELETE http://localhost:8080/api/member/:member_id)
    .delete(function(req, res) {
        Member.remove({
            _id: req.params.member_id
        }, function(err, member) {
            if (err)
                res.send(err);

            res.json({ message: 'Member was Successfully deleted' });
        });
    });



// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Tech Meetup API is running on ' + port);
