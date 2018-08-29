/* jshint laxbreak: true */
/* experimental: [asyncawait, asyncreqawait] */

export function modalDialog(title, message, options) {
  "use strict";

  let messageContent = "";
  //let ModalDialogObject = {};

  if (typeof options !== "object") {
    options = {};
  }

  console.log("window.modalDialogAlert: ", window.modalDialogAlert);
  console.log(
    ".ModalDialog-alert: ",
    document.querySelector(".ModalDialog-alert")
  );

  //if (window.modalDialogAlert.element) delete window.modalDialogAlert;
  if(document.querySelector('#ModalDialog-wrap')) {
    let el = document.querySelector('#ModalDialog-wrap');
    el.parentNode.removeChild(el);
  }
  if (document.querySelector(".ModalDialog-alert")) {
    let el = document.querySelector(".ModalDialog-alert");
    el.parentNode.removeChild(el);
  }

  if (window.modalDialogAlert) {
    if (window.modalDialogAlert.element) delete window.modalDialogAlert;
    delete window.modalDialogAlert;
  }
  if (!window.modalDialogAlert) {
    var ModalDialogObject = {
      element: null,
      cancelElement: null,
      confirmElement: null
    };
    ModalDialogObject.element = document.querySelector("#ModalDialog-alert");
  }
  /* else {
         // Clear style
         if (window.modalDialogAlert.cancel) {
             window.modalDialogAlert.cancelElement.style = '';
         }
         if (window.modalDialogAlert.confirm) {
             window.modalDialogAlert.confirmElement.style = '';
         }
         // Show alert
         document.body.classList.add('modal-dialog-open');
         window.modalDialogAlert.element.style.display = 'block';

         ModalDialogObject = window.modalDialogAlert;
     } */

  // Define default options
  ModalDialogObject.type =
    options.type !== undefined ? options.type : "OkCancel";
    ModalDialogObject.width =
    options.width !== undefined ? options.width : '640px';  
  ModalDialogObject.cancel =
    options.cancel !== undefined ? options.cancel : false;
  ModalDialogObject.cancelText =
    options.cancelText !== undefined ? options.cancelText : "Cancel";
  ModalDialogObject.cancelCallBack = function(event) {
    document.body.classList.remove("modal-dialog-open");
    window.modalDialogAlert.element.style.display = "none";
    // Cancel callback
    if (typeof options.cancelCallBack === "function") {
      let el = document.querySelector('#ModalDialog-wrap');
      el.parentNode.removeChild(el);
      options.cancelCallBack(event);
    }

    // Cancelled
    return false;
  };

  // Close alert on click outside
  if (document.querySelector(".ModalDialog-mask")) {
    document
      .querySelector(".ModalDialog-mask")
      .addEventListener("click", function(event) {
        document.body.classList.remove("modal-dialog-open");
        window.modalDialogAlert.element.style.display = "none";
        // Cancel callback
        if (typeof options.cancelCallBack === "function") {
          let el = document.querySelector('#ModalDialog-wrap');
          el.parentNode.removeChild(el);
          options.cancelCallBack(event);
        }
        // Clicked outside
        return false;
      });
  }

  ModalDialogObject.message = message;
  ModalDialogObject.title = title;
  ModalDialogObject.confirm =
    options.confirm !== undefined ? options.confirm : true;
  ModalDialogObject.confirmText =
    options.confirmText !== undefined ? options.confirmText : "Confirm";
  ModalDialogObject.confirmCallBack = function(event) {
    document.body.classList.remove("modal-dialog-open");
    window.modalDialogAlert.element.style.display = "none";
    // Confirm callback
    if (typeof options.confirmCallBack === "function") {
      let el = document.querySelector('#ModalDialog-wrap');
      el.parentNode.removeChild(el);
      if (ModalDialogObject.type === "prompt") {
        options.confirmCallBack(event, ModalDialogObject.inputId.value.trim());
      } else {
        options.confirmCallBack(event);
      }
    }

    // Confirmed
    return true;
  };

  ModalDialogObject.ModalClose = function(event) {
    let el = document.querySelector('#ModalDialog-wrap');
    el.parentNode.removeChild(el);
    /* document.body.classList.remove("modal-dialog-open");
    window.modalDialogAlert.element.style.display = "none"; */
  };

  if (!ModalDialogObject.element) {
    let htmlContent = "";

    htmlContent =
    '<div class="ModalDialog-alert" id="ModalDialog-alert">' + 
    '<div class="ModalDialog-mask"></div>' +
    '<div class="ModalDialog-body" aria-relevant="all">' +
      '<div class="ModalDialog-title">'+
        ModalDialogObject.title +
      '</div>' +
      '<a class="ModalDialog-close" id="ModalDialogClose" href="#"></a>';

    console.log("ModalDialogObject.type: ", ModalDialogObject.type);
    if (ModalDialogObject.type == "prompt") {
      messageContent =
      '<div class="ModalDialog-container">' +
        '<div class="ModalDialog-content" id="ModalDialog-content">' +
          '<div class="input-field">' +
            '<input id="inputId" class="ModalDialog-input" type="text">' +
            '<label for="inputId" class="ModalDialog-label">' +
                            ModalDialogObject.message +
             "</label>" +
          "</div>" +
        "</div></div>";

      htmlContent +=
        messageContent +
        '<div class="ModalDialog-button">';
    } else {
      messageContent = 
      '<div class="ModalDialog-container">' +
        '<div class="ModalDialog-content" id="ModalDialog-content">' +
            ModalDialogObject.message +
        '</div>'+
      '</div>';
      
      htmlContent +=
        messageContent +
        '<div class="ModalDialog-button">';
    }

    if (ModalDialogObject.cancel || true) {
      htmlContent +=
        '<a href="javascript:;" class="btn2-unify ModalDialog-button-cancel"  id="ModalDialog-button-cancel">' +
        ModalDialogObject.cancelText +
        "</a>";
    }

    if (ModalDialogObject.confirm || true) {
      htmlContent +=
        '<a href="javascript:;" class="btn2-unify ModalDialog-button-confirm" id="ModalDialog-button-confirm">' +
        ModalDialogObject.confirmText +
        "</a>";
    }

    htmlContent += "</div></div></div>";
    ModalDialogObject.html = htmlContent;

    var element = document.createElement("div");
    element.id = "ModalDialog-wrap";
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    ModalDialogObject.modalClose = document.querySelector("#ModalDialogClose");
    ModalDialogObject.element = document.querySelector(".ModalDialog-alert");
    ModalDialogObject.cancelElement = document.querySelector(
      "#ModalDialog-button-cancel"
    );

    // Enabled cancel button callback
    if (ModalDialogObject.cancel) {
      document.querySelector("#ModalDialog-button-cancel").style.display =
        "block";
    } else {
      document.querySelector("#ModalDialog-button-cancel").style.display =
        "none";
    }

    // Enabled cancel button callback
    ModalDialogObject.confirmElement = document.querySelector(
      "#ModalDialog-button-confirm"
    );
    if (ModalDialogObject.confirm) {
      document.querySelector("#ModalDialog-button-confirm").style.display =
        "block";
    } else {
      document.querySelector("#ModalDialog-button-confirm").style.display =
        "none";
    }

    ModalDialogObject.modalClose.onclick = ModalDialogObject.ModalClose;
    ModalDialogObject.cancelElement.onclick = ModalDialogObject.cancelCallBack;
    ModalDialogObject.confirmElement.onclick =
      ModalDialogObject.confirmCallBack;

    window.modalDialogAlert = ModalDialogObject;
  }

  document.querySelector(".ModalDialog-title").innerHTML = "";
  document.querySelector(".ModalDialog-content").innerHTML = "";
  document.querySelector("#ModalDialog-button-cancel").innerHTML =
    ModalDialogObject.cancelText;
  document.querySelector("#ModalDialog-button-confirm").innerHTML =
    ModalDialogObject.confirmText;

  ModalDialogObject.cancelElement = document.querySelector(
    "#ModalDialog-button-cancel"
  );

  // Enabled cancel button callback
  if (ModalDialogObject.cancel) {
    document.querySelector("#ModalDialog-button-cancel").style.display =
      "block";
  } else {
    document.querySelector("#ModalDialog-button-cancel").style.display = "none";
  }

  // Enabled cancel button callback
  ModalDialogObject.confirmElement = document.querySelector(
    "#ModalDialog-button-confirm"
  );
  if (ModalDialogObject.confirm) {
    document.querySelector("#ModalDialog-button-confirm").style.display =
      "block";
  } else {
    document.querySelector("#ModalDialog-button-confirm").style.display =
      "none";
  }
  ModalDialogObject.cancelElement.onclick = ModalDialogObject.cancelCallBack;
  ModalDialogObject.confirmElement.onclick = ModalDialogObject.confirmCallBack;

  // Set title and message
  ModalDialogObject.title = ModalDialogObject.title || "";
  ModalDialogObject.message = ModalDialogObject.message || "";

  document.querySelector(".ModalDialog-title").innerHTML =
    ModalDialogObject.title;
  document.querySelector(
    ".ModalDialog-content"
  ).innerHTML = messageContent;
  if (ModalDialogObject.type === "prompt") {
    ModalDialogObject.inputId = document.querySelector("#inputId");
    document.getElementById("inputId").addEventListener("keyup", e => {
      e.preventDefault();
      if (e.keyCode === 13) {
        document.getElementById("ModalDialog-button-confirm").click();
      }
    });
  }
  document.querySelector(".ModalDialog-body").style.width = ModalDialogObject.width;
  window.modalDialogAlert = ModalDialogObject;
}
