window.general = function () {
  return {
    // get real path
    getRealPath: (p) => {
      let rPath = "";
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
  };
}();
