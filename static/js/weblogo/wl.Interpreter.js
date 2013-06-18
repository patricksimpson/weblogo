/* WL - UI Class
* @author Written by Patrick Simpson
* @version 2/20/2012
* @purpose To iterate a javascript object of commands, instructing the UI class to draw the elements needed.  
*/

wl.Interpreter = function(){
  //UI Constructor
  this.err = new wl.Error();
  this.halt = false;
  this.draw = new wl.Drawing();  
  this.to = null;
  this.wait = false;
  this.commands = null;
  this.currentCommands = null;
  this.toHold = null;
  this.processing = false;
  this.depth = 0;
  this.commandStack = [];
  this.lastLine = -1;
}
wl.Interpreter.prototype.init = function(commands){
    var speed, command;
    //debugger;
    speed = wl.ui.getSpeed();
    if(speed > 0 || speed < 0){
        this.processing = true;
        for(var i = 0; i < commands.length; i++){
            command = commands[i];
            if(command.name === "rep" || command.name === "repeat"){
                this.depth++;
                for(var c = 0; c < command.number; c++){
                    this.init(command.commands);
                }
                this.depth--;
            }else{
                this.commandStack.push(command);
            }
        }
    }else{
        this.processCommands(commands);          
    }
    if(this.commandStack.length > 0 && this.depth === 0){
        //Process stack
        wl.ui.addMessage('Delay commands. This will take about '+ (((this.commandStack.length * speed)/1000) * 5) + ' seconds to complete.');
        this.pauseCommand(0, speed);
    }
}
wl.Interpreter.prototype.pauseCommand = function(i, speed){
    var next;
    next = i;
    if(wl.running){
    wl.ui.addDebug('Processing command: ' + i + ' of ' + this.commandStack.length);
    $(".complete").text(" " + Math.round((i/this.commandStack.length)*100) + "% complete");
    this.wait = false;
    this.processCommand(this.commandStack[i]);
    next = (i*1) + 1;
    if(next < this.commandStack.length){
      if(speed > 0){
        this.to = setTimeout('wl.ir.pauseCommand("' + next + '", "' + speed +'")', speed);
        wl.ui.addDebug('Wait command : '+ this.commandStack[next].name + ' time: ' + speed);
        this.wait = true;
        return false;
      }
      if(speed < 0){
          this.to = setTimeout('wl.ir.pauseCommand("' + next + '", "' + speed +'")', speed);
          this.wait = true;
          wl.stop();
          return false;
      }
      if(speed == 0){
          clearTimeout(this.to);
          this.to = null;
          this.wait = false;
          wl.stop();
          wl.running = false;
          wl.run();
          return false;
      }
   }
   if(i == this.commandStack.length - 1){
        this.processing = this.wait = false;
        wl.completeRun();
      }
    }else{
        wl.pause.commandI = next;
        //Bye!
        clearTimeout(this.to);
        this.to = null;
    }
    return false;
}
wl.Interpreter.prototype.processCommands = function(commands){

    this.processing = true;
    var command,  speed, i;
    speed = wl.ui.getSpeed();
    for(i = 0; i < commands.length; i++){
        wl.ui.addDebug("Processing command: + " + i + " of " + commands.length);
        command = commands[i];
        success = true;
        this.processCommand(command);
        this.processing = false;
  }
}
wl.Interpreter.prototype.processCommand =  function(command){
    var currLine = command.refline;
    this.lastLine = currLine;
    wl.ui.addDebug("Processing command ["+command.name+"] line: " + (command.refline) + " : " + (command.refcol));
    wl.ui.highLightLine(currLine);
    switch(command.name){
        
          case "forward": case "fd":
            success = this.draw.moveForward(command.number);
          break;
          case "back": case "bk":
            success = this.draw.moveBack(command.number);
          break;
          case "right": case "rt":
            success = this.draw.rotateRight(command.number);
          break;
          case "left": case "lt":
            success = this.draw.rotateLeft(command.number);
          break;
          case "repeat": case "rep":
            this.depth++;
            for(var c = 0; c < command.number; c++){
                success = this.init(command.commands);
            }  
            this.depth--; 
          break;
          case "setx": 
            success = this.draw.setx(command.number);
          break;
          case "sety": 
            success = this.draw.sety(command.number);
          break;
          case "setpencolor": case "pc":
            success = this.draw.setPenColor(command.color);
          break;
          case "setbackground": case "bkg":
            success = this.draw.setBackgroundColor(command.color);
          break;
          case "penup": case "pu":
            success = this.draw.pen(false);
          break;
          case "pendown": case "pd":
            success = this.draw.pen(true);
          break;
          case "showturtle": case "st":
            success = this.draw.turtle(true);
          break;
          case "hideturtle": case "ht":
            success = this.draw.turtle(false);
          break;
          case "clearscreen": case "cs":
            wl.ui.addDebug("Clearing screen...");
            wl.ui.clearscreen();
            wl.ui = null;
            wl.ui = new wl.UI();
            wl.ui.addDebug("New UI Created...");
          break;
          
          case "stop":
            wl.ui.addDebug("Program halted!");
            return false;
          break;
          default:
            this.err.add("Interpreter error, invalid command?  '" + command.name + "'"); 
            return false;     
       }
      this.err.addAll(this.draw.getErrors());
      this.err.print();
}
