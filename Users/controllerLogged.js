var db = require("./../Databse/chat_db");

exports.loginUser = function(args,callback){
    var socket_id = args.socket_id;
    var username = args.username;
    if(socket_id && username){
        var query = "SELECT * FROM lognuser WHERE userName ='"+username+"'";
        
        db.get().query(query , function(err,res){
            if(err){
                callback("CANNOT CONNECT TO DATABASE" , {success:false})
            } else {
               
                if(res.length){
                   
                    var query = "UPDATE lognuser SET socket_id='"+socket_id+"' WHERE userName='"+username+"'";
                    db.get().query(query , function(err,result){
                        if(err){
                            callback("UNKNOWN ERROR" , {success:false});
                        } else {
                            if(result.affectedRows === 1)
                                callback(null , {success: true});
                            else
                                callback("UNKNOWN ERROR" , {success:false});
                        }
                    })
                } else {
                    var query = "INSERT INTO lognuser (socket_id,userName) VALUES ?";
                    var value = [
                        [socket_id,username]
                    ];
                    db.get().query(query , [value] , function(err,res){
                        if(err) {
                           
                            callback("UNKNOWN ERROR" , {success:false});
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
        callback("MISSING PARAMS", {success:false});
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