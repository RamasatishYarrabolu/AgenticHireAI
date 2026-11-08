const{loadSpec}=require("../config/specs");
function requireRole(...roles){return(req,res,next)=>{const allowed=loadSpec("system/roles.json").roles;if(!allowed.includes(req.user.role)||!roles.includes(req.user.role))return res.status(403).json({success:false,message:"Insufficient permissions"});next()}}
module.exports={requireRole};
