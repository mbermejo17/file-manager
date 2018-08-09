function $u(selector){
    var self = {};
    var aSelf = [];
    self.selector = selector;
    if(selector.indexOf('.') == 0 || selector.indexOf('#') == 0 ) {
        self.element = document.querySelector(self.selector);
    } else {
        aSelf = document.querySelectorAll(self.selector);
    }

    self.html = function(){
        return self.element;
    }
    self.attr = function(name,value){
        if(!value) return self.element.getAttribute(name);
        self.element.setAttribute(name,value);
        return self;
    }
    self.height = function(){
        return self.element.offsetHeight;
    }
    self.width = function(){
        return self.element.offsetWidth;
    }
    self.parent = function(){
        self.element = self.element.parentNode;
        return self;
    }
    self.children = function(key){
        if(!key) key = 0;
        self.element = self.element.childNodes(key);
        return self;
    }
    self.on = function(type,callback){
        self.element.addEventListener(type,callback);
        return self;
    }
    self.hasClass = function(className){
        return self.className.match(/\bclassName\b/);
        //return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
    }
    self.addClass = function(className){
        if ((" " + self.className + " ").indexOf(" " + className + " ") > -1) self.classList.add(className);
        return self;
    }
    self.removeClass = function(className){
        if ((" " + self.className + " ").indexOf(" " + className + " ") > -1) self.classList.remove(className);
        return self;
    }
    self.css = function(cssText) {
        self.style.cssText = cssText;
        return self;
    }
    self.show = function(){
        self.element.style.display = 'block';
        return self;
    }
    self.hide = function(){
        self.element.style.display = 'none';
        return self;
    }
    return self;
}