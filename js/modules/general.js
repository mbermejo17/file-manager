import Cookies from "../vendor/js-cookie";


export function getRealPath(p) {
      let rPath = "";
      let RUNMODE = Cookies.get("RunMode");
      let REAL_ROOT_PATH = Cookies.get("RootPath");

      if (RUNMODE === "DEBUG") console.log("getRealPath:p ", p);
      if (RUNMODE === "DEBUG") console.log("getRealPath:REAL_ROOT_PATH ", REAL_ROOT_PATH);
      if (p == "/" && (REAL_ROOT_PATH === "/" || REAL_ROOT_PATH === "")) {
        rPath = p;
      } else {
        if (p == "/") {
          rPath = "/" + REAL_ROOT_PATH;
        } else {
          //rPath = "/" + REAL_ROOT__PATH + p;
          rPath = p;
        }
      }
      if (RUNMODE === "DEBUG") console.log("getRealPath:rPath ", rPath);
      return rPath;
    }

export function serializeObject(dataObject) {
      var stringResult = "",
        value = void 0;
      for (var key in dataObject) {
        if (RUNMODE === "DEBUG") console.log(dataObject[key], key);
        value = dataObject[key];
        if (stringResult !== "") {
          stringResult += "&" + key + "=" + value;
        } else {
          stringResult += key + "=" + value;
        }
      }
      return stringResult;
    }   
