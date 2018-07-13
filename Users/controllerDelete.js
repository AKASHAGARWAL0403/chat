var db = require("./../Databse/chat_db");

exports.deleteLogged = function(args , callback){
    if(args){
        var query = "DELETE FROM lognuser WHERE socket_id='"+args+"'";
        db.get().query(query , function(err,res){
            if(err){
                callback(null , {success:false , message: err.message});
            } else{
                callback(null , {success:true , result: res});
            }
        })
    } else{
        callback(null , {success:false , message:"MISSING PARAMS"});
    }
}