const cool = require('cool-ascii-faces');
const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/cool', function(request, response) {
  response.send(cool());
});


app.use(express.static(__dirname + '/'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});