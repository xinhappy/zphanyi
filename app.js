var express = require('express')
var app = express()
// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

// app.get('/auth/:id/:password', function (req, res) {
//     res.send({ id: req.params.id, name: req.params.password });
// });

app.use(express.static('www'))
var server = app.listen(3500, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(' app listening at http://%s:%s', host, port);
});