/* WL - UI Class
* @author Written by Patrick Simpson
* @version 2/26/2012
* @purpose To provide UI based commands to the drawing class.  
*/
wl.UI = function(){
  //UI Constructor
  var x2,y2;
  this.fields = {
      canvas: "turtle-canvas",
      turtle: "turtle",
  } 
  this.tc = "turtle-canvas";
  this.ele = {
    source: "#source",
    run: ".run",
    comp: "#comp",
    output: "#output",
    debug: "#debugger",
    turtle: "#turtle",
    canvas: "#" + this.tc,
    speed: "#speed",
    stop: ".stop",
    highlighter: "#highlighter"
  }
  
  this.canvas = $(this.ele.canvas);
  this.turtle = $(this.ele.turtle);
  this.debug = $(this.ele.debug);
  this.comp = $(this.ele.comp);
  this.run = $(this.ele.run);
  this.source = $(this.ele.source);
  this.speed = $(this.ele.speed);
  
  //wl.canvasObj = $("#turtle-canvas")[0];
  //$(wl.canvas).css("backgroundColor", "#fff");
  paper.setup(this.fields.canvas);
  //Create the turtle....
  this.raster = new paper.Raster(this.fields.turtle);
  // Move the raster to the center of the view
  this.raster.position = paper.view.center;
  // Scale the raster by 200%
  this.raster.scale(1);
  //Rotate the raster by 0 degrees:
  this.raster.rotate(0);
  
  paper.view.draw();
  
  this.path = new paper.Path();
 
  x2 = this.canvas.width();
  y2 = this.canvas.height();
  

   
  this.midx = Math.round(x2 / 2);
  this.midy = Math.round(y2 / 2);
   
  this.turtle = {
    position:{
      x: this.midx,
      y: this.midy
    },
    degree : 0,
    radian: 0
  };
 
  this.startingpoint = new paper.Point(this.midx, this.midy);
  this.path.moveTo(this.startingpoint);
  this.path.add(this.startingpoint);
  
  //The size of the canvas UI.
  //x1,y1,x2,y2 follows.
  this.bounds = [0,0,x2,y2];
};

wl.UI.prototype.getMid = function(){
    return {x: this.midx, y: this.midy};
}
wl.UI.prototype.getSpeed = function(){
    return this.speed.val();
}
wl.UI.prototype.update = function(){
    var r = 0;
    this.raster.remove();
    this.raster = null;
    delete this.raster;
    this.raster = new paper.Raster(this.fields.turtle);
    //Figure out rotation based on 360 degrees.
    r = 360 - this.turtle.degree;
    this.raster.rotate(r);
    this.raster.position = new paper.Point(this.turtle.position.x, this.turtle.position.y);
    paper.view.draw();
};
wl.UI.prototype.addDebug = function(txt, line){
  wl.count.db++;
  var addClass = "";
  if($("#d-debug").attr("checked") !== "checked"){
    return false;
  }
  if(line && line !== null && line !== ""){
    $(this.ele.debug).prepend("<p class='debug"+addClass+"'>(" + wl.count.db + ") Line: " + line + " - " + txt + "</p>");
  }
  else{
    $(this.ele.debug).prepend("<p class='debug"+addClass+"'>(" + wl.count.db + ") " + txt + "</p>");
  }
};
wl.UI.prototype.addMessage = function(txt, line){
  wl.count.me++;
  var addClass = "";
  if($("#d-system").attr("checked") !== "checked"){
    addClass = " hide";
  }
  if(line && line !== null && line !== ""){
    $(this.ele.debug).prepend("<p class='message"+addClass+"'>(" + wl.count.me + ") Line: " + line + " - " + txt + "</p>");
  }
  else{
    $(this.ele.debug).prepend("<p class='message"+addClass+"'>(" + wl.count.me + ") " + txt + "</p>");
  }

};
wl.UI.prototype.addWarning = function(txt, line){
  wl.count.wn++;
  var addClass = "";
  if($("#d-warn").attr("checked") !== "checked"){
    addClass = " hide";
  }
  if(line && line !== null && line !== ""){
    $(this.ele.debug).prepend("<p class='warn"+addClass+"'>(" + wl.count.wn + ") Line: " + line + " - " + txt + "</p>");
  }
  else{
    $(this.ele.debug).prepend("<p class='warn"+addClass+"'>(" + wl.count.wn + ") " + txt + "</p>");
  }
  
};
wl.UI.prototype.highLightLine = function(i){
    if($("#d-hlight").attr("checked") === "checked"){    
        $(this.ele.highlighter).show().css("top", (i * 1) + 55 +  "px");
        $(this.ele.highlighter).show().css("top", (i * 15) + 40 +  "px");
    }else{
        $(this.ele.highlighter).hide();
    }
};
wl.UI.prototype.printError = function(txt, line){
  wl.count.er++;
  var addClass = "";
  if($("#d-error").attr("checked") !== "checked"){
    addClass = " hide";
  }
  if(line && line !== null && line !== ""){
    $(this.ele.debug).prepend("<p class='error"+addClass+"'>(" + wl.count.er + ") Line: " + line + " - " + txt + "</p>");
  }
  else{
    $(this.ele.debug).prepend("<p class='error"+addClass+"'>(" + wl.count.er + ") " + txt + "</p>");
  }
};
wl.UI.prototype.clearscreen = function(){
    $("#turtle-canvas").remove();
    paper.clear();
    $('<canvas id="turtle-canvas" width="630" height="455"></canvas>').appendTo("#output");
    pausecomp(500);
};
