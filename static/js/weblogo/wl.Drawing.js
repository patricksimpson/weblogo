/* WL - Drawing Class
* Written by Patrick Simpson
*/
wl.Drawing = function(){

  this.BGColor = "#ffffff"; //White
  this.penColor = "#000000" //Black
  this.dBGColor = "#ffffff"; //White
  this.dPenColor = "#000000" //Black
 
  this.penStatus = true;
  this.turtleStatus = true;
  
  this.mid = wl.ui.getMid();
  
  this.errors = [];
    
};

/*
 * getDegree
 * 
 * @return  returns the current radian position of the turtle.
 */
wl.Drawing.prototype.getDegree = function(){
    return wl.ui.turtle.degree;
};

/*
 * getDegree
 * 
 * @return  returns the current radian position of the turtle.
 */
wl.Drawing.prototype.setDegree = function(d){
    if (d >= 360){
        remain = d - 360;
        d = 0 + remain;
    }
    if (d <= 0){
        remain = 360 + d;
        d = 0 + remain;
    }
    wl.ui.addDebug("turtle at: " + d);
    wl.ui.turtle.degree = d;
};
/*
 * getRadian
 * 
 * @return  returns the current radian position of the turtle.
 */
wl.Drawing.prototype.getRadian = function(){
    return wl.ui.turtle.radian;
};

/*
 * setRadian sets the turtles radian value.
 * 
 * @param   r (Radian)
 * @return  true if the radian was set, false otherwise. 
 */
wl.Drawing.prototype.setRadian = function(r){
    if(isNaN(r)){
        this.errors.push("Invalid radian '" + r + "' was sent to UI.setRadian.");
        return false;
    }
     wl.ui.turtle.radian = r;
    return true;
};
/*
 * deg2Rad (Degrees to Radian)
 * Purpose is to calculate radian (movement based on current degree position)
 * 
 * @param   Integer d (degrees)
 * @return  Integer radian
 */
wl.Drawing.prototype.deg2Rad = function(d){
    if(isNaN(d)){
        this.errors.push("Invalid degrees '" + d + "' was sent to UI.deg2Rad.");
        return false;
    }
    return d * (Math.PI / 180); 
};

wl.Drawing.prototype.moveForward = function(n){
    var r;
    r = this.getRadian();
    this.move(n, r);
    wl.ui.addDebug("Moving turtle at: " + n + " at : " + r);
};

wl.Drawing.prototype.moveBack = function(n){
    var td, nd, tempR;
    td = this.getDegree();
    if(td >= 180){ //360-180
        od = td- 180; 
    }
    else{ //0-179
        od = td + 180;
    }
    tempR = this.deg2Rad(od);
    this.move(n, tempR);
};

/*
 * Move 
 * 
 * @param   x The x position for the turtle.
 * @param   y The y position for the turtle.
 * 
 */
wl.Drawing.prototype.move = function(n, r){
    var r, vx, vy, p;
    vx = Math.round(Math.sin(r) * n);
    vy = Math.round(Math.cos(r) * n);
    //debugger;
    p = new paper.Path();
    p.add(new paper.Point(wl.ui.turtle.position.x, wl.ui.turtle.position.y));
     wl.ui.turtle.position.x =  wl.ui.turtle.position.x - vx;
     wl.ui.turtle.position.y = wl.ui.turtle.position.y - vy;
    if(this.penStatus){
        p.strokeColor = this.penColor;
    }else{
        p.strokeColor = this.BGColor;
    }
    p.add(new paper.Point(wl.ui.turtle.position.x, wl.ui.turtle.position.y));
    //this.ui.path.add(new paper.Point(this.turtle.position.x, this.turtle.position.y));
    p = null;
    delete p;
    wl.ui.raster.postion = null;
    delete wl.ui.raster.position;
    wl.ui.raster.position = new paper.Point(wl.ui.turtle.position.x, wl.ui.turtle.position.y);
    wl.ui.update();
};

/*
 * Rotate Right 
 * 
 * @param   n the number of degrees to rotate.
 * 
 */
wl.Drawing.prototype.rotateLeft = function(n){
    var d, remain; 
    d = (wl.ui.turtle.degree + (n * 1));
    this.setDegree(d);
    this.setRadian(this.deg2Rad(d));
    //wl.ui.raster.rotate(-1 * n);
    wl.ui.update();
};

/*
 * Rotate Left 
 * 
 * @param   n the number of degrees to rotate.
 * 
 */
wl.Drawing.prototype.rotateRight = function(n){
    var d, remain; 
    d = (wl.ui.turtle.degree - (n * 1));
    this.setDegree(d);
    this.setRadian(this.deg2Rad(d));
    //wl.ui.raster.rotate(1 * n);
    wl.ui.update();
};

wl.Drawing.prototype.setx = function(n){
    wl.ui.turtle.position.x = n;
    wl.ui.raster.position = new paper.Point(wl.ui.turtle.position.x, wl.ui.turtle.position.y);
    wl.ui.update();
    
};

wl.Drawing.prototype.sety = function(n){
    wl.ui.turtle.position.y = n;
    wl.ui.raster.position = new paper.Point(wl.ui.turtle.position.x, wl.ui.turtle.position.y);
    wl.ui.update();
};

wl.Drawing.prototype.setBackgroundColor = function(c){
    if(c === ""){
        c = this.dBGColor;
    }
    this.BGColor = c;
    wl.ui.canvas.css("backgroundColor", this.BGColor);
};

wl.Drawing.prototype.setPenColor = function(c){
    if(c === ""){
        c = this.dPenColor;
    }
    this.penColor = c;
};

wl.Drawing.prototype.pen = function(b){
    this.penStatus = b;   
};

wl.Drawing.prototype.turtle = function(b){
    this.turtleStatus = b;
    wl.ui.raster.visible = this.turtleStatus;
    wl.ui.update();
};
wl.Drawing.prototype.getErrors = function(){
    return this.errors;
}
