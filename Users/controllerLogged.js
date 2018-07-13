var db = require("./../Databse/chat_db");

exports.loginUser = function(args,callback){
    var socket_id = args.socket_id;
    var username = args.username;
    if(socket_id && username){
        var query = "SELECT * FROM lognuser WHERE userName ='"+username+"'";
        db.get().query(query , function(err,res){
            if(err){
                callback(null , {success:false , message:"CANNOT CONNECT TO DATABASE"})
            } else {
               
                if(res.length){
                   
                    var query = "UPDATE lognuser SET socket_id='"+socket_id+"' WHERE userName='"+username+"'";
                    db.get().query(query , function(err,result){
                        if(err){
                            callback(null , {success:false , message:"UNKNOWN ERROR"});
                        } else {
                            if(result.affectedRows === 1)
                                callback(null , {success: true});
                            else
                                callback(null , {success:false , message:"UNKNOWN ERROR"});
                        }
                    })
                } else {
                    var query = "INSERT INTO lognuser (socket_id,userName) VALUES ?";
                    var value = [
                        [socket_id,username]
                    ];
                    db.get().query(query , [value] , function(err,res){
                        if(err) {
                           
                            callback(null , {success:false , message:"UNKNOWN ERROR"});
                        } else {
                            if(res.affectedRows === 1) {
                                callback(null, {success: true});
                            }
                        }
                    })
                }
            }
        })
       
    } else{
        callback(null, {success:false , message:"MISSING PARAMS"});
    }
}

exports.getUser = function(callback){
    var query = "SELECT * FROM lognuser";
    db.get().query(query , function(err,res){
        if(err){
            callback(null,{success:false , message: err.message})
        } else{
           
            callback(null,{success:true , result:res});
        }
    });
}