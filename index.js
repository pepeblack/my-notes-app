const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');

const app = express();
app.use(express.static(__dirname + '/frontend'));

app.use(bodyParser.json());
const jwtSecret =  'aklsdjfklöasjdcma8sd90mcklasdföasdf$ädasöfü pi340qkrlöam,dflöäasf';

app.set("jwt-secret", jwtSecret); //secret should be in a config file - or better be a private key!
app.set("jwt-sign", {expiresIn: "1d", audience :"self", issuer : "pizza"});
app.set("jwt-validate", {secret: jwtSecret, audience :"self", issuer : "pizza"});

app.get("/", function(req, res){
    res.sendFile("index.html",  {root: __dirname + '/frontend/'});
});

app.use("/", require('./backend/routes/indexRoutes.js'));
app.use(jwt( app.get("jwt-validate"))); //after this middleware a token is required!
app.use("/notes", require('./backend/routes/noteRoutes.js'));


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('No token / Invalid token provided');
    }
    else
    {
        next(err);
    }
});

const hostname = '0.0.0.0';
const port = 8080;
app.listen(port, hostname, () => {  console.log(`Server running at http://${hostname}:${port}/`); });
