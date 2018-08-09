export function getRealPath(p) {
      let rPath = "";
      
      if (userData.RunMode === "DEBUG") console.log("getRealPath:p ", p);
      if (userData.RunMode === "DEBUG") console.log("getRealPath:userData.RealRootPath ", userData.RealRootPath);
      if (p == "/" && (userData.RealRootPath === "/" || userData.RealRootPath === "")) {     
        rPath = p;
      } else {
        if (p == "/") {
          rPath = "/" + userData.RealRootPath;
        } else {
          if(userData.RealRootPath !== '/'){
            rPath = "/" + userData.RealRootPath + p;
          } else {
            if(p.indexOf('/') !== 0) {
              rPath =  userData.RealRootPath + p;
            } else {
              rPath =  p;
            }
          }
        }
      }
      if (userData.RunMode === "DEBUG") console.log("getRealPath:rPath ", rPath);
      return rPath;
    }

export function serializeObject(dataObject) {
      var stringResult = "",
        value = void 0;
      for (var key in dataObject) {
        if (userData.RunMode === "DEBUG") console.log(dataObject[key], key);
        value = dataObject[key];
        if (stringResult !== "") {
          stringResult += "&" + key + "=" + value;
        } else {
          stringResult += key + "=" + value;
        }
      }
      return stringResult;
    }   
