const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 80;

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/react", "index.html"));
});

var server = app.listen(port, function () {
  var port = server.address().port;

  console.log('Server is working : PORT - ' + port);
});
