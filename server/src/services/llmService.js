const{loadSpec}=require("../config/specs");

async function callProvider(name,url,key,model,prompt,messages){
 const response=await fetch(url,{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model,temperature:prompt.temperature,messages:[{role:"system",content:prompt.system},...messages]})});
 if(!response.ok){const error=new Error(`${name} request failed (${response.status})`);error.status=response.status;throw error}
 const result=await response.json();let content=result.choices?.[0]?.message?.content;
 if(!content)throw new Error(`${name} returned an empty response`);
 content=content.replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/i,"");
 try{return JSON.parse(content)}catch(error){error.status=422;throw error}
}

async function complete(prompt,messages){
 const config=loadSpec("system/providers.json"),providers=[];
 if(process.env.GROQ_API_KEY)providers.push(["Groq","https://api.groq.com/openai/v1/chat/completions",process.env.GROQ_API_KEY,config.groq_model]);
 if(process.env.OPENROUTER_API_KEY)providers.push(["OpenRouter","https://openrouter.ai/api/v1/chat/completions",process.env.OPENROUTER_API_KEY,config.openrouter_model]);
 if(!providers.length)return null;
 const errors=[];
 for(const provider of providers)try{return await callProvider(...provider,prompt,messages)}catch(error){errors.push(error)}
 // Retired or unavailable model IDs should degrade to the local deterministic path.
 if(errors.length&&errors.every(error=>error.status===404))return null;
 throw errors.at(-1);
}
module.exports={complete};
