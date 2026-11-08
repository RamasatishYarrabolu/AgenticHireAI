const fs=require("node:fs"),path=require("node:path");const root=path.resolve(__dirname,"../../../specs");
function loadSpec(relative){const target=path.resolve(root,relative);if(!target.startsWith(root+path.sep))throw new Error("Invalid spec path");return JSON.parse(fs.readFileSync(target,"utf8"))}
module.exports={loadSpec};
