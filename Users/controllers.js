var db = require("./../Databse/chat_db");

var findUser = function(args , callback){
    if( args.username && args.password )
    {
        var query = "SELECT * FROM userdata WHERE username = '"+args.username+"' AND password= '"+args.password+"'";
        db.get().query(query , function(err,response){
            if(err){
                callback(null,{success : false , message : "cannot get the data from the databse"});
            } else {
                if(response.length == 0)
                callback(null,{success : false , message : "Invalid details"});
                else
                callback(null, {success : true , result  : response});
            }
        })
    }
    else {
        callback(null,{success : false , message  : "missing parameters"});
    }
}
exports.findUser = findUser;

var hasDuplicate = function(args,callback){
    if(args){
        var query = "SELECT * FROM userdata WHERE username = '"+args+"'";
        db.get().query(query , function(err,response){
            if(err){
                callback(new Error("UNKNOWN ERROR") , true);
            } else {
                console.log(response);
                if(response.length != 0) {
                    callback(null , true);
                }
                else{
                    callback(null , false);
                }
            }
        })
    }
    else{
        callback(new Error("MISSING PARAMS") , true);
    }
}

exports.create = function(args, callback){
    var username = args.username;
    var password = args.password;
    if(username && password) {
        hasDuplicate(username,function(err, res){
            if(err){
                if(err.message == "MISSING PARAMS"){
                    callback(null , {success:false , message : err.message})
                }
                else{
                    callback(null , {success : false , message : err.message});
                }
            }
            else{
                if(res){
                    callback(null , {success : false , message : "USERNAME EXISTS"})
                } else{
                    var query = "INSERT INTO userdata (username , password) VALUES ?";
                    var value = [
                        [username , password]
                    ];
                    db.get().query(query , [value] , function(err,response){
                        if(err){
                            console.log(err);
                            console.log(response);
                            callback(null , {success : false , message : "UNKNOWN ERROR"});
                        }
                        else{
                            if(response.affectedRows === 1) {
                                findUser(args , function(err,res){
                                    if(!res.success) {
                                        callback(null , {success : false , message : "UNKNOWN ERROR"});
                                    } else {
                                        callback(null , {success:true , result : res});
                                    } 
                                })
                            }
                        }
                    })
                }
            }
        })
    } else {
        callback(null , {success : false , message : "MISSING PARAMS"});
    }
}
