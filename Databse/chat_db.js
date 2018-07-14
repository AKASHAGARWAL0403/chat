var express = require("express");
var app = express();
var mysql = require("mysql");

var state = {
    pool  : ""
};

exports.connect = function(callback){
    var pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mydb'
    });
    state.pool = pool;
    callback();
}

exports.get = function(){
    return state.pool;
}
