const mongoose = require('mongoose');
const crypto = require('crypto');
const userSchema  = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    facebook:String,
    google:String,
    profile:{
        name:{type:String},
        picture:{type:String,default:''}
    },
    password:{
        type:String,    
    },
})
userSchema.methods.gravatar = function(size) {
    if (!this.size) size = 200;
    if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=robohash';
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=robohash';
  }

  module.exports = mongoose.model('User',userSchema);