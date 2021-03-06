var { User } = require('../../server/models/User');

var authenticate = function (req, res, next) {
    var token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if (user == null)
            return Promise.reject()
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(401).send();
    })
}

module.exports={
    authenticate
}