function isObject(e){
   return !!e && typeof e === "object" && !Array.isArray(e);
}
function flatten(e, prefix="",ctx={}){
    if(Object.keys(e).length === 0){
        if(prefix)
            ctx[prefix.slice(0,-1)] = e;
    }else{
    Object.keys(e).forEach(k=>isObject(e[k])?flatten(e[k],prefix+k+".",ctx):(ctx[prefix+k]=e[k]));
    return ctx;
    }
}

console.log(flatten({a:{b:true},c:{d:{e:true}},f:{g:{}}}))
