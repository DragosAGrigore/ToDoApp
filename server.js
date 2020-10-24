let mongodb = require('mongodb');
let express = require('express');
let sanitizeHTML = require('sanitize-html');

let app = express();

const ITEMS_KEY = "items";
let db;

let port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(passwordProtected);

// function passwordProtected(req, res, next) {
//   res.set("WWW-Authenticate", "Basic realm='ToDo app'");
//   if (req.headers.authorization === "Basic YWRtaW46YWRtaW4=") {
//     next();
//   } else {
//     res.status(401).send("Forbidden.");
//   }
// }

let connectionString = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ray9g.mongodb.net/ToDoApp`;
mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
  db = client.db();
  app.listen(port);
});

app.get('/', function(req, res) {
  db.collection(ITEMS_KEY).find().toArray(function (err, items) {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">

        </ul>
      </div>
      <script>
          let items = ${JSON.stringify(items)}
      </script>
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
    </body>
    </html>`);
  });
});

app.post("/create-item", function(req, res) {
  let cleanText = sanitizeHTML(req.body.item);
  db.collection(ITEMS_KEY).insertOne({ text: cleanText }, function(err, doc) {
    res.json(doc.ops[0]);
  });
});

app.post("/update-item", function(req, res) {
  let cleanText = sanitizeHTML(req.body.text);
  db.collection(ITEMS_KEY).findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.id) }, { $set: { text: cleanText } }, function(err, doc) {
    res.send("Success");
  });
});

app.post("/delete-item", function(req, res) {
  db.collection(ITEMS_KEY).deleteOne({ _id: mongodb.ObjectId(req.body.id)}, function(err, doc) {
    res.send("Success");
  });
});