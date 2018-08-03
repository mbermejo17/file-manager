
  ////////////////////////////////////
  // Users manage module
  ///////////////////////////////////

  let htmlUserFormTemplate = `
      <div id="AddUserModal">
          <h4 id ="userFormTitle" class="header2">New User</h4>
          <div class="row">
              <form class="col s12 m12 l12" id="formAddUser">
                  <div class="row">
                      <div class="input-field col s6"><input id="UserName" type="text" />
                      <label for="UserName">Name</label></div>
                      <div class="input-field col s6"><input id="CompanyName" type="text" />
                      <label for="CompanyName">Company Name</label></div>
                  </div>
                  <div class="row">
                      <div class="input-field col s6"><input id="UserPasswd" type="password" autocomplete="off" />
                      <label for="UserPasswd">Password</label></div>
                      <div class="input-field col s6"><input id="repeatUserPasswd" type="password" autocomplete="off" />
                      <label for="repeatUserPasswd">Repeat Password</label></div>
                  </div>
                  <div class="row">
                      <div class="input-field col s4"><input id="rootpath" type="text" />
                      <label for="rootpath">Root Path</label></div><i class="mdi-action-find-in-page col s2" id="FindPath"></i>
                      <div class="input-field col s6 right">
                        <input class="datepicker" id="ExpirateDate" type="date"/>
                        <label for="ExpirateDate">Expiration Date</label>
                      </div>
                  </div>
                  <div class="row">
                      <div class="rights">Access Rights</div>
                  </div>
                  <div class="row">
                      <div class="input-field col s2 m2"></div>
                      <div class="input-field col s8 m8" style="line-height: .9em;" >
                        <input id="Role" type="hidden" value="" />
                        <select id="RoleOptions" name="optionsname" required="">
                          <option value="opt1">User</option>
                          <option value="opt2">Admin</option>
                          <option value="opt3">Advanced User</option>
                          <option value="opt4">Custom</option>
                        </select>
                        <label>User Role</label>
                      </div>
                      <div class="input-field col s2 m2"></div>
                  </div>
                  <br/>
                  <div class="row">
                      <span class="label-switch col s2">Download</span>
                      <div class="switch col s3">
                        <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                        <span class="lever"></span>On</label>
                      </div>
                      <span class="col s2"></span>
                      <span class="label-switch col s2">Upload</span>
                      <div class="switch col s3">
                        <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                        <span class="lever"></span>On</label>
                      </div>
                  </div>
                  <div class="row"><span class="label-switch col s2">Delete File</span>
                      <div class="switch col s3">
                        <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                        <span class="lever"></span>On</label>
                      </div>
                      <span class="col s2">   </span>
                      <span class="label-switch col s2">Delete Folder</span>
                      <div class="switch col s3">
                        <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                        <span class="lever"></span>On</label>
                      </div>
                  </div>
                  <div class="row">
                    <span class="label-switch col s2">Add Folder</span>
                    <div class="switch col s3">
                      <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                      <span class="lever"></span>On</label>
                    </div>
                    <span class="col s2">   </span>
                    <span class="label-switch col s2>Share</span>
                    <div class="switch col s3">
                      <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                      <span class="lever"></span>On       </label></div>
                  </div>
                  <div class="row"><br/>
                      <div class="input-field col s6 m6"></div>
                      <div class="input-field col s3 m3"><button class="waves-effect waves-teal btn-flat btn2-unify right" id="btn-addUserCancel" type="submit" name="action">Cancel</button></div>
                      <div class="input-field col s3 m3"><button class="waves-effect waves-teal btn-flat btn2-unify right" id="btn-addUserAcept" type="submit" name="action">Accept</button></div>
                  </div>
              </form>
          </div>
      </div>`;

  let htmlSearchUserTemplate = `<div id="searchUserModal">
                                  <div class="row"> 
                                    <div class="input-field col s12 m12"></div>
                                  </div>
                                  <div class="row" id="searchUser">
                                  <div class="input-field col s1 m1"></div>
                                    <div class="input-field col s5">
                                    <input id="searchUserName" type="hidden" autocomplete="off" />
                                    <label for="usersList">Search User</label></div>
                                    <select id="usersList" class="md-select">
                                    </select>  
                                    <div class="input-field col s2">
                                      <i class="fa fa-search" id="btnSearchUser"></i>
                                    </div>
                                    <div class="input-field col s4 m4"></div>
                                    <div class="row"> 
                                    <div class="input-field col s9 m9"></div>
                                    <div class="input-field col s2 m2">
                                      <button class="waves-effect waves-teal btn-flat btn2-unify right" id="btn-SearchUserCancel" type="submit" name="action">Cancel</button></div>
                                    </div>
                                    <div class="input-field col s1 m1"></div>
                                    </div>
                                </div>`;



  export function searchUserName(userName) {
    if (RunMode === "DEBUG") console.log(userName);

    execFetch("/searchuser?userName=" + userName, "GET", null)
      .then(d => {
        if (RunMode === "DEBUG") console.log(d);
        if (d.status == "OK") {
          showAddUserForm("Edit User", d.data);
        } else {
          showToast(d.message, "err");
        }
      })
      .catch(e => {
        showToast(
          "Error al buscar usuario " + userName + ".<br>Err:" + e,
          "err"
        );
        if (RunMode === "DEBUG") console.log(e);
      });
  }


  export function LoadUsersList(el){
    execFetch("/users", "GET")
      .then(d => {
        if (RunMode === "DEBUG") console.log(d);
        let users = d.data;
        let options = '';
        for (let x = 0; x < users.length; x++) {
          options += `<option id="${users[x].UserId}">${users[x].UserName}</option>`;
        }
        el.innerHTML = options;
      })
      .catch(e => {
        showToast("Error al grabar los cambios para el usuario " + data.userName + ".<br>Err:" + e, "err");
        if (RunMode === "DEBUG") console.log(e);
      });
  }

  export function editUser() {
    let AddUserModalContent = document.querySelector("#AddUserModalContent");
    let SearchUserModalContent = document.querySelector(
      "#searchUserModalContent"
    );


    let containerOverlay = document.querySelector(".container-overlay");
    AddUserModalContent.style.display = "none";
    SearchUserModalContent.innerHTML = htmlSearchUserTemplate;
    LoadUsersList(document.getElementById('usersList'));
    SearchUserModalContent.style.display = "block";
    containerOverlay.style.display = "block";
    SearchUserModalContent.addEventListener("keyup", e => {
      e.preventDefault();
      if (e.keyCode === 13) {
        searchUserName(document.getElementById("searchUserName").value);
      }
    });
    document.querySelector("#btnSearchUser").addEventListener("click", e => {
      e.preventDefault();
      searchUserName(document.getElementById("searchUserName").value);
    });
    document
      .querySelector("#btn-SearchUserCancel")
      .addEventListener("click", e => {
        e.preventDefault();
        SearchUserModalContent.style.display = "none";
        containerOverlay.style.display = "none";
      });
  }


  export function selectRole(element, role){
    if (RunMode === "DEBUG") console.log(role);
    for (let x = 0; x < element.options.length; x++) {
      if (RunMode === "DEBUG") console.log("option: ", element.options[x].text);
      if (element.options[x].text.toUpperCase() === role.toUpperCase()) {
        element.options[x].selected = "selected";
        element.selectedIndex = x;
        if (RunMode === "DEBUG")
          console.log("option selected: ", element.options[x].text);
        if (role.toUpperCase() !== "CUSTOM") {
          changeAccessRights(
            document.querySelectorAll(".AccessRightsSwitch"),
            element.options[x].value
          );
        }
        break;
      }
    }
  }

  export function showAddUserForm(title, data){
    let AddUserModalContent = document.querySelector("#AddUserModalContent");
    let containerOverlay = document.querySelector(".container-overlay");
    let SearchUserModalContent = document.querySelector(
      "#searchUserModalContent"
    );
    let mode = data ? "edit" : "add";
    let oldData = null;
    SearchUserModalContent.style.display = "none";

    AddUserModalContent.innerHTML = htmlUserFormTemplate;
    if (data) {
      if (RunMode === "DEBUG") console.log(data);
      oldData = Object.assign({}, data);
      document.querySelector("#userFormTitle").innerHTML = title;
      document.querySelector("#UserName").value = data.UserName;
      document.querySelector("#CompanyName").value = data.CompanyName;
      document.querySelector("#UserPasswd").value = data.UserPasswd;
      document.querySelector("#repeatUserPasswd").value = data.UserPasswd;
      document.querySelector("#RootPath").value = data.RootPath;
      document.querySelector("#ExpirateDate").value = data.ExpirateDate;
      //document.querySelector("#expirationDate")
      selectRole(document.querySelector("#RoleOptions"), data.Role);
      if (data.Role.toUpperCase() === "CUSTOM")
        checkAccessRights(data.AccessString);
      containerOverlay.style.display = "block";
      AddUserModalContent.style.display = "block";
      document.querySelector("label[for=UserName]").classList.add("active");
      document.querySelector("label[for=CompanyName]").classList.add("active");
      document.querySelector("label[for=UserPasswd]").classList.add("active");
      document
        .querySelector("label[for=repeatUserPasswd]")
        .classList.add("active");
      document.querySelector("label[for=RootPath]").classList.add("active");
      document.querySelector("#UserName").disabled = true;

      document
        .querySelector("#btn-addUserCancel")
        .addEventListener("click", e => {
          e.preventDefault();
          //containerOverlay.style.display = "none";
          AddUserModalContent.style.display = "none";
          SearchUserModalContent.style.display = "block";
        });
      document
        .querySelector("#btn-addUserAcept")
        .addEventListener("click", e => {
          e.preventDefault();
          _updateUser(oldData);
        });
    } else {
      containerOverlay.style.display = "block";
      AddUserModalContent.style.display = "block";
      changeAccessRights(
        document.querySelectorAll(".AccessRightsSwitch"),
        "opt1"
      );
      document
        .querySelector("#btn-addUserCancel")
        .addEventListener("click", e => {
          e.preventDefault();
          containerOverlay.style.display = "none";
          AddUserModalContent.style.display = "none";
        });
      document
        .querySelector("#btn-addUserAcept")
        .addEventListener("click", e => {
          e.preventDefault();
          _addUser();
        });
    }

    let sel = document.querySelector("select");

    $(".AccessRightsSwitch").change(function () {
      if ($(this).is(":checked")) {
        if (RunMode === "DEBUG") console.log("Is checked");
      } else {
        if (RunMode === "DEBUG") console.log("Is Not checked");
      }
    });

    sel.addEventListener("change", e => {
      let opt = e.target[e.target.selectedIndex].value;
      let AccessSwitch = document.querySelectorAll(".AccessRightsSwitch");
      changeAccessRights(AccessSwitch, opt);
    });

    const _getUserRole = () => {
      return sel.options[sel.selectedIndex].text;
    };

    const _getChanges = () => {
      let AccessSwitch = document.querySelectorAll(".AccessRightsSwitch");
      let accessString = _getAccessString(AccessSwitch);
      let userRole = _getUserRole();
      let queryString = {};
      if (RunMode === "DEBUG") console.log(oldData);
      for (let prop in oldData) {
        if (hasOwnProperty.call(oldData, prop)) {
          console.log(prop);
          if (prop === "Role") {
            if (oldData[prop].toUpperCase() !== userRole.toUpperCase()) {
              queryString.Role = userRole;
              console.warn(oldData[prop], userRole);
            } else {
              console.log(oldData[prop], userRole);
            }
          } else {
            if (prop === "AccessString") {
              if (oldData[prop] !== accessString) {
                console.warn(oldData[prop], accessString);
                queryString.AccessString = accessString;
              } else {
                console.log(oldData[prop], accessString);
              }
            } else {
              if (prop === 'ExpirateDate') {
                if (oldData[prop] === null) oldData[prop] = '';
                if (oldData[prop] !== document.getElementById(prop).value) {
                  queryString.ExpirateDate = document.getElementById(prop).value
                  console.warn(oldData[prop], document.getElementById(prop).value);
                } else {
                  console.log(oldData[prop], document.getElementById(prop).value);
                }

              } else {
                if (oldData[prop].toUpperCase() !== document.getElementById(prop).value.toUpperCase()) {
                  queryString[prop] = document.getElementById(prop).value;
                  console.warn(oldData[prop], document.getElementById(prop).value);
                } else {
                  console.log(oldData[prop], document.getElementById(prop).value);
                }
              }
            }
          }
        }
      }
      if (RunMode === 'DEBUG') console.log(queryString);
      return queryString;
    };

    const _updateUser = (oData) => {
      let queryString = _getChanges();
      if (queryString) {
        let data = {
          userName: oData.UserName,
          queryString: queryString
        };
        execFetch("/updateuser", "POST", data)
          .then(d => {
            if (RunMode === "DEBUG") console.log(d);
            showToast(
              "Datos usuario " + data.userName + " actualizados.",
              "success"
            );
            document.getElementById("refresh").click();
          })
          .catch(e => {
            showToast(
              "Error al grabar los cambios para el usuario " +
              data.userName +
              ".<br>Err:" +
              e,
              "err"
            );
            if (RunMode === "DEBUG") console.log(e);
          });
      }
    };

    const _getAccessString = AccessSwitch => {
      let result = "";
      let v = 0;

      for (let x = 0; x < AccessSwitch.length; x++) {
        if (AccessSwitch[x].checked) {
          v = 1;
        } else {
          v = 0;
        }
        if (x != 0) {
          result += "," + v;
        } else {
          result += v;
        }
      }
      return result;
    };

    const _addUser = () => {
      let AccessSwitch = document.querySelectorAll(".AccessRightsSwitch");
      let userName = document.querySelector("#UserName").value;
      let companyName = document.querySelector("#CompanyName").value;
      let userPassword = document.querySelector("#UserPasswd").value;
      let userRole = sel[sel.selectedIndex].innerHTML;
      let userRootPath = document.querySelector("#RootPath").value;
      let expirateDate = document.querySelector("#ExpirateDate").value;
      let result = _getAccessString(AccessSwitch);

      if (RunMode === "DEBUG") console.log("User Name: " + userName);
      if (RunMode === "DEBUG") console.log("Company Name: " + companyName);
      if (RunMode === "DEBUG") console.log("Password: " + userPassword);
      if (RunMode === "DEBUG") console.log("Root Path: " + userRootPath);
      if (RunMode === "DEBUG") console.log("Expirate Date: " + expirateDate);
      if (RunMode === "DEBUG") console.log("Role: " + userRole);
      if (RunMode === "DEBUG") console.log("Access Rights: " + result);
      let data = {
        userName: userName,
        userPassword: Base64.encode(md5(userPassword)),
        companyName: companyName,
        userRole: userRole,
        expirateDate: expirateDate,
        rootPath: userRootPath,
        accessRights: result
      };
      execFetch("/adduser", "POST", data)
        .then(d => {
          if (RunMode === "DEBUG") console.log(d);
          showToast("Usuario " + data.userName + " añadido.", "success");
          document.getElementById("refresh").click();
          document.querySelector("#formAddUser").reset();
          changeAccessRights(
            document.querySelectorAll(".AccessRightsSwitch"),
            "opt1"
          );
        })
        .catch(e => {
          showToast(
            "Error al añadir usuario " + data.userName + ".<br>Err:" + e,
            "err"
          );
          if (RunMode === "DEBUG") console.log(e);
        });
    };
  }

////////////////////////////////////
// End user manage module
///////////////////////////////////
  
