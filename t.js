;(function() {
  "use strict";
 /*
  * This code only for toggling ARIA attributes
  */
  
  const switcherLabels = document.querySelectorAll(".jsSwitcher");
  const SWITCHER_CHECKED_ATTRIBUTE = "aria-checked";
  
  /*Adding EventListeners*/
  switcherLabels.forEach(function(v) {
    const inpt = v.querySelector("[type=checkbox]");
    inpt.addEventListener("change", switcherLabelOnClick);
  });
  
  /*Event Listeners*/
  function switcherLabelOnClick(e) {
    const current = e.currentTarget.parentElement;
    const isChecked = current.getAttribute(SWITCHER_CHECKED_ATTRIBUTE) === "true";
 
    current.setAttribute(SWITCHER_CHECKED_ATTRIBUTE, !isChecked);
  };
  
})();