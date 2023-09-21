type dimen = number|string

export const shiftY = (y:dimen) => ({
  position: "relative",
  top: y,
});
export const shiftX = (x:dimen) => ({
  position: "relative",
  left: x,
});
function p1(padding:dimen){
  return p4(padding, padding,padding, padding);
}

function p2(paddingY:dimen, paddingX: dimen){
  return p4(paddingY, paddingX, paddingY, paddingX);
}

function p3(paddingTop:dimen, paddingX: dimen, paddingBottom:dimen){
  return p4(paddingTop, paddingX, paddingBottom, paddingX);
}

function p4(paddingTop:dimen, paddingLeft: dimen, paddingBottom:dimen, paddingRight:dimen){
  return {
    paddingTop,
    paddingLeft,
    paddingBottom,
    paddingRight,
  };
}

export const p = (...args: Array<dimen>)=>{
  return [p1,p1,p2,p3,p4][args.slice(0,4).length].call(null, ...args);
}

export const w = (width:dimen)=>({width})