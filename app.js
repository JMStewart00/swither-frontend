const express = require('express')
const app = express()

//app.get('/', function (req, res) {
//    res.send('Hello IPAM!')
//})
app.use(express.static(__dirname + '/'));

app.listen(8000, function() {
    console.log('Demo is listening on port 8000!')
})