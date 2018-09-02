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
  if (document.querySelector("#ModalDialog-wrap")) {
    let el = document.querySelector("#ModalDialog-wrap");
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

  // Define default options
  ModalDialogObject.type =
    options.type !== undefined ? options.type : "OkCancel";
  ModalDialogObject.width =
    options.width !== undefined ? options.width : "640px";
  ModalDialogObject.cancel =
    options.cancel !== undefined ? options.cancel : false;
  ModalDialogObject.cancelText =
    options.cancelText !== undefined ? options.cancelText : "Cancel";
    ModalDialogObject.confirm =
    options.confirm !== undefined ? options.confirm : true;
  ModalDialogObject.confirmText =
    options.confirmText !== undefined ? options.confirmText : "Confirm"; 
    
  ModalDialogObject.cancelCallBack = function(event) {
    document.body.classList.remove("modal-dialog-open");
    window.modalDialogAlert.element.style.display = "none";
    // Cancel callback
    if (typeof options.cancelCallBack === "function") {
      let el = document.querySelector("#ModalDialog-wrap");
      el.parentNode.removeChild(el);
      options.cancelCallBack(event);
    }

    // Cancelled
    return false;
  };

  // Close alert on click outside
  /* if (document.querySelector(".ModalDialog-mask")) {
    document
      .querySelector(".ModalDialog-mask")
      .addEventListener("click", function(event) {
        document.body.classList.remove("modal-dialog-open");
        window.modalDialogAlert.element.style.display = "none";
        // Cancel callback
        if (typeof options.cancelCallBack === "function") {
          let el = document.querySelector("#ModalDialog-wrap");
          el.parentNode.removeChild(el);
          options.cancelCallBack(event);
        }
        // Clicked outside
        return false;
      });
  } */

  ModalDialogObject.message = message;
  ModalDialogObject.title = title;
 
  ModalDialogObject.confirmCallBack = function(event) {
    document.body.classList.remove("modal-dialog-open");
    window.modalDialogAlert.element.style.display = "none";

    // Confirm callback
    if (typeof options.confirmCallBack === "function") {
      let el = document.querySelector("#ModalDialog-wrap");
      el.parentNode.removeChild(el);
      if (ModalDialogObject.type === "prompt") {

        options.confirmCallBack(event, ModalDialogObject.inputId.value.trim());
      } else {
        if (ModalDialogObject.type === "changePassword") {
          console.log(ModalDialogObject.newpassword);
          options.confirmCallBack(
            event,
            ModalDialogObject.newpassword.value.trim(),
            ModalDialogObject.newpassword2.value.trim()
          );
        } else {
          options.confirmCallBack(event);
        }
      }
    }

    // Confirmed
    return true;
  };

  ModalDialogObject._IfUsed = function(event){
    let el = event.target;
    if (el.value.trim() !==''){
      el.classList.add('used');
    } else {
      el.classList.remove('used');
    }
  };

  // Button Close Window Dialog
  ModalDialogObject.ModalClose = function(event) {
    let el = document.querySelector("#ModalDialog-wrap");
    el.parentNode.removeChild(el);
    /* document.body.classList.remove("modal-dialog-open");
    window.modalDialogAlert.element.style.display = "none"; */
  };


  // Window Dialog content
  if (!ModalDialogObject.element) {
    let htmlContent = "";

    htmlContent =
      '<div class="ModalDialog-alert" id="ModalDialog-alert">' +
        '<div class="ModalDialog-mask"></div>' +
        '<div class="ModalDialog-body" aria-relevant="all">' +
          '<div class="ModalDialog-title">' +
            ModalDialogObject.title +
          "</div>" +
          '<a class="ModalDialog-close" id="ModalDialogClose" href="#"></a>';

    console.log("ModalDialogObject.type: ", ModalDialogObject.type);

    // Body content
    if (ModalDialogObject.type == "prompt") {
      messageContent =
        '<div class="ModalDialog-container">' +
          '<div class="ModalDialog-content" id="ModalDialog-content">' +
            '<div class="ModalDialog-input-field">' +
              '<input id="inputId" class="ModalDialog-input" type="text">' +
              '<label for="inputId" class="ModalDialog-label">' +
                ModalDialogObject.message +
              '</label>' +
            '</div>' +
          '</div>' +
        '</div>';
  
     
    } else {
      if (ModalDialogObject.type == "changePassword") {
        messageContent = 
        '<div class="ModalDialog-container">' +
          '<div class="ModalDialog-content" id="ModalDialog-content">' + 
            ModalDialogObject.message + 
          '</div>'+
        '</div>';
      } else {
        messageContent =
          '<div class="ModalDialog-container">' +
            '<div class="ModalDialog-content" id="ModalDialog-content">' +
              ModalDialogObject.message +
            '</div>' +
          '</div>';
      }
    }

    // Button container content 
    htmlContent += messageContent + 
    '<div class="ModalDialog-button">'; 
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

    htmlContent += '</div></div></div>';
    ModalDialogObject.html = htmlContent;


    // Add content to DOM
    var element = document.createElement("div");
    element.id = "ModalDialog-wrap";
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    ModalDialogObject.modalClose = document.querySelector("#ModalDialogClose");
    ModalDialogObject.element = document.querySelector(".ModalDialog-alert");
    ModalDialogObject.cancelElement = document.querySelector("#ModalDialog-button-cancel");
    ModalDialogObject.confirmElement = document.querySelector("#ModalDialog-button-confirm");

    if (ModalDialogObject.type === "prompt") {
      ModalDialogObject.inputId = document.querySelector("#inputId");
      ModalDialogObject.inputId.onblur = ModalDialogObject._IfUsed;
    }  
   if (ModalDialogObject.type === "changePassword") {
      ModalDialogObject.newpassword = document.querySelector("#newpassword");
      ModalDialogObject.newpassword2 = document.querySelector("#newpassword2");
      ModalDialogObject.newpassword.onblur = ModalDialogObject._IfUsed;
      ModalDialogObject.newpassword2.onblur = ModalDialogObject._IfUsed;
   }

    // Enabled cancel button callback
    if (ModalDialogObject.cancel) {
      document.querySelector("#ModalDialog-button-cancel").style.display = "block";
    } else {
      document.querySelector("#ModalDialog-button-cancel").style.display = "none";
    }

    // Enabled cancel button callback
    if (ModalDialogObject.confirm) {
      document.querySelector("#ModalDialog-button-confirm").style.display = "block";
    } else {
      document.querySelector("#ModalDialog-button-confirm").style.display = "none";
    }



    ModalDialogObject.modalClose.onclick = ModalDialogObject.ModalClose;
    ModalDialogObject.cancelElement.onclick = ModalDialogObject.cancelCallBack;
    ModalDialogObject.confirmElement.onclick = ModalDialogObject.confirmCallBack;

    window.modalDialogAlert = ModalDialogObject;
  }

  
}
