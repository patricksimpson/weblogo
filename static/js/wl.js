var wl = {
  lang: {
      number : [
        "fd",
        "forward",
        "back",
        "bk",
        "right",
        "rt",
        "left",
        "lt",
        "repeat",
        "rep",
        "setx",
        "sety"
      ],
      color : [
        "setpencolor",
        "pc",
        "setbackground",
        "bkg"
      ],
      logical : [
        "penup",
        "pu",
        "pendown",
        "pd",
        "showturtle",
        "st",
        "hideturtle",
        "ht",
        "clearscreen",
        "cs"
      ],
      colors: [
      "black",
      "white",
      "red",
      "blue",
      "green",
      "grey",
      "magenta",
      "orange",
      "pink",
      "yellow"
      ],
      math : [
        "+",
        "-",
        "*",
        "/"
      ],
      expression : [
        "==",
        ">",
        "<",
        "!="
      ]
  },
  running: false,
  pause: {},
  ui: {},
  ir: {},
  count:{
      er: 0,
      wn: 0,
      db: 0,
      me: 0
  },
  projectname : "Untitled Project"
};
wl.init = function(){
    wl.ui = new wl.UI();
    var code;
    code = localStorage["mycode"];
    if(code != ""){
      $(wl.ui.ele.source).val(localStorage["mycode"]);
    }
    $("#project-name").val(wl.projectname);
    $("title").text("Weblogo: " + wl.projectname);
    $(wl.ui.ele.source).on("keyup", function(){
      localStorage["mycode"] = $(wl.ui.ele.source).val();
    });
    $(wl.ui.ele.run).click(function(){
      $("#loading").show();
      setTimeout("wl.run()", 250); //Run in .5 seconds.
    });
    $(wl.ui.ele.stop).click(function(){
      wl.stop();
    });
    $("#clear-source").on("click", function(){
      localStorage["mycode"] = "";
      $(wl.ui.ele.source).val("");
      return false;
    });
    $("#clear-canvas").on("click", function(){
      var tempir = null;
      source = "clearscreen \nbkg white \nsetx " + wl.ui.midx + " \nsety " + wl.ui.midy;
      localStorage["mycode"] = $(wl.ui.ele.source).val();
      $(wl.ui.ele.source).val(source);
      wl.run();
      $(wl.ui.ele.source).val(localStorage["mycode"]);
    });
    $("#d-error").change(function(){
       if($(this).attr("checked") === undefined){
           $("#debugger .error").hide();
           wl.ui.showError = false; 
       }else{
        $("#debugger .error").show();   
        $("#debugger .error").removeClass("hide"); 
        wl.ui.showError = true; 
       }
    });
    $("#d-warn").change(function(){
       if($(this).attr("checked") === undefined){
           $("#debugger .warn").hide();
       }else{
        $("#debugger .warn").show();   
        $("#debugger .warn").removeClass("hide");
       }
    });
    $("#d-system").change(function(){
       if($(this).attr("checked") === undefined){
           $("#debugger .message").hide();
       }else{
        $("#debugger .message").show();
        $("#debugger .warn").removeClass("hide");   
       }
    });
    $("#d-debug").change(function(){
       if($(this).attr("checked") === undefined){
           $("#debugger .debug").hide();
       }else{
        $("#debugger .debug").show();   
        $("#debugger .debug").removeClass("hide"); 
       }
    });
    $("#project-name").change(function(){
        var name;
        name = $("#project-name").val();
        wl.renameProject(name);
    });
    $("#save-project").click(function(){
        var ex, pn, source;
        pn = "wl-" + wl.projectname.trim();
        ex = readCookie(pn);
        if(ex){
            if(confirm("WebLogo Project \"" + wl.projectname + "\" exists! \nDo you wish to overwrite this project?")){
                //Overwrite
                eraseCookie(pn);
            }else{
                return;
            }
        }
        source = $(wl.ui.ele.source).val();
        createCookie(pn, escape(source), 365);
        alert("Weblogo: " + wl.projectname + " saved!");
   });
   $("#load-project").click(function(){
       var cookies, i, c;
       c = 0;
       cookies = get_cookies_array();
       $('#loading-text p').remove();
       for(i in cookies){
        c++;
        $('#loading-text').append("<p><a href='#' onclick='return wl.loadFile(\""+ i + "\");'>"+ i +"</a> | <a href='#' onclick='return wl.deleteFile(\""+ i + "\");'>Delete</a></p>")
       }
       if(c === 0){
        $('#loading-text').append("<p>No saved files found...</p>");    
       }
       $('#loading-dialog').jqmShow(); 
   });
   $('#loading-dialog').jqm();
};
wl.renameProject = function(name){
    wl.projectname = name;
    $("title").text("Weblogo: " + wl.projectname);
    $("#project-title").text(wl.projectname);
}
wl.loadFile = function(name){
    cookie = readCookie(name);
    n = name.split("-")[1];
    if(n){
    $("#project-name").val(n);
    wl.renameProject(n);
    if(cookie){
        $(wl.ui.ele.source).val(unescape(cookie));
    }else{
        alert("Cookie was invalid?");
    }
    $('#loading-dialog').jqmHide();
    }else{
        alert("Invalid file name! " + name );
    }
    return false;
}
wl.deleteFile = function(name){
    cookie = readCookie(name);
    n = name.split("-")[1];
    if(n){
        if(confirm("Are you sure your would like to delete the \"" + n + "\" project?")){
            eraseCookie(name);
        }
    }else{
        alert("Invalid file name! " + name );
    }
    $('#loading-dialog').jqmHide();
    return false;
}
wl.run = function(){
  wl.pause = {};
  wl.ir = {};
  wl.count = {
      er: 0,
      wn: 0,
      db: 0,
      me: 0
  };
  wl.running = true;
  $(wl.ui.ele.stop).val("Pause").removeAttr("disabled");
  $(wl.ui.ele.run).val("Running...");
  $(wl.ui.ele.run).attr("disabled","disabled");
  var source, compiler, commands, errors, i, endd;
  wl.startd = new Date();
  wl.ui.addMessage("Starting new compile at: " + wl.startd.getHours() + ":" + wl.startd.getMinutes() + ":"+ wl.startd.getSeconds()+ ", "+ wl.startd.getMilliseconds() + " ms");      
  source = $(wl.ui.ele.source).val();
  source = wl.fixUgly(source);
  compiler = new wl.Parser();
  commands = compiler.compile(source);
  if(!commands || commands.length < 1){
     errors = compiler.getErrors();
     errors.print();
  }
  wl.ir = new wl.Interpreter(wl.ui);
  wl.ir.init(commands);
  wl.completeRun();
}
wl.stop = function(){
    wl.running = !wl.running;
    if(wl.running){
        //Pick up where we left off!
        if(wl.pause.commandI !== 0){
            t = parseInt($(wl.ui.ele.highlighter).css("top"));
            $(wl.ui.ele.highlighter).css({"height": "15px", "top": (t - 15) + "px"});
            wl.ui.addMessage("Resuming processing: " + wl.pause.commandI);
            $("#loading").show();
            $(wl.ui.ele.stop).val("Pause");
            $(wl.ui.ele.run).attr("disabled","disabled").val("Running");
            wl.ir.pauseCommand(wl.pause.commandI, wl.ui.getSpeed());
        }
    }else{
        t = parseInt($(wl.ui.ele.highlighter).css("top"));
        $(wl.ui.ele.highlighter).css({"height": "1px", "top": (t  + 15) + "px"});
        $("#loading").hide();
        wl.ui.addMessage("Program halted by user: " + wl.pause.commandI);
        $(wl.ui.ele.stop).val("Resume");
        $(wl.ui.ele.run).val("Restart").removeAttr("disabled");
    }
}
wl.completeRun = function(){
    if(!wl.ir.wait){
      endd = new Date();
      wl.ui.addMessage("Execution complete at: " + endd.getHours() + ":" + endd.getMinutes() + ":"+ endd.getSeconds()+ ", "+ endd.getMilliseconds() + " ms");    
      execd = endd.getTime() - wl.startd.getTime();
      wl.ui.addMessage("Execution time " + execd/1000 + " seconds");
      wl.ui.addMessage("Errors: " + wl.count.er + ", Warnings: " + wl.count.wn + ", System: " + wl.count.me + ", Debug: " + wl.count.db);  
      $("#loading").hide();
      $(wl.ui.ele.stop).val("Pause").attr("disabled","disabled");
      $(wl.ui.ele.run).val("Start").removeAttr("disabled");
  }
  else{
    wl.ui.addDebug("Waiting for command.");    
  }
}
wl.fixUgly = function (source) {
  var lines = source.split("\n");
  var clean = "";
  for(var _i = 0; _i < lines.length; ++_i){
    line = lines[_i];
    line = trimComments(line);
    line = fixBracketSpaces(line);
    line = fixMathOps(line);
    line = fixExpress(line);
    line = trimMe(line);
    if(clean != ""){
      clean = clean + "\n";
    }
    clean = clean + line;
  }
  return clean;
}
wl.pausecomp = function (ms) {
ms += new Date().getTime();
while (new Date() < ms){}
} 
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
    return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
    return this.replace(/\s+$/,"");
}
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}
function get_cookies_array() {

    var cookies = { };

    if (document.cookie && document.cookie != '') {
        var split = document.cookie.split(';');
        for (var i = 0; i < split.length; i++) {
            var name_value = split[i].split("=");
            name_value[0] = name_value[0].replace(/^ /, '');
            if(decodeURIComponent(name_value[0]).split("-")[0] === "wl"){
                cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);  
            }
        }
    }

    return cookies;
   
}

function trimMe (str) {
    str = str.replace(/^\s+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}

function trimComments (str) {
  str = str.replace(/;.+/, '');
  return str;
}

function fixBracketSpaces( str ){
  str = str.replace(/\[([^\s])/, function(str, group1){
    return '[ ' + group1;
  });
  str = str.replace(/([^\s])\]/, function(str, group1, group2){
    return group1 + ' ]';
  });
    str = str.replace(/([^\s])\[/, function(str, group1){
    return group1 + ' [';
  });
  str = str.replace(/\]([^\s])/, function(str, group1, group2){
    return '] ' +group1;
  });

  return str;
}
function fixMathOps( str ) {
  //fix math
  str = str.replace(/\s?\+\s?/, '+');
  str = str.replace(/\s?\-\s?/, '-');
  str =  str.replace(/\s?\*\s?/, '*');
  str = str.replace(/\s?\\\s?/, '\\');
  return str;
}

function fixExpress( str ){
  str = str.replace(/([^\s])?\>([^\s])?/, function(str, group1, group2){
    if(typeof group1 != "undefined" && typeof group2 != "undefined"){
      return '' + group1 + ' ' + '>' + ' ' + group2;
    }
    if(typeof group1 != "undefined"){
      return '' + group1 + ' ' + '>';
    }
    if(typeof group2 != "undefined"){
      return '' + '>' + ' ' + group2;
    }
    return '>';
  });
  str = str.replace(/([^\s])?\<([^\s])?/, function(str, group1, group2){
    if(typeof group1 != "undefined" && typeof group2 != "undefined"){
      return '' + group1 + ' ' + '<' + ' ' + group2;
    }
    if(typeof group1 != "undefined"){
      return '' + group1 + ' ' + '<';
    }
    if(typeof group2 != "undefined"){
      return '' + '<' + ' ' + group2;
    }
    return '<';
  });

  str = str.replace(/([^\s])?\=\=([^\s])?/, function(str, group1, group2){
    if(typeof group1 != "undefined" && typeof group2 != "undefined"){
      return '' + group1 + ' ' + '==' + ' ' + group2;
    }
    if(typeof group1 != "undefined"){
      return '' + group1 + ' ' + '==';
    }
    if(typeof group2 != "undefined"){
      return '' + '==' + ' ' + group2;
    }
    return '==';
  });

  str = str.replace(/([^\s])?\!\=([^\s])?/, function(str, group1, group2){
    if(typeof group1 != "undefined" && typeof group2 != "undefined"){
      return '' + group1 + ' ' + '!=' + ' ' + group2;
    }
    if(typeof group1 != "undefined"){
      return '' + group1 + ' ' + '!=';
    }
    if(typeof group2 != "undefined"){
      return '' + '!=' + ' ' + group2;
    }
    return '!=';
  });


  return str;
}

