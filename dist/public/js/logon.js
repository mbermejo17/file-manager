
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){var toString=Object.prototype.toString
module.exports=function(val){switch(toString.call(val)){case'[object Function]':return'function'
case'[object Date]':return'date'
case'[object RegExp]':return'regexp'
case'[object Arguments]':return'arguments'
case'[object Array]':return'array'
case'[object String]':return'string'}
if(typeof val=='object'&&val&&typeof val.length=='number'){try{if(typeof val.callee=='function')return'arguments';}catch(ex){if(ex instanceof TypeError){return'arguments';}}}
if(val===null)return'null'
if(val===undefined)return'undefined'
if(val&&val.nodeType===1)return'element'
if(val===Object(val))return'object'
return typeof val}},{}],2:[function(require,module,exports){'use strict';var _ajax=require('./vendor/ajax');var _ajax2=_interopRequireDefault(_ajax);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}
(function(c,d){var waiting=d.querySelector('#waiting');var READY_STATE_COMPLETE=4;var OK=200;var NOT_FOUND=404;var preload=d.querySelector('#loader');var main=d.querySelector('#main');var loginbutton=d.querySelector('#login-button');var Base64={_keyStr:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',encode:function encode(e){var t='';var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64;}else if(isNaN(i)){a=64;}
t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a);}
return t;},decode:function decode(e){var t='';var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,'');while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r);}
if(a!=64){t=t+String.fromCharCode(i);}}
t=Base64._utf8_decode(t);return t;},_utf8_encode:function _utf8_encode(e){e=e.replace(/rn/g,'n');var t='';for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128);}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128);}}
return t;},_utf8_decode:function _utf8_decode(e){var t='';var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++;}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2;}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3;}}
return t;}};c(loginbutton);function submit(e){e.preventDefault();var username=d.querySelector('#username').value;var password=d.querySelector('#password').value;var form=d.querySelector('#formLogon');d.querySelector('#password').value=Base64.encode(password);(0,_ajax2.default)({type:'POST',url:'/filemanager/logon',data:{username:username,password:Base64.encode(password)},ajaxtimeout:40000,beforeSend:function beforeSend(){waiting.style.display='block';},success:function success(data){console.log(JSON.parse(data));var _JSON$parse=JSON.parse(data),status=_JSON$parse.status,message=_JSON$parse.message;if(status==='FAIL'){d.querySelector('#message').innerHTML=message;}else{d.location.href=message;}},complete:function complete(xhr,status){console.log(xhr,status);waiting.style.display='none';},error:function error(xhr,err){if(err==='timeout'){console.log('Timeout Error');}else{console.log(xhr,err);}}});}
main.style.display='block';preload.style.display='none';loginbutton.addEventListener('click',submit);})(console.log,document);},{"./vendor/ajax":3}],3:[function(require,module,exports){'use strict';var type;try{type=require('type-of');}catch(ex){var r=require;type=r('type');}
var jsonpID=0;var document=window.document;var key;var name;var scriptTypeRE=/^(?:text|application)\/javascript/i;var xmlTypeRE=/^(?:text|application)\/xml/i;var jsonType='application/json';var htmlType='text/html';var blankRE=/^\s*$/;var ajax=module.exports=function(options){var settings=extend({},options||{});for(key in ajax.settings){if(settings[key]===undefined)settings[key]=ajax.settings[key];}
ajaxStart(settings);if(!settings.crossDomain){settings.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(settings.url)&&RegExp.$2!==window.location.host;}
var dataType=settings.dataType;var hasPlaceholder=/=\?/.test(settings.url);if(dataType==='jsonp'||hasPlaceholder){if(!hasPlaceholder)settings.url=appendQuery(settings.url,'callback=?');return ajax.JSONP(settings);}
if(!settings.url)settings.url=window.location.toString();serializeData(settings);var mime=settings.accepts[dataType];var baseHeaders={};var protocol=/^([\w-]+:)\/\//.test(settings.url)?RegExp.$1:window.location.protocol;var xhr=ajax.settings.xhr();var abortTimeout;if(settings.ajaxtimeout)xhr.timeout=settings.ajaxtimeout;if(!settings.crossDomain)baseHeaders['X-Requested-With']='XMLHttpRequest';if(mime){baseHeaders['Accept']=mime;if(mime.indexOf(',')>-1)mime=mime.split(',',2)[0];xhr.overrideMimeType&&xhr.overrideMimeType(mime);}
if(settings.contentType||settings.data&&settings.type.toUpperCase()!=='GET'){baseHeaders['Content-Type']=settings.contentType||'application/x-www-form-urlencoded';}
settings.headers=extend(baseHeaders,settings.headers||{});xhr.ontimeout=function(){ajaxError(null,'timeout',xhr,settings);};xhr.onreadystatechange=function(){if(xhr.readyState===4){clearTimeout(abortTimeout);var result;var error=false;if(xhr.status>=200&&xhr.status<300||xhr.status===304||xhr.status===0&&protocol==='file:'){dataType=dataType||mimeToDataType(xhr.getResponseHeader('content-type'));result=xhr.responseText;try{if(dataType==='script')(1,eval)(result);else if(dataType==='xml')result=xhr.responseXML;else if(dataType==='json')result=blankRE.test(result)?null:JSON.parse(result);}catch(e){error=e;}
if(error)ajaxError(error,'parsererror',xhr,settings);else ajaxSuccess(result,xhr,settings);}else{if(xhr.status!==0){ajaxError(null,'error',xhr,settings);}}}};var async='async'in settings?settings.async:true;xhr.open(settings.type,settings.url,async);for(name in settings.headers){xhr.setRequestHeader(name,settings.headers[name]);}if(ajaxBeforeSend(xhr,settings)===false){xhr.abort();return false;}
xhr.send(settings.data?settings.data:null);return xhr;};function triggerAndReturn(context,eventName,data){return true;}
function triggerGlobal(settings,context,eventName,data){if(settings.global)return triggerAndReturn(context||document,eventName,data);}
ajax.active=0;function ajaxStart(settings){if(settings.global&&ajax.active++===0)triggerGlobal(settings,null,'ajaxStart');}
function ajaxStop(settings){if(settings.global&&!--ajax.active)triggerGlobal(settings,null,'ajaxStop');}
function ajaxBeforeSend(xhr,settings){var context=settings.context;if(settings.beforeSend.call(context,xhr,settings)===false||triggerGlobal(settings,context,'ajaxBeforeSend',[xhr,settings])===false){return false;}
triggerGlobal(settings,context,'ajaxSend',[xhr,settings]);}
function ajaxSuccess(data,xhr,settings){var context=settings.context;var status='success';settings.success.call(context,data,status,xhr);triggerGlobal(settings,context,'ajaxSuccess',[xhr,settings,data]);ajaxComplete(status,xhr,settings);}
function ajaxError(error,type,xhr,settings){var context=settings.context;settings.error.call(context,xhr,type,error);triggerGlobal(settings,context,'ajaxError',[xhr,settings,error]);ajaxComplete(type,xhr,settings);}
function ajaxComplete(status,xhr,settings){var context=settings.context;settings.complete.call(context,xhr,status);triggerGlobal(settings,context,'ajaxComplete',[xhr,settings]);ajaxStop(settings);}
function empty(){}
ajax.JSONP=function(options){if(!('type'in options))return ajax(options);var callbackName='jsonp'+ ++jsonpID;var script=document.createElement('script');var abort=function abort(){if(callbackName in window)window[callbackName]=empty;ajaxComplete('abort',xhr,options);};var xhr={abort:abort};var abortTimeout;var head=document.getElementsByTagName('head')[0]||document.documentElement;if(options.error){script.onerror=function(){xhr.abort();options.error();};}
window[callbackName]=function(data){clearTimeout(abortTimeout);delete window[callbackName];ajaxSuccess(data,xhr,options);};serializeData(options);script.src=options.url.replace(/=\?/,'='+callbackName);head.insertBefore(script,head.firstChild);if(options.timeout>0){abortTimeout=setTimeout(function(){xhr.abort();ajaxComplete('timeout',xhr,options);},options.timeout);}
return xhr;};ajax.settings={type:'GET',beforeSend:empty,success:empty,error:empty,complete:empty,context:null,global:true,xhr:function xhr(){return new window.XMLHttpRequest();},accepts:{script:'text/javascript, application/javascript',json:jsonType,xml:'application/xml, text/xml',html:htmlType,text:'text/plain'},crossDomain:false,timeout:0};function mimeToDataType(mime){return mime&&(mime===htmlType?'html':mime===jsonType?'json':scriptTypeRE.test(mime)?'script':xmlTypeRE.test(mime)&&'xml')||'text';}
function appendQuery(url,query){return(url+'&'+query).replace(/[&?]{1,2}/,'?');}
function serializeData(options){if(type(options.data)==='object')options.data=param(options.data);if(options.data&&(!options.type||options.type.toUpperCase()==='GET')){options.url=appendQuery(options.url,options.data);}}
ajax.get=function(url,success){return ajax({url:url,success:success});};ajax.post=function(url,data,success,dataType){if(type(data)==='function'){dataType=dataType||success;success=data;data=null;}
return ajax({type:'POST',url:url,data:data,success:success,dataType:dataType});};ajax.getJSON=function(url,success){return ajax({url:url,success:success,dataType:'json'});};var escape=encodeURIComponent;function serialize(params,obj,traditional,scope){var array=type(obj)==='array';for(var key in obj){var value=obj[key];if(scope)key=traditional?scope:scope+'['+(array?'':key)+']';if(!scope&&array)params.add(value.name,value.value);else if(traditional?type(value)==='array':type(value)==='object'){serialize(params,value,traditional,key);}else params.add(key,value);}}
function param(obj,traditional){var params=[];params.add=function(k,v){this.push(escape(k)+'='+escape(v));};serialize(params,obj,traditional);return params.join('&').replace('%20','+');}
function extend(target){var slice=Array.prototype.slice;slice.call(arguments,1).forEach(function(source){for(key in source){if(source[key]!==undefined){target[key]=source[key];}}});return target;}},{"type-of":1}]},{},[2]);