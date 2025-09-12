import mongoose from "mongoose";

const userscema= new mongoose.Schema({

    email:{
        type:String, 
        required:true, 
        unique:true
    },
    fullName:{
        type:String, 
        required:true
    },
    password:{
        type:String,
         required:true ,
          minlength:6
        },
    profilePic:{
        type:String, 
        default:""
    },

},
   {Timestamp:true}
);
const User = mongoose.model("User", userscema);

export default User;