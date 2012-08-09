var wl = {
  fields: {
    source: "#source",
    run: ".run",
    comp: "#comp",
    output: "#output",
    debug: "#debugger",
    turtle: "#turtle"
  },
  init: function(){
    $(this.fields.run).click(function(){
      var source = $(wl.fields.source).val();
      wl.compiler.compile(source);
    });
  },
  compiler: {
    lt: 0,
    db: 0,
    er: "",
    turtle: {
      position:{
        x: 300,
        y: 230,
      },
      degrees: 0,
      deg2Rad: function(deg){
        return deg * (Math.PI / 180); 
      },
      moveUP: function(n){
        var radians, vx, vy;
        radians = this.deg2Rad(this.degrees);
        vx = Math.round(Math.sin(radians) * n);
        vy = Math.round(Math.cos(radians) * n);
        this.move(vx,vy);
      },
      moveDOWN: function(n){
        var radians, vx, vy;
        radians = this.deg2Rad(Math.abs(this.degrees - 180));
        vx = Math.round(Math.sin(radians) * n);
        vy = Math.round(Math.cos(radians) * n);
        this.move(vx,vy);
      },
      move: function(vx, vy){
        wl.compiler.printDebug("moving turtle: x=" + vx + " y=" + vy); 
        this.position.x = this.position.x - vx;
        this.position.y = this.position.y - vy;
        wl.compiler.printDebug("position: x=" + this.position.x + " y=" + this.position.y);
        $(wl.fields.turtle).css({"top": this.position.y - 8 + "px", "left": this.position.x - 8 + "px"}); 
      },
      rotateLEFT: function(n){
        var d, remain; 
        d = (this.degrees + (n * 1));
        if (d >= 0){
          remain = 360 - d;
          d = 0 + remain;
        }
        this.degrees = d;
      },
      rotateRIGHT: function(n){
        var d, remain; 
        d = (this.degrees + (n * 1));
        if (d >= 360){
          remain = d - 360;
          d = 0 + remain;
        }
        this.degrees = d;
      }
    },
    commands: [],
    compile: function(source){
      var line, lines, cols, col, i, c, pointer, colLen, num, next, nextNumeric;
      this.clearDubug();
      this.printDebug("Compile start - time: " + this.dateStamp());
      lines = source.split("\n");
      
      nextNumeric = function(p, cols){
        //this command looks for a numeric value.
        var num, next, c;
        num = 1;
        colLen = cols.length;
        c = p
        next = p + 1;
        if(next < colLen){
          //check for numeric value.
          if(!isNaN(cols[next])){
            num = cols[next];
            c = next;
          }
        }
        return {"num": num,"pointer": c};
      }
      for(i in lines){
        line = lines[i];
        lineRef = (i*1) + 1;
        cols = line.split(" ");
        colLen = cols.length;
        for(c = 0; c < colLen; c++){
          pointer = c;
          col = cols[pointer].toLowerCase();
          switch(col){
            case "forward": case "fd":
              next = nextNumeric(pointer, cols);
              c = next.pointer;
              this.turtle.moveUP(next.num);
            break;
            case "back": case "bk":
              next = nextNumeric(pointer, cols);
              c = next.pointer;
              this.turtle.moveDOWN(next.num);
            break;
            case "right": case "rt":
              next = nextNumeric(pointer, cols);
              c = next.pointer;
              this.turtle.rotateRIGHT(next.num);
            break;
            case "left": case "lt":
              next = nextNumeric(pointer, cols);
              c = next.pointer;
              this.turtle.rotateLEFT(next.num);
            break;
            default: 
              this.printError("Unrecognized command \"" + col + "\"", lineRef); 
          }
        }  
      }
    },
    printDebug: function(txt, line){
      this.db++;
      if(line && line !== null && line !== ""){
        $(wl.fields.debug).prepend("<p>(" + this.db + ") Line: " + line + " - " + txt + "</p>");
      }
      else{
        $(wl.fields.debug).prepend("<p>(" + this.db + ") " + txt + "</p>");
      }
    },
    printError: function(txt, line){
      this.db++;
      if(line && line !== null && line !== ""){
        $(wl.fields.debug).prepend("<p class='error'>("+db+") Line: " + line + " - " + txt + "</p>");
      }
      else{
        $(wl.fields.debug).prepend("<p class='error'>("+db+") " + txt + "</p>");
      }
    },
    clearDubug: function(){
      $(wl.fields.debug + " p").remove();  
    },
    dateStamp: function(){
      var ct,m,d,y,h,m,s,a;
      ct = new Date();
      m = ct.getMonth() + 1;
      d = ct.getDate();
      y = ct.getFullYear();
      h = ct.getHours()
      m = ct.getMinutes()
      if (m < 10){
      m = "0" + m
      }
      
      if(h > 11){
        a = "PM";
      } else {
        a = "PM";
      }
      return (h + ":" + m + " " + a + " - " + m + "/" + d + "/" + y);
    }
  }
};
$(document).ready(function(){
  wl.init();
});