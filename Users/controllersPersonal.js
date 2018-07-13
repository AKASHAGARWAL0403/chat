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

exports.removeUser = function(args , callback){
	var username = args.username;
	if(username){
		var query = "DELETE FROM personalchat WHERE user1='"+username+"'";
		db.get().query(query , function(err,res){
			if(err){
				callback(null , {success:false , message: err.message});
			} else{
				callback(null , {success:true , result : res});
			}
		});
	} else{ 
		callback(null , {success:false , message:"MISSING PARAMS"});
	}
}

exports.getUser = function(args,callback){
	var user1 = args.user1;
	var user2 = args.user2;
	if(user1 && user2){
		var query = "SELECT * FROM personalchat WHERE user1='"+user2+"'";
		db.get().query(query , function(err,res){
			if(err){
				callback(null , {success:false , message: err.message});
			} else{
				if(res.length === 1){
					if(res[0].user2 === user1){
						callback(null , {success:true , sameUser: true});
					} else{
						callback(null , {success:true, sameUser: false});
					}
				}
				else if(res.length === 0 ){
					callback(null , {success:true, sameUser: false});
				} else {
					callback(null , {success : false , message : "UNKNOWN ERROR"})
				}
			}
		});
	} else{ 
		callback(null , {success:false , message:"MISSING PARAMS"});
	}
}

exports.createTable = function(args , callback){
	var user1 = args.user1;
	var user2 = args.user2;
	var tablename1 = user1+user2;
	var tablename2 = user2+user1;
	if(user1 && user2){
		var query = "SHOW TABLES LIKE '"+tablename2+"'";
		db.get().query(query , function(err,res){
			if(err)
				callback(null ,{success:false , message:err.message});
		   else{
				if(res.length === 0){
					var query = "CREATE TABLE IF NOT EXISTS "+tablename1+" (id int AUTO_INCREMENT, handle VARCHAR(50) , message VARCHAR(500) , PRIMARY KEY (id))";
					db.get().query(query , function(err , result){
						if(err)
							callback(null ,{success:false , message:err.message});
						else{
							callback(null , {success:true , tableName: tablename1})
						}
					})
				} else{
					callback(null , {success : true , tableName: tablename2});
				}
		   }
		});
	} else {
		callback(null , {success : false , message: "MISSING PARAMS"});
	}
}

exports.storeMessage = function(args , callback){
	var tableName = args.tableName;
	var handle = args.handle;
	var message = args.message;
	if(tableName && handle && message){
		var query = "INSERT INTO "+tableName+" (handle , message) VALUES ?";
		var value = [
			[handle , message]
		];
		db.get().query(query , [value] , function(err,res){
			if(err)
				callback(null , {success : false , message : err.message});
			else{
				if(res.affectedRows === 1){
					callback(null , {success:true , result:res});
				}
			}
		});
	} else{
		callback(null , {success: false , message: "MISSING PARAMS"});
	}
}

exports.restoreMessage = function(args , callback){
	var tableName = args.tableName;
	if(tableName){
		var query = "SELECT * FROM "+tableName;
		db.get().query(query , function(err ,res){
			if(err){
				callback(null , {success:false , message: err.message});
			} else {
				callback(null, {success: true , result : res});
			}
		});
	}
}