var tool1;

function clearCanvas(context, canvas) {
}
function pausecomp(ms) {
ms += new Date().getTime();
while (new Date() < ms){}
}
var init = function(){
  //Startup  -- 
  wl.startup();
}

window.onload = function() {
    wl.init();
}