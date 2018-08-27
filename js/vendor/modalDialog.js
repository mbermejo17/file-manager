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
    ".modal-dialog-alert: ",
    document.querySelector(".modal-dialog-alert")
  );

  //if (window.modalDialogAlert.element) delete window.modalDialogAlert;
  if(document.querySelector('#modal-dialog-alert-wrap')) {
    let el = document.querySelector('#modal-dialog-alert-wrap');
    el.parentNode.removeChild(el);
  }
  if (document.querySelector(".modal-dialog-alert")) {
    let el = document.querySelector(".modal-dialog-alert");
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
    ModalDialogObject.element = document.querySelector(".modal-dialog-alert");
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
  ModalDialogObject.cancel =
    options.cancel !== undefined ? options.cancel : false;
  ModalDialogObject.cancelText =
    options.cancelText !== undefined ? options.cancelText : "Cancel";
  ModalDialogObject.cancelCallBack = function(event) {
    document.body.classList.remove("modal-dialog-open");
    window.modalDialogAlert.element.style.display = "none";
    // Cancel callback
    if (typeof options.cancelCallBack === "function") {
      let el = document.querySelector('#modal-dialog-alert-wrap');
      el.parentNode.removeChild(el);
      options.cancelCallBack(event);
    }

    // Cancelled
    return false;
  };

  // Close alert on click outside
  if (document.querySelector(".modal-dialog-alert-mask")) {
    document
      .querySelector(".modal-dialog-alert-mask")
      .addEventListener("click", function(event) {
        document.body.classList.remove("modal-dialog-open");
        window.modalDialogAlert.element.style.display = "none";
        // Cancel callback
        if (typeof options.cancelCallBack === "function") {
          let el = document.querySelector('#modal-dialog-alert-wrap');
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
      let el = document.querySelector('#modal-dialog-alert-wrap');
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

  ModalDialogObject.modalClose = function(event) {
    let el = document.querySelector('#modal-dialog-alert-wrap');
    el.parentNode.removeChild(el);
    /* document.body.classList.remove("modal-dialog-open");
    window.modalDialogAlert.element.style.display = "none"; */
  };

  if (!ModalDialogObject.element) {
    let htmlContent = "";

    htmlContent =
      '<div class="modal-dialog-alert" id="modal-dialog-alert">' +
      '<div class="modal-dialog-alert-mask"></div>' +
      '<div class="modal-dialog-alert-message-body" aria-relevant="all">' +
      '<div class="modal-dialog-alert-message-tbf modal-dialog-alert-message-title">' +
      ModalDialogObject.title +
      "</div>" +
      '<a class="modal_close" id="modalClose" href="#"></a>';

    console.log("ModalDialogObject.type: ", ModalDialogObject.type);
    if (ModalDialogObject.type == "prompt") {
      messageContent =
        '<div class="modal-dialog-alert-message-tbf modal-dialog-alert-message-content">' +
        '<div class="input-field">' +
        '<input id="inputId" class="modal-dialog-input" type="text">' +
        '<label for="inputId" class="modal-dialog-label">' +
        ModalDialogObject.message +
        "</label>" +
        "</div>" +
        "</div>";

      htmlContent +=
        messageContent +
        '<div class="modal-dialog-alert-message-tbf modal-dialog-alert-message-button">';
    } else {
      htmlContent =
        htmlContent +
        '<div class="modal-dialog-alert-message-tbf modal-dialog-alert-message-content">' +
        ModalDialogObject.message +
        "</div>" +
        '<div class="modal-dialog-alert-message-tbf modal-dialog-alert-message-button">';
    }

    if (ModalDialogObject.cancel || true) {
      htmlContent +=
        '<a href="javascript:;" class="btn2-unify modal-dialog-alert-message-tbf modal-dialog-alert-message-button-cancel"  id="ModalDialog-button-cancel">' +
        ModalDialogObject.cancelText +
        "</a>";
    }

    if (ModalDialogObject.confirm || true) {
      htmlContent +=
        '<a href="javascript:;" class="btn2-unify modal-dialog-alert-message-tbf modal-dialog-alert-message-button-confirm" id="ModalDialog-button-confirm">' +
        ModalDialogObject.confirmText +
        "</a>";
    }

    htmlContent += "</div></div></div>";
    ModalDialogObject.html = htmlContent;

    var element = document.createElement("div");
    element.id = "modal-dialog-alert-wrap";
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    ModalDialogObject.modalClose = document.querySelector("#modalClose");
    ModalDialogObject.element = document.querySelector(".modal-dialog-alert");
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

    ModalDialogObject.modalClose.onclick = ModalDialogObject.modalClose;
    ModalDialogObject.cancelElement.onclick = ModalDialogObject.cancelCallBack;
    ModalDialogObject.confirmElement.onclick =
      ModalDialogObject.confirmCallBack;

    window.modalDialogAlert = ModalDialogObject;
  }

  document.querySelector(".modal-dialog-alert-message-title").innerHTML = "";
  document.querySelector(".modal-dialog-alert-message-content").innerHTML = "";
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

  document.querySelector(".modal-dialog-alert-message-title").innerHTML =
    ModalDialogObject.title;
  document.querySelector(
    ".modal-dialog-alert-message-content"
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
  window.modalDialogAlert = ModalDialogObject;
}
