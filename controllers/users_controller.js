const mongooseUser = require('../model/users_model.js');
const utils = require('../utils/util.js');
const jwt = require('jwt-simple');
const cfg = require('../config.js');

module.exports.findAllUsers = (req,res) => {
    mongooseUser.findAllUsers(function (err, data) {
        res.status(err?404:200).json({
            error: err,
            data: data
        });
    });
}

module.exports.register = ({body: {user_name = null, password = null}}, res) => {
    if(utils.isEmpty(user_name))
        res.status(401).json({
            error: null,
            data: "Username is Null"
        });
    else if(utils.isEmpty(password))
        res.status(401).json({
            error: null,
            data: "password is Null"
        });
    else
    {
        mongooseUser.register(user_name,password,function(err,data){
            res.status(err?500:201).json({
                error: err,
                data: data
            });
        })
    }

}

module.exports.findUser = (req,res) => {
    mongooseUser.findUser(req.params.id,(err,data) => {
        res.status(err ?
            400 :
            data ?
                202 :
                404).json({'error':err, 'data': data});
    });
}

module.exports.login = (req,res) => {
    var username = req.body.user_name;
    var password = req.body.password;
    if(utils.isEmpty(username))
        res.status(401).json({
            error: null,
            data: "Username is Null"
        });
    else if(utils.isEmpty(password))
        res.status(401).json({
            error: null,
            data: "Password is Null"
        });
    else
    {
        //check cache here
        mongooseUser.findUserWithCreds(username,password,(err,doc) => {
            if (err || !doc)
                return res.status(404).json({
                    error: null,
                    data: 'User name and Password combination does not exist'
                });
            var payload = {id: doc._id};
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.status(200).json({token});
        });
    }
}