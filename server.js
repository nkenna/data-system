const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const MainRouter = require('./routes/mainRouter');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const fileUpload = require('express-fileupload');

app.use(fileUpload());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cstdapi_db', { useNewUrlParser: true })
.then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

//mongoose.connect('mongodb://nkenna:nkenna007@ds125673.mlab.com:25673/heroku_j02lqbhk');

var numExpectedSources = 2;
var store = new MongoDBStore(
  {
    uri: 'mongodb://localhost:27017/connect_mongodb_session',
    databaseName: 'connect_mongodb_session',
    collection: 'mySessions'
  },
  function(error) {
    // Should have gotten an error
  });

  store.on('connected', function() {
    store.client; // The underlying MongoClient object from the MongoDB driver
  });

  // Catch errors
store.on('error', function(error) {
  console.log(error)
});



const port = 3000;
//const port = process.env.PORT || 8000;

app.use(function(req, res, next)
{
   /* Allow access from any requesting client */
   res.setHeader('Access-Control-Allow-Origin', '*');

   /* Allow access for any of the following Http request types */
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');

   /* Set the Http request header */
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
});


app.use(session({
  key: 'admin',
  secret: 'cstd',
  resave: false,
  saveUninitialized: true,
  cookie: {
      expires: 60000000
  },
  store: store
}));



app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));





app.use('/api', MainRouter);

app.get('/', function (req, res) {
 res.sendFile(path.join(__dirname,'public', 'index.html'));
 });



app.listen(port, function(){
  console.log('Node js Express js Tutorial');
});