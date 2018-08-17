
export function modalDialog(title, message, options) {
  'use strict';

  if (typeof options !== 'object') {
      options = {};
  }

  if (!window.modalDialogAlert) {
      var ModalDialogObject = {
          element: null,
          cancelElement: null,
          confirmElement: null
      };
      ModalDialogObject.element = document.querySelector('.modal-dialog-alert');
  } else {
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
  }

  // Define default options
  ModalDialogObject.cancel = options.cancel !== undefined ? options.cancel : false;
  ModalDialogObject.cancelText = options.cancelText !== undefined ? options.cancelText : 'Cancel';
  ModalDialogObject.cancelCallBack = function (event) {
      document.body.classList.remove('modal-dialog-open');
      window.modalDialogAlert.element.style.display = 'none';
      // Cancel callback
      if (typeof options.cancelCallBack === 'function') {
          options.cancelCallBack(event);
      }

      // Cancelled
      return true;
  };

  // Close alert on click outside
  if (document.querySelector('.modal-dialog-alert-mask')) {
      document.querySelector('.modal-dialog-alert-mask').addEventListener('click', function (event) {
          document.body.classList.remove('modal-dialog-open');
          window.modalDialogAlert.element.style.display = 'none';
          // Cancel callback
          if (typeof options.cancelCallBack === 'function') {
              options.cancelCallBack(event);
          }

          // Clicked outside
          return true;
      });
  }

  ModalDialogObject.message = message;
  ModalDialogObject.title = title;
  ModalDialogObject.confirm = options.confirm !== undefined ? options.confirm : true;
  ModalDialogObject.confirmText = options.confirmText !== undefined ? options.confirmText : 'Confirm';
  ModalDialogObject.confirmCallBack = function (event) {
      document.body.classList.remove('modal-dialog-open');
      window.modalDialogAlert.element.style.display = 'none';
      // Confirm callback
      if (typeof options.confirmCallBack === 'function') {
          options.confirmCallBack(event);
      }

      // Confirmed
      return true;
  };

  if (!ModalDialogObject.element) {
    ModalDialogObject.html =
          '<div class="modal-dialog-alert" id="modal-dialog-alert" role="alertdialog">' +
          '<div class="modal-dialog-alert-mask"></div>' +
          '<div class="modal-dialog-alert-message-body" role="alert" aria-relevant="all">' +
          '<div class="modal-dialog-alert-message-tbf modal-dialog-alert-message-title">' +
          ModalDialogObject.title +
          '</div>' +
          '<div class="modal-dialog-alert-message-tbf modal-dialog-alert-message-content">' +
          ModalDialogObject.message +
          '</div>' +
          '<div class="modal-dialog-alert-message-tbf modal-dialog-alert-message-button">';

      if (ModalDialogObject.cancel || true) {
        ModalDialogObject.html += '<a href="javascript:;" class="modal-dialog-alert-message-tbf modal-dialog-alert-message-button-cancel">' + ModalDialogObject.cancelText + '</a>';
      }

      if (ModalDialogObject.confirm || true) {
        ModalDialogObject.html += '<a href="javascript:;" class="modal-dialog-alert-message-tbf modal-dialog-alert-message-button-confirm">' + ModalDialogObject.confirmText + '</a>';
      }

      ModalDialogObject.html += '</div></div></div>';

      var element = document.createElement('div');
      element.id = 'modal-dialog-alert-wrap';
      element.innerHTML = ModalDialogObject.html;
      document.body.appendChild(element);

      ModalDialogObject.element = document.querySelector('.modal-dialog-alert');
      ModalDialogObject.cancelElement = document.querySelector('.modal-dialog-alert-message-button-cancel');

      // Enabled cancel button callback
      if (ModalDialogObject.cancel) {
          document.querySelector('.modal-dialog-alert-message-button-cancel').style.display = 'block';
      } else {
          document.querySelector('.modal-dialog-alert-message-button-cancel').style.display = 'none';
      }

      // Enabled cancel button callback
      ModalDialogObject.confirmElement = document.querySelector('.modal-dialog-alert-message-button-confirm');
      if (ModalDialogObject.confirm) {
          document.querySelector('.modal-dialog-alert-message-button-confirm').style.display = 'block';
      } else {
          document.querySelector('.modal-dialog-alert-message-button-confirm').style.display = 'none';
      }

      ModalDialogObject.cancelElement.onclick = ModalDialogObject.cancelCallBack;
      ModalDialogObject.confirmElement.onclick = ModalDialogObject.confirmCallBack;

      window.modalDialogAlert = ModalDialogObject;
  }

  document.querySelector('.modal-dialog-alert-message-title').innerHTML = '';
  document.querySelector('.modal-dialog-alert-message-content').innerHTML = '';
  document.querySelector('.modal-dialog-alert-message-button-cancel').innerHTML = ModalDialogObject.cancelText;
  document.querySelector('.modal-dialog-alert-message-button-confirm').innerHTML = ModalDialogObject.confirmText;

  ModalDialogObject.cancelElement = document.querySelector('.modal-dialog-alert-message-button-cancel');

  // Enabled cancel button callback
  if (ModalDialogObject.cancel) {
      document.querySelector('.modal-dialog-alert-message-button-cancel').style.display = 'block';
  } else {
      document.querySelector('.modal-dialog-alert-message-button-cancel').style.display = 'none';
  }

  // Enabled cancel button callback
  ModalDialogObject.confirmElement = document.querySelector('.modal-dialog-alert-message-button-confirm');
  if (ModalDialogObject.confirm) {
      document.querySelector('.modal-dialog-alert-message-button-confirm').style.display = 'block';
  } else {
      document.querySelector('.modal-dialog-alert-message-button-confirm').style.display = 'none';
  }
  ModalDialogObject.cancelElement.onclick = ModalDialogObject.cancelCallBack;
  ModalDialogObject.confirmElement.onclick = ModalDialogObject.confirmCallBack;

  // Set title and message
  ModalDialogObject.title = ModalDialogObject.title || '';
  ModalDialogObject.message = ModalDialogObject.message || '';

  document.querySelector('.modal-dialog-alert-message-title').innerHTML = ModalDialogObject.title;
  document.querySelector('.modal-dialog-alert-message-content').innerHTML = ModalDialogObject.message;

  window.modalDialogAlert = ModalDialogObject;
}