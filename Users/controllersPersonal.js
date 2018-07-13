var db = require("./../Databse/chat_db");

exports.insertChat = function(args , callback){
    var user1 = args.user1;
    var user2 = args.user2;
    if(user1 && user2){
        var query = "INSERT INTO personalchat (user1 , user2) VALUES ?";
        var value = [
            [user1,user2]
        ]
        db.get().query(query , [value] , function(err, res){
            if(err){
                callback(null , {success:false , message: err.message});
            }
            else{
                if(res.affectedRows === 1){
                    callback(null,{success:true});
                }
                else{
                    callback(null,{success:false , message:"MULTIPLE ENTRY DONE"});
                }
            }
        });
    }
}