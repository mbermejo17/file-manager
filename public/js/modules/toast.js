;(function(root, factory) {
  try {
    // commonjs
    if (typeof exports === 'object') {
      module.exports = factory();
    // global
    } else {
      root.toast = factory();
    }
  } catch(error) {
    console.log('Isomorphic compatibility is not supported at this time for toast.')
  }
})(this, function() {

  // We need DOM to be ready
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }

  // Create toast object
  toast = {
    // In case toast creation is attempted before dom has finished loading!
    create: function() {
      console.error([
        'DOM has not finished loading.',
        '\tInvoke create method when DOM\s readyState is complete'
      ].join('\n'))
    }
  };
  var autoincrement = 0;

  // Initialize library
  function init() {
    // Toast container
    var container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);

    // @Override
    // Replace create method when DOM has finished loading
    toast.create = function(options) {
      var toast = document.createElement('div');
      toast.id = ++autoincrement;
      toast.id = 'toast-' + toast.id;
      toast.className = 'toast-toast';

      // title
      if (options.title) {
        var h4 = document.createElement('h4');
        var _iconText = '';
        // icon
        if(options.icon) {
          _iconText = '<i class="';
          if (options.type ==='success') {
            _iconText += 'fas fa-check-circle icon-' + options.type + '"></i>';
          } else if(options.type ==='warning') {
            _iconText += 'fas fa-exclamation-triangle icon-' + options.type + '"></i>';
          } else if(options.type ==='error'){
            _iconText += 'fas fa-exclamation-circle icon-' + options.type + '"></i>';
          } else if(options.type ==='info'){
            _iconText += 'fas fa-info-circle icon-' + options.type + '"></i>';
          }
        }
        console.log('iconText: ',_iconText);
        h4.className = 'toast-title';
        h4.innerHTML = _iconText + options.title;
        toast.appendChild(h4);
      }  
      
      // text
      if (options.text) {
        var p = document.createElement('p');
        p.className = 'toast-text';
        p.innerHTML = options.text;
        toast.appendChild(p);
      }

      // click callback
      if (typeof options.callback === 'function') {
        toast.addEventListener('click', options.callback);
      }

      // toast api
      toast.hide = function() {
        toast.className += ' toast-fadeOut';
        toast.addEventListener('animationend', removeToast, false);
      };

      // autohide
      if (options.timeout) {
        setTimeout(toast.hide, options.timeout);
      }  else {
        setTimeout(toast.hide, 3000);
      }

      if (options.type) {
        toast.className += ' toast-' + options.type;
      }

      toast.addEventListener('click', toast.hide);


      function removeToast() {
        document.getElementById('toast-container').removeChild(toast);
      }

      document.getElementById('toast-container').appendChild(toast);
      return toast;

    }
  }

  return toast;

});