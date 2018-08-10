function $u(selector) {
    var self = {};
    self.selector = selector;
    self.element = document.querySelector(self.selector);

    self.attr = function(name, value) {
        if (!value) return self.element.getAttribute(name);
        self.element.setAttribute(name, value);
        return self;
    };
    self.html = function(htmlContent) {
        if (htmlContent) { 
            self.element.innerHTML = htmlContent;
            return self;
        } else {
            return self.element.innerHTML;
        }
    };

    self.trigger = function(eventName) {
      self.element[eventName]();
      return self;
    };

    self.val = function(valText) {
        console.log(self);
        if(valText) {
          self.element.value = valText;
          return self;
        } else {
          return self.element.value;
        }
    };

    self.height = function() {
        return self.element.offsetHeight;
    };

    self.width = function() {
        return self.element.offsetWidth;
    };

    self.parent = function() {
        self.element = self.element.parentNode;
        return self;
    };

    self.children = function(key) {
        if (!key) key = 0;
        self.element = self.element.childNodes(key);
        return self;
    };

    self.on = function(type, callback) {
        if (selector.indexOf('.') == 0 || selector.indexOf('.')) {
        [].forEach.call(document.querySelectorAll(selector), function(el) {
                el.addEventListener(type, function(e) {
                    callback(e);
                });
            });
        }
        return self;
    };

    self.hasClass = function(className) {
       console.log(selector);
       if(selector.indexOf('#') === 0) { 
            return self.element.classList ? self.element.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(self.element.className);
       }
    };

    self.addClass = function(className) {
      if(selector.indexOf('#') == 0) { 
        if (self.element.classList)
            self.element.classList.add(className);
        else
            self.element.className += ' ' + className;
      } else {
        [].forEach.call(document.querySelectorAll(selector), function(el) {
            if (el.classList)
                el.classList.add(className);
            else
                el.className += ' ' + className;
            });
      }      
    return self;
    };

    self.removeClass = function(className) {
      if(selector.indexOf('#') == 0) { 
        if (self.element.classList)
            self.element.classList.remove(className);
        else
            self.element.className = self.element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      } else {
        [].forEach.call(document.querySelectorAll(selector), function(el) {
            if (el.element.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            });

      }
            return self;
    };

    self.css = function(cssText) {
        self.style = cssText;
        return self;
    };

    self.show = function() {

        self.element.style.display = 'block';
        return self;
    };

    self.hide = function() {
        self.element.style.display = 'none';
        return self;
    };

    return self;
}