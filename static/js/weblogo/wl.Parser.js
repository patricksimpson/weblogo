/* WL - Parser Class
 * @author Written by Patrick Simpson
 * @version 2/20/2012
 * @purpose To convert the text based source code to a javascript object.
 */

wl.Parser = function() {
    this.fundef = [];
    this.vardef = [];
    this.recursion = 0;
    this.stop = false;
    this.cLine = 0;
    this.maxLines = 0;
    this.cCol = 0;
    this.currnetLine = 0;
    this.lineEval = [];
    //global scope
};
wl.Parser.prototype.createCommand = function() {
    return {
        name : "",
        number : 0,
        color : "",
        commands : null,
        refline: 0,
        refcol: 0
    };
}
wl.Parser.prototype.createFunction = function() {
    return {
        name : "",
        scope : [],
        source : ""
    };
}
wl.Parser.prototype.createExpression = function() {
    return {
        expression: false,
        evaled: false
    };
}
wl.Parser.prototype.createVar = function() {
    return {
        name : "",
        val : "",
    };
}
wl.Parser.prototype.compile = function(source, so) {
    if(this.stop){
        return false;
    }
    var lines, line, cols, col, i, j, whichCommand, nflag, cflag, sflag, loopflag, command, loopcap, loopSource, loopnext, commands, command, f, v, funSource, funcap, vi, updatevar, funcheck, compcommands, fnci, fnciObj, scope, scopename, fcARGS, fcflag, funArgs, e, logical, expression, truth, x, y, z, findend, parCount, lineref;
    this.recursion++;
    if(this.recursion%25 == 0){
        wl.ui.addWarning("Recursion depth: " + this.recursion);
    }
    if(this.recursion > 400){
        wl.ui.printError("Error: Recursion depth: " + this.recursion);
        wl.ui.printError("Too much recursion! Please check your syntax.");
        return false; 
    }
    lines = source.split("\n");
    if(so !== undefined) {
        scope = so.scopeVars;
        //The variable scope
        scopename = so.name;
        //The scopename
    } else {
        scope = this.vardef;
        scopename = "global";
        if(this.maxLines == 0){
            this.maxLines = lines.length;
            this.lineEval = lines;
            for(var f = 0; f < lines.length; f++){
                lines[f] = "{_& "+(f + 1)+" &_} " + lines[f];
            }
        }
    }
    parCount = 0;
    lineref = findend = expressflag = funArgs = fcflag = fcARGS = funcap = vflag = sflag = nflag = cflag = loopflag = loopcap = loopnext = false;
    commands = [];
    expressions = [];
    logical = [];
    vi = 0;
    command = this.createCommand();
    for( i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
        //this.cLine = this.getLineNumber(lines[i]);
        if(lines[i].length > 0){
            cols = lines[i].split(" ");
            //console.log(scopename + " - i : " + i + " line " + lines[i]);
            for( j = 0; j < cols.length; j++) {
                if(!nflag && !cflag && !sflag && !vflag && !loopflag && !loopcap && !funcap && !funcheck) {
                    if(!loopflag && !loopcap && !funcap) {
                        if(command.name !== "repeat" && command.name !== "rep" && command.name !== "function") {
                            command = this.createCommand();
                        }
                    }
                    col = cols[j].toLowerCase();
                    whichCommand = this.whichCommand(col);
                    if(whichCommand) {
                        switch(whichCommand) {
                            case "number":
                                if(loopnext) {
                                    wl.ui.printError("Parse error: expected loop characters! []");
                                    return false;
                                }
                                nflag = true;
                                command.name = col;
                                    command.refline = this.currentLine;
                                    command.refcol = j+1;
                                break;
                            case "color":
                                if(loopnext) {
                                    wl.ui.printError("Parse error: expected loop characters! []");
                                    return false;
                                }
                                cflag = true;
                                command.name = col;
                                command.refline = this.currentLine;
                                command.refcol = j+1;
                                break;
                            case "logical":
                                if(loopnext) {
                                    wl.ui.printError("Parse error: expected loop characters! []");
                                    return false;
                                }
                                command.name = col;
                                command.refline = this.currentLine;
                                command.refcol = j+1;
                                commands.push(command);
                                break;
                            case "cap":
                                if(expressflag && !e.evaled){
                                    z = logical.pop();
                                    y = expressions.pop();
                                    x = expressions.pop();
                                    truth = eval(x + z + y);
                                    e.truthy = truth;
                                    e.evaled = true;
                                    if(!truth){
                                        expressflag = false;
                                        findend = true;
                                    }else{
                                        command = this.createCommand();
                                        findend = false;
                                        command.name = "repeat";
                                        command.number = 1;
                                        command.refline = this.currentLine;
                                        command.refcol = j + 1;
                                    }
                                }else{
                                    if(expressflag){
                                        command = this.createCommand();
                                        loopnext = false;
                                        loopflag = loopcap = true;
                                        if(!e.truthy && e.evaled){
                                            command.name = "repeat";
                                            command.number = 1;
                                            findend = false;
                                            command.refline = this.currentLine;
                                            command.refcol = j+1;
                                        }else{
                                            //INGORE
                                            expressflag = false;
                                            findend = true;
                                            e = this.createExpression;
                                        }
                                    }
                                }
                                loopnext = false;
                                loopflag = loopcap = true;
                                break;
                            case "function":
                                sflag = true;
                                f = this.createFunction();
                                command.name = "";
                                //command.name = col;
                                break;
                            case "math":
                                mathflag = true;
                                f = this.createFunction();
                                command.name = whichCommand;
                                command.refline = this.currentLine;
                                command.refcol = j+1;
                                //command.name = col;
                                break;
                            case "variable":
                                varname = col.split(":")[1];
                                updatevar = false;
                                vflag = true;
                                //Need to get number or assignment!
                                for(vi in scope) {
                                    if(scope[vi].name === varname) {
                                        //Updating variable.
                                        updatevar = true;
                                        break;
                                    }
                                }
                                if(!updatevar) {
                                    vi = scope.length;
                                    v = this.createVar();
                                    if(varname !== "" && !this.whichCommand(varname)) {
                                        v.name = varname;
                                    } else {
                                        wl.ui.printError("Invalid variable @line " + (i + 1) + "\"" + varname + "\" is a keyword or command!");
                                    }
                                    scope.push(v);
                                }
    
                                break;
                            case "if":
                                nflag = expressflag = true;
                                command.name = "express";
                                e = this.createExpression();
                            break;
                            case "expression":
                                if(expressflag){
                                    logical.push(col);
                                    nflag = true;
                                }else{
                                    wl.ui.printError("Parse error, expexted if or else statement.")
                                }
                            break;
                            case "else":
                                expressflag = true;
                            break;
                            case "stop":
                                wl.ui.addWarning("Program halted by \"stop\" command.");
                                this.stop = true;
                                return false;
                            break;
                            case "lineref":
                                nflag = true;
                                lineref = true;
                            break;
                            case "endlineref":
                                nflag = false;
                                lineref = false;
                            break;
                            default:
                                wl.ui.printError("Invalid command @line " + (i + 1) + "\"" + col + "\"");
                                return false;
                        }
                    } else { 
                        //Not a listed command? Check for function!
                        funcheck = false;
                        for( fnci = 0; fnci < this.fundef.length; fnci++) {
                            if(this.fundef[fnci].name === col) {
                                fcflag = funcheck = true;
                                if(this.fundef[fnci].scope.length > 0) {
                                    fcARGS = true;
                                } else {
                                    fcARGS = false;
                                }
                                break;
                            }
                        }
                        if(!funcheck) {
                            wl.ui.printError("Invalid command @line " + (i + 1) + "\"" + col + "\"");
                            return false;
                        }
                        if(!fcARGS){
                            compcommands = this.compile(this.fundef[fnci].source, {
                                name : this.fundef[fnci].name,
                                scopeVars : this.fundef[fnci].scope
                            });
                            for(fnciObj in compcommands) {
                                commands.push(compcommands[fnciObj]);
                            }
                            funcheck = fcflag = false;
                        }
                    }
                } else {
                    //Get number
                    if(nflag) {
                        n = this.checkMath(cols[j], scope);
                        if(isNaN(n)){
                            n = parseInt(cols[j]);
                        }
                        if(!isNaN(n)) {
                            if(lineref){
                                command.lineref = n;
                            }else{
                                command.number = n;
                            }
                        } else if(this.isVar(cols[j], scope)) {
                            if(lineref){
                                command.lineref = n;
                            }else{
                                command.number = this.getVar(cols[j], scope).val;
                            }
                            //Validate NUMBER?
                        } else {
                            //Parse Error!
                            wl.ui.printError("Parse error: Expected a number! Command: '" + command.name + "' @line:" + (i + 1));
                            return false;
                        }
                        nflag = false;
                        if(command.name === "repeat") {
                            loopflag = true;
                        } else {
                            if(lineref){
                                this.currentLine = command.lineref;
                            }else{
                                if(expressflag){
                                    expressions.push(command.number);
                                }else{
                                    commands.push(command);   
                                }
                            }
                        }
                    }
                    //Get color
                    if(cflag) {
                        c = cols[j];
                        if(this.testColor(c)) {
                            command.color = c;
                            cflag = false;
                            commands.push(command);
                        } else {
                            //Parse Error!!!
                            wl.ui.printError("Parse error: Expected a color! Command: '" + command.name + "' @line:" + (i));
                            return false;
                        }
                    }
                    //Get color
                    if(vflag) {
                        n = parseInt(cols[j]);
                        if(!isNaN(n)) {
                            scope[vi].val = n;
                            vflag = false;
                        } else {
                            //Parse Error!
                            wl.ui.printError("Parse error: Expected a number or color for variable assignment! Variable: '" + scope[vi].name + "' @line:" + (i + 1));
                            return false;
                        }
                    }
                    //Get string name
                    //FUNCTION CALLS
                    if(sflag) {
                        c = cols[j];
                        if(!funcap) {
                            //Get function name
                            if(!this.whichCommand(c) && c !== "") {
                                f.name = c;
                                funSource = "";
                                funcap = true;
                                //commands.push(command);
                            } else {
                                //Parse Error!!!
                                wl.ui.printError("Parse error: Invalid function name! '" + c + "' is a command/keyword!" + (i + 1));
                                return false;
                            }
                        } else {
                            //get function source!
                            if(cols[j] !== "end") {
                                if(funSource.length === 0 && !funArgs) {
                                    //Check for arguments?
                                    if(cols[j].charAt(0) === ":") {
                                        varname = cols[j].split(":")[1];
                                        if(varname !== "") {
                                            v = this.createVar();
                                            v.name = varname;
                                            v.val = "nil";
                                            f.scope.push(v);
                                            funArgs = true;
                                        }
                                    }
                                }if(!funArgs){
                                    if(funSource.length > 0) {
                                        funSource += " ";
                                    }
                                    funSource += cols[j];
                                }
                                funArgs = false;
                            } else {
                                funcap = false;
                                sflag = false;
                                if(funSource.length > 0) {
                                    f.source = funSource;
                                    this.fundef.push(f);
                                    f = this.createFunction();
                                    command = this.createCommand();
                                }
                            }
                        }
                    }
                    if(fcflag) {
                        if(fcARGS) {
                            //Get args
                            //n = parseInt(cols[j]);
                            n = this.checkMath(cols[j], scope);
                            if(isNaN(n)) {
                                if(this.isVar(cols[j], scope)){
                                    tv = this.getVar(cols[j], scope);
                                    n = tv.val;
                                    tname = tv.name
                                }else{
                                    //Error!!!!
                                    n = "nil";
                                    wl.ui.printError("Parse error: Variable '" + cols[j] + "' is undefined per scope '"+ scopename +"'!" + (i + 1));
                                    return false;
                                }
                            }
                            this.fundef[fnci].scope[0].val = n; //This need to check for multi vars...
                        } 
                        compcommands = this.compile(this.fundef[fnci].source, {
                            name : this.fundef[fnci].name,
                            scopeVars : this.fundef[fnci].scope
                        });
                        for(fnciObj in compcommands) {
                            commands.push(compcommands[fnciObj]);
                        }
                        funcheck = fcflag = false;
                        
                    }
                    if(loopflag) {
                        loopSource = "";
                        command.commands = [];
                        loopflag = false;
                        loopnext = true;
                    }
                    if(loopcap) {
                        if(cols[j] !== "]" && parCount < 1) {
                            if(!findend){
                                if(cols[j] == "["){
                                    parCount++;
                                }
                                if(cols[j] == "]"){
                                    parCount--;
                                }
                                if(loopSource.length > 0) {
                                    loopSource += " ";
                                }
                                loopSource += cols[j];

                            }
                        } else {
                            loopcap = false;
                            loopnext = false;
                            if(!findend){
                                if(loopSource.length > 0) {
                                    command.commands = this.compile(loopSource, {
                                        name : scopename,
                                        scopeVars : scope,
                                        refline: i+1,
                                        refcol: j+1
                                    });
                                    command.refline = i+1;
                                    command.refcol = j+1;
                                    commands.push(command);
                                    command = this.createCommand();
                                }
                            }else{
                                findend = false;
                                //igored commands overlooked... false statements are not evaluated. 
                            }
                        }
                    }
                }
            }
        }else{
            wl.ui.addWarning("Parse warning: Processed whitespace @line: "+ i +", ignoring...");
        }
    }
    return commands;
}
wl.Parser.prototype.whichCommand = function(c) {
    var i;
    c = c.toLowerCase();
    if(c === "") {
        wl.ui.printError("Parse error: Invalid white space");
        return false;
    }
    for( i = 0; i < wl.lang.number.length; i++) {
        if(wl.lang.number[i] === c) {
            return "number";
        }
    }
    for( i = 0; i < wl.lang.color.length; i++) {
        if(wl.lang.color[i] === c) {
            return "color";
        }
    }
    for( i = 0; i < wl.lang.logical.length; i++) {
        if(wl.lang.logical[i] === c) {
            return "logical";
        }
    }
    for( i = 0; i < wl.lang.math.length; i++) {
        if(wl.lang.logical[i] === c) {
            return "math";
        }
    }
    for( i = 0; i < wl.lang.expression.length; i++) {
        if(wl.lang.expression[i] === c) {
            return "expression";
        }
    }
    if(c === "[") {
        return "cap";
    }
    if(c === "to") {
        return "function";
    }
    if(c.charAt(0) === ":") {
        return "variable";
    }
    if(c === "if") {
        return "if";
    }
    if(c === "else"){
        return "else"
    }
    if(c === "stop"){
        return "stop";
    }
    if(c === "{_&"){
        return "lineref";
    }
    if(c === "&_}"){
        return "endlineref";
    }
    return false;
};
wl.Parser.prototype.isVar = function(c, scope) {
    return this.getVar(c, scope) !== false;
}
wl.Parser.prototype.getVar = function(c, scope) {
    var i, vr;

    for(i in scope) {
        if(":" + scope[i].name === c) {
            return scope[i];
        }
    }//Search global scope if not found in local scope
    if(scope != this.vardef) {
        for(i in this.vardef) {
            if(":" + this.vardef[i].name === c) {
                return this.vardef[i];
            }
        }
    }
    return false;
}
wl.Parser.prototype.testColor = function(c) {
    var success = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(c);
    if(!success) {
        for( i = 0; i < wl.lang.colors.length; i++) {
            if(wl.lang.colors[i] === c) {
                return true;
            }
        }
    }
    return success;
};
wl.Parser.prototype.checkMath = function(c, scope){
    var m, d, a, s, math, flag, v, e, vn, nm;
    flag = false;
    v = "";
    e = 0;
    vn = "";
    mathc= "";
    for(var i = 0; i < c.length + 1; i++){
        if(flag){
            nm = c.charAt(i);
            if(isNaN(nm) && nm !== "+" && nm !== "-"&& nm !== "*"&& nm !== "/" && nm !== "(" && nm !== ")" && nm !== "."){
                v += c.charAt(i);     
            }else{
                e = i - 1;   
                for(var x = 0; x < scope.length; x++){
                    if(scope[x].name === v){
                        vn = scope[x].val;
                        break;
                    }
                }
                if(vn === ""){
                    wl.ui.printError("Parse error: Undefined variable in math parser! '" + v + "'");
                    return false;
                } 
                mathc = c.replace(":"+v, vn);
            }
        }
        if(c.charAt(i) === ":"){
            flag = true;
        }
    }
    if(mathc !== ""){
        c = mathc;
    }
    math = eval(c);
    if(!isNaN(math)){
        return math;
    }
    return false;
    /*
      a = c.split("+");
    if(a.length > 0){
        math = a;
    }
    m = c.split("*");
    d = c.split("/");
    s = c.split("-");
    */
}
wl.Parser.prototype.getErrors = function() {
    return this.err;
};
