var db = require("./../Databse/chat_db");

exports.storeMessage = function(args,callback){
	var handle = args.handle;
	var message = args.message;
	if(handle && message){
		var query = "INSERT INTO groupmessage (handle , messge) VALUES ?";
		var value = [
			[handle , message]
		];
		db.get().query(query ,[value] , function(err,res){
			if(err){
				callback(null, {success:false , message : err.message});
			} else{
				if(res.affectedRows === 1){
					callback(null , {success:true , result : res});
				}
			}
		});
	} else{
		callback(null , {success:false , message :"MISSING PARAMS"});
	}
}

exports.getMessages = function(callback){
	var query = "SELECT * FROM groupmessage";
	db.get().query(query , function(err,res){
		if(err){
			callback(null , {success:false , message : err.message});
		} else{
			callback(null , {success:true , result: res});
		}
	});
}