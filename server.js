const express = require('express')
const app = express()

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next()
}

app.use(allowCrossDomain)
app.use(express.static('.'))

app.listen(1338);
