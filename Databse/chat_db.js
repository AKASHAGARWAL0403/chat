var express = require("express");
var app = express();
var mysql = require("mysql");

var state = {
    pool  : ""
};

exports.connect = function(callback){
    var pool = mysql.createPool({
        host: 'http://139.59.92.12',
        user: 'akash_0403',
        password: 'Akash@0403',
        database: 'mydb'
    });
    state.pool = pool;
    callback();
}

exports.get = function(){
    return state.pool;
}
