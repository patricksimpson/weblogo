Paper.js
==========

Does paper.js allow me to draw the minimum Logo commands allowed for this project? Yes!

  * Draw points [fd, bk]
    * Point(x, y)
  * Draw lines [fd,bk]
    * Path.Line(pt1, pt2)
    * Path.Rectangle(point1, point2)
    * Path.Circle(center, radius)
  * Change pen colors [setpencolor, pc]
    * Object.fillcolor
    
Extended Commands
======
  * setbackground, bkg
    * use the DOM (or jQuery to accomplish)
  * repeat rep
    * This can be done by the parser, should use an array to determine whether or not a command should repeat, in the command queue.
  * to name, end
    * This may be somewhat challenging for the paser, but if a proper parser is built, this can be done.
  * clearscreen, cs
    * This can be accomplished using the following method: clearCanvas(contex, canvas){ context.setTransform(1,0,01,0,0); context.clearRect(0,0,canvas.width, canvas.height); context.restore(); }
    * Init requires context.save(); for the clear command to work.
  * setx, sety
      * Simple JavaScript object cursor, moving the current x,y would be trivial. 
  * showturtle st, hideturtle st
    * Simple JavaScript object boolean, easy. 
  * Stop
    * 
  * Variables
    * This would take some work in the JavaScript parser to understand or recognize values, store them in an object map for later use. This is a variable/variable system.
  * Standalone arithmetic 
    * This can be done as a JavaScript eval, but it would be better to interpret these as individual operations using prefix / postfix notation queues/stacks.
  * Conditionals will be an in memory/object identifier. Possible, but it is going to require a lot of effort. 
    
  
General Functionality 
==========

  * Saving, loading, etc.
    * FILE API: http://dev.w3.org/2006/webapi/FileAPI/
    * Possible in FF4, Chrome, Safari Only, using only HTML5 to "load", and to "save" to the clients hard disk. 

Logo Commands Supported in JavaScript, OO approach. 
=========

  * penup pu, pendown pd. This will be an object flag. isDrawing = boolean 
  * right rt, left lt. This is simply the current "cursor" direction which is also a JavaScript object variable. 
  
Misc Information
==========
  
http://paperjs.org/reference
NOTE: HTML 5 Support will be via paper.js, therefore no need to further investigate. 

Todo:
