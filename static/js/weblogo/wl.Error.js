/* WL - Error Class
* Written by Patrick Simpson
*/
wl.Error = function(){
  //Drawning Constructor
  this.errors = [];
};

wl.Error.prototype.add = function(e){
    this.errors.push(e)
};
wl.Error.prototype.addAll = function(a){
    for(i in a){
        this.errors.push(a[i]);
    }
}
wl.Error.prototype.get = function(){
    return this.errors;
};

wl.Error.prototype.clear = function(){
    this.errors = [];
};
wl.Error.prototype.count = function(){
    return this.errors.length;
};

wl.Error.prototype.find = function(i){
    if(i < this.errors.length){
        return this.errors[i];
    }
};
wl.Error.prototype.print = function(){
    for(i in this.errors){
        wl.ui.printError(this.errors[i]);
    }
}
