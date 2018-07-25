import Cookies from "../vendor/js-cookie";


 var getRealPath = module.exports = (p) => {
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
    };
