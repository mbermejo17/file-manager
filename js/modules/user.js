import axios from "axios";
import {
    Base64
} from "js-base64";
import md5 from "../vendor/md5.min";
import moment from "moment";
import {
    modalDialog
} from "../vendor/modalDialog";
import DataTable from "../vendor/dataTables";

////////////////////////////////////
// Users manage module
///////////////////////////////////
let htmlUserFormTemplate = `
    <div class="userForm-container">
      <form id="formAddUser" class="userForm-content">
        <div class="userForm-row">
          <div class="userForm-title">New User</div>
        </div>
        <br>
        <div class="userForm-row">
          <div class="userForm-group">
            <div class="userForm-field-content">
                <div class="userForm-input-container">
              <input id="UserName" type="text" class="userForm-input">
                <label for="UserName" class="userForm-label">Name</label>
            </div>   
             </div>
            <div class="userForm-field-content">
                <div class="userForm-input-container">
              <input id="CompanyName" type="text" class="userForm-input">
                <label for="CompanyName" class="userForm-label">Company Name</label>
            </div>   
             </div>
          </div>
        </div>
        <div class="userForm-row">
         <div class="userForm-group"> 
          <div class="userForm-field-content">
            <div class="userForm-input-container">
              <input id="UserPasswd" type="password" autocomplete="off" class="userForm-input">
                <label for="UserPasswd" class="userForm-label">Password</label>
            </div>    
          </div>
          <div class="userForm-field-content">
                <div class="userForm-input-container">
              <input id="repeatUserPasswd" type="password" autocomplete="off" class="userForm-input">
                <label for="repeatUserPasswd" class="userForm-label">Repeat Password</label>
            </div> 
          </div>
          </div>  
        </div>
        <div class="userForm-row">
          <div class="userForm-group">
            <div class="userForm-field-content">
                <div class="userForm-input-container">
              <input id="RootPath" type="text" class="userForm-input">
                <label for="RootPath" class="userForm-label">Root Path</label>
            </div> 
             </div>
            <div class="userForm-field-content">
                <div class="userForm-input-container">
              <i id="FindPath"></i>
                <input class="datepicker userForm-input used" id="ExpirateDate" type="date">
                <label for="ExpirateDateInput" class="userForm-label">Expiration Date</label>
            </div> 
             </div>
          </div> 
        </div>
        <div class="userForm-row">
          <div class="userForm-title">Access Rights</div>
        </div>
        <br>
        <div class="userForm-row">            
              <div class="userForm-input-field">
                <label class="userForm-select-label">User Role</label>
                <input id="Role" type="hidden" value="" class="userForm-input">
                <select id="RoleOptions" name="optionsname" required="" class="userForm-select">
                  <option value="opt1">User</option>
                  <option value="opt2">Admin</option>
                  <option value="opt3">Advanced User</option>
                  <option value="opt4">Custom</option>
                </select>
              </div>
            </div>
        <br>
        <div class="userForm-row">
          <div class="userForm-group">
            <div class="userForm-field-content">
                <div class="userForm-input-container-switch">
                  <label class="switch-label">Download</label>
                <label class="switch jsSwitcher" role="switch" aria-label="regular switch" aria-checked="false">
                  <input type="checkbox" class="off-screen AccessRightsSwitch" name="switcher" aria-hidden="true" />
                  <span class="switch__off-text" aria-hidden="true">Deny</span>
                  <span class="switch__lever"></span>
                  <span class="switch__on-text" aria-hidden="true">Allow</span>
                </label>
                </div>
            </div>
            <div class="userForm-field-separator"></div>
            <div class="userForm-field-content">
                <div class="userForm-input-container-switch">
                  <span class="switch-label">Upload</span>
                <label class="switch jsSwitcher" role="switch" aria-label="regular switch" aria-checked="false">
                  <input type="checkbox" class="off-screen AccessRightsSwitch" name="switcher" aria-hidden="true" />
                  <span class="switch__off-text" aria-hidden="true">Deny</span>
                  <span class="switch__lever"></span>
                  <span class="switch__on-text" aria-hidden="true">Allow</span>
                </label>
                </div>
            </div>
          </div>  
        </div>
        <div class="userForm-row">
          <div class="userForm-group">
            <div class="userForm-field-content">
                <div class="userForm-input-container-switch">
                  <span class="switch-label">Delete File</span>
                <label class="switch jsSwitcher" role="switch" aria-label="regular switch" aria-checked="false">
                  <input type="checkbox" class="off-screen AccessRightsSwitch" name="switcher" aria-hidden="true" />
                  <span class="switch__off-text" aria-hidden="true">Deny</span>
                  <span class="switch__lever"></span>
                  <span class="switch__on-text" aria-hidden="true">Allow</span>
                </label>
                </div>
            </div>
            <div class="userForm-field-separator"></div>
            <div class="userForm-field-content">
                <div class="userForm-input-container-switch">
                  <span class="switch-label">Delete Folder</span>
                <label class="switch jsSwitcher" role="switch" aria-label="regular switch" aria-checked="false">
                  <input type="checkbox" class="off-screen AccessRightsSwitch" name="switcher" aria-hidden="true" />
                  <span class="switch__off-text" aria-hidden="true">Deny</span>
                  <span class="switch__lever"></span>
                  <span class="switch__on-text" aria-hidden="true">Allow</span>
                </label>
                </div>
            </div>
          </div>  
        </div>
        <div class="userForm-row">
          <div class="userForm-group">
            <div class="userForm-field-content">
                <div class="userForm-input-container-switch">
                  <span class="switch-label">Add Folder</span>
                <label class="switch jsSwitcher" role="switch" aria-label="regular switch" aria-checked="false">
                  <input type="checkbox" class="off-screen AccessRightsSwitch" name="switcher" aria-hidden="true" />
                  <span class="switch__off-text" aria-hidden="true">Deny</span>
                  <span class="switch__lever"></span>
                  <span class="switch__on-text" aria-hidden="true">Allow</span>
                </label>
                </div>
            </div>
            <div class="userForm-field-separator"></div>
            <div class="userForm-field-content">
                <div class="userForm-input-container-switch">
                  <span class="switch-label">Share files</span>
                <label class="switch jsSwitcher" role="switch" aria-label="regular switch" aria-checked="false">
                  <input type="checkbox" class="off-screen AccessRightsSwitch" name="switcher" aria-hidden="true" />
                  <span class="switch__off-text" aria-hidden="true">Deny</span>
                  <span class="switch__lever"></span>
                  <span class="switch__on-text" aria-hidden="true">Allow</span>
                </label>
                </div>
            </div>
          </div>  
        </div>
        <br>
        <div class="userForm-footer">
          <div class="userForm-group">
            <div class="userForm-field-content">
            </div>  
            <div class="userForm-field-content">
                <div class="userForm-input-container">
                    <button class="waves-effect waves-teal btn-flat btn2-unify" id="btn-addUserCancel" type="submit" name="action">Cancel</button>
                </div> 
             </div>
            <div class="userForm-field-content">
                <div class="userForm-input-container">
                    <button class="waves-effect waves-teal btn-flat btn2-unify" id="btn-addUserAcept" type="submit" name="action">Accept</button>
                </div> 
             </div>
             <div class="userForm-field-content">
            </div> 
          </div>
        </div>
      </form>
    </div>`;

/* let htmlSearchUserTemplate = `<div id="searchUserModal">
                                  <div class="row"> 
                                    <div class="input-field col s12 m12"></div>
                                  </div>
                                  <div class="row" id="searchUser">
                                  <div class="input-field col s1 m1"></div>
                                    <div class="input-field col s5">
                                    <input id="searchUserName" type="text" autocomplete="off" />
                                    <label for="usersList">Search User</label></div>
                                    <div id="user-List" >
                                    </div> 
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
                                </div>`; */
/*let htmlSearchUserTemplate = `
<div class="userForm-container">
  <div id="users" class="userForm-content">
  <input class="search" placeholder="Search" />
  <span class="sort" data-sort="UserName">Sort by name</span>
  <span class="sort" data-sort="CompanyName">Sort by Company Name</span>
  <div class="head-list">
      <div>UserId</div> 
      <div>UserName</div>
      <div>CompanyName</div>
      <div>RootPath</div>
      <div>AccessString</div>
      <div>ExpirateDate</div>
  </div>     
  <ul id="tableList" class="list">
  </ul>
  </div>
</div>
`;*/

let htmlSearchUserTemplate = `
<div>
      <div class="head-Title">Edit Users</div> 
      <table id="usersTableList" class="tableList">
        <thead>
          <tr>
            <th>User Id</th>
            <th>User Name</th>
            <th>User Role</th>
            <th>Company Name</th>
            <th>Root Path</div>
            <th data-type="date" data-format="YYYY/MM/DD">Expirate Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="bodyList">    
        </tbody>
      </table>
      <div class="AddUserModalContent-footer">
        <div class="button-container">
            <button class="waves-effect waves-teal btn-flat btn2-unify" id="btn-EditUserCancel" type="submit" name="action">Close</button>
        </div> 
      </div>
</div>
`;

const checkAccessRights = (AccessSwitch, role, accessRights) => {
    let opt = "";
    let aAccessRights = split(accessRights, ",");
    if (role !== "Custom") {
        switch (role.toUpperCase()) {
            case "USER":
                opt = "opt1";
                break;
            case "ADMIN":
                opt = "opt2";
                break;
            case "ADVANCED USER":
                opt = "opt3";
                break;
        }
        changeAccessRights(AccessSwitch, opt);
    } else {
        for (let x = 0; x < AccessSwitch.length; x++) {
            if (aAccessRights[x] == 1) {
                AccessSwitch[x].checked = true;
            } else {
                AccessSwitch[x].checked = false;
            }
        }
    }
};

const changeAccessRights = (AccessSwitch, opt) => {
    for (let x = 0; x < AccessSwitch.length; x++) {
        AccessSwitch[x].disabled = false;
    }
    switch (opt) {
        case "opt1":
            AccessSwitch[0].checked = true; //Download
            AccessSwitch[1].checked = true; //Upload
            AccessSwitch[2].checked = false;
            AccessSwitch[3].checked = false;
            AccessSwitch[5].checked = false;
            AccessSwitch[2].disabled = true;
            AccessSwitch[3].disabled = true;
            AccessSwitch[4].checked = true; // Add Folders
            AccessSwitch[4].disabled = true;
            AccessSwitch[5].disabled = true;
            break;
        case "opt2":
            AccessSwitch[0].checked = true;
            AccessSwitch[1].checked = true;
            AccessSwitch[2].checked = true;
            AccessSwitch[3].checked = true;
            AccessSwitch[4].checked = true;
            AccessSwitch[5].checked = true;
            break;
        case "opt3":
            AccessSwitch[0].checked = true;
            AccessSwitch[1].checked = true;
            AccessSwitch[2].checked = false; // Delete Files
            AccessSwitch[2].disabled = true;
            AccessSwitch[3].checked = false; // Delete Folders
            AccessSwitch[3].disabled = true;
            AccessSwitch[4].checked = true; // Add Folders
            AccessSwitch[4].disabled = true;
            AccessSwitch[5].checked = true; // Shared Files
            AccessSwitch[5].disabled = true;
            break;
        case "opt4":
            AccessSwitch[0].checked = false;
            AccessSwitch[1].checked = false;
            AccessSwitch[2].checked = false;
            AccessSwitch[3].checked = false;
            AccessSwitch[4].checked = false;
            AccessSwitch[5].checked = false;
            break;
    }
};

const _editUser = (userId, callback) => {
    document.querySelector("#waiting").classList.add("active");
    axios
        .get("/user/" + userId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.Token
            },
            timeout: 30000
        })
        .then((d) => {
            document.querySelector("#waiting").classList.remove("active");
            if (userData.RunMode === "DEBUG") console.log(d.data.data);
            callback(d.data.data);
        })
        .catch((e) => {
            document.querySelector("#waiting").classList.remove("active");
            showToast(
                "Search Users",
                "Error al buscar usuario.<br>Err:" + e,
                "error"
            );
            if (userData.RunMode === "DEBUG") console.log(e);
        });
};

const _removeUser = (userId, userName, callback) => {
    document.querySelector("#waiting").classList.add("active");
    axios({
            url: "/user/" + userId,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.Token
            },
            timeout: 30000,
            method: 'delete',
            data: {
              userName: userName
            }
        })
        .then((d) => {
            document.querySelector("#waiting").classList.remove("active");
            if (userData.RunMode === "DEBUG") console.log(d);
            callback(d.data.data);
        })
        .catch((e) => {
            document.querySelector("#waiting").classList.remove("active");
            showToast(
                "Search Users",
                "Error al borrar usuario.<br>Err:" + e,
                "error"
            );
            if (userData.RunMode === "DEBUG") console.log(e);
        });
};



export function searchUserName(userName) {
    if (userData.RunMode === "DEBUG") console.log(userName);
    document.querySelector("#waiting").classList.add("active");
    axios
        .get('/searchuser?userName=" + userName', {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.Token
            },
            timeout: 30000
        })
        .then(d => {
            document.querySelector("#waiting").classList.remove("active");
            if (userData.RunMode === "DEBUG") console.log(d);
            if (d.data.status == "OK") {
                showAddUserForm("Edit User", d.data);
            } else {
                showToast("Search Users", d.data.message, "error");
            }
        })
        .catch(e => {
            document.querySelector("#waiting").classList.remove("active");
            showToast(
                "Search Users",
                "Error al buscar usuario " + userName + ".<br>Err:" + e,
                "error"
            );
            if (userData.RunMode === "DEBUG") console.log(e);
        });
}

export function editUser() {
    let AddUserModalContent = document.querySelector("#AddUserModalContent");
    let containerOverlay = document.querySelector(".container-overlay");

    AddUserModalContent.innerHTML = htmlSearchUserTemplate;
    $u("#AddUserModalContent").addClass("edit");
    AddUserModalContent.style.display = "block";
    containerOverlay.style.display = "block";
    document.querySelector("#waiting").classList.add("active");
    axios
        .get("/users", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.Token
            },
            timeout: 30000
        })
        .then(d => {
            document.querySelector("#waiting").classList.remove("active");
            if (userData.RunMode === "DEBUG") console.log(d);
            if (d.data.status === "OK") {
                let users = d.data.data;
                let i;
                let htmlListContent = "";
                let bodyList = document.querySelector("#bodyList");
                if (userData.RunMode === "DEBUG") console.log("users: ", users);
                for (i = 0; i < users.length; i++) {
                  let sDate = (users[i].ExpirateDate)? users[i].ExpirateDate : 'never';  
                    htmlListContent += `
                  <tr class="data-row">
                    <td>${users[i].UserId}</td>
                    <td>${users[i].UserName}</td>
                    <td>${users[i].UserRole}</td>
                    <td>${users[i].CompanyName}</td>
                    <td>${users[i].RootPath}</td>
                    <td>${sDate}</td>
                    <td>
                    <i id="${users[i].UserId}-id" class="fas fa-user-edit edit-user-icon" title="Editar Usuario"></i>
                    <i id="${users[i].UserId}-id" class="fas fa-user-times del-user-icon" title="Borrar Usuario"></i></td>
                  </tr>`;
                }
                bodyList.innerHTML = htmlListContent;

                let table = new DataTable(document.querySelector("#usersTableList"), {
                    searchable: true,
                    fixedHeight: true,
                    info: false,
                    perPageSelect: null,
                    perPage: 200
                });

                [].forEach.call(document.querySelectorAll(".del-user-icon"), function(el) {
                    el.addEventListener("click", function(e) {
                        let userId = e.target.id.slice(0, -3);
                        let userName = e.target.parentNode.parentNode.children[1].innerHTML;
                        userName = userName.charAt(0).toUpperCase() + userName.slice(1);
                        console.log("userId: ", userId);
                        _removeUser(userId, userName, (d) => {
                          showToast(
                            "Delete User",
                            `Usuario ${userName} borrado`,
                            "success"
                        );
                          AddUserModalContent.style.display = "none";
                          $u("#AddUserModalContent").removeClass("edit");
                          containerOverlay.style.display = "none";
                        });
                    });
                });

                [].forEach.call(document.querySelectorAll(".edit-user-icon"), function(el) {
                  el.addEventListener("click", function(e) {
                      let userId = e.target.id.slice(0, -3);
                      console.log("userId: ", userId);
                      _editUser(userId, (d) => {
                        document.querySelector("#AddUserModalContent").style.display = "none";
                        $u("#AddUserModalContent").removeClass("edit");
                        document.querySelector(".container-overlay").style.display = "none";
                        showAddUserForm('Edit User', d);
                    });
                  });
              });

                document.querySelector("#btn-EditUserCancel").addEventListener("click", e => {
                    e.preventDefault();
                    AddUserModalContent.style.display = "none";
                    $u("#AddUserModalContent").removeClass("edit");
                    containerOverlay.style.display = "none";
                });
            } else {
                showToast("Users", d.data.data.message, "error");
            }
        })
        .catch(e => {
            document.querySelector("#waiting").classList.remove("active");
            if (userData.RunMode === "DEBUG") console.log(e);
            showToast("Users", e, "error");
        });
}

export function selectRole(element, role) {
    if (userData.RunMode === "DEBUG") console.log(role);
    for (let x = 0; x < element.options.length; x++) {
        if (userData.RunMode === "DEBUG")
            console.log("option: ", element.options[x].text);
        if (element.options[x].text.toUpperCase() === role.toUpperCase()) {
            element.options[x].selected = "selected";
            element.selectedIndex = x;
            if (userData.RunMode === "DEBUG")
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

export function showAddUserForm(title, data) {
    let AddUserModalContent = document.querySelector("#AddUserModalContent");
    let containerOverlay = document.querySelector(".container-overlay");
    
    let mode = data ? "edit" : "add";
    let oldData = null;

    AddUserModalContent.innerHTML = htmlUserFormTemplate;
    document.querySelector("#AddUserModalContent").classList.remove("edit");
    document.querySelector("#AddUserModalContent").classList.add("show");
    if (data) {
        if (userData.RunMode === "DEBUG") console.log('showAddUserForm: ', data);
        oldData = Object.assign({}, data);
        document.querySelector(".userForm-title").innerHTML = title;
        document.querySelector("#UserName").value = data.UserName;
        document.querySelector("#CompanyName").value = data.CompanyName;
        document.querySelector("#UserPasswd").value = Base64.decode(data.UserPasswd);
        document.querySelector("#repeatUserPasswd").value = data.UserPasswd;
        document.querySelector("#RootPath").value = data.RootPath;
        document.querySelector("#ExpirateDate").value = data.ExpirateDate;
        //document.querySelector("#expirationDate")
        selectRole(document.querySelector("#RoleOptions"), data.UserRole);
        if (data.UserRole.toUpperCase() === "CUSTOM")
            checkAccessRights(data.AccessString);

        document.querySelector("#UserName").classList.add("used");
        document.querySelector("#CompanyName").classList.add("used");
        document.querySelector("#UserPasswd").classList.add("used");
        document.querySelector("#repeatUserPasswd").classList.add("used");
        document.querySelector("#RootPath").classList.add("used");
        document.querySelector("#UserName").disabled = true;
        containerOverlay.style.display = "block";
        AddUserModalContent.style.display = "block";

        document.querySelector("#btn-addUserCancel").addEventListener("click", e => {
            e.preventDefault();
            //containerOverlay.style.display = "none";
            AddUserModalContent.style.display = "none";
            $u("#AddUserModalContent").removeClass("show");
            containerOverlay.style.display = "none";
        });

        document.querySelector("#btn-addUserAcept").addEventListener("click", e => {
            e.preventDefault();
            _updateUser(oldData);
        });
    } else {
        document.querySelector("#UserName").classList.remove("used");
        document.querySelector("#CompanyName").classList.remove("used");
        document.querySelector("#UserPasswd").classList.remove("used");
        document.querySelector("#repeatUserPasswd").classList.remove("used");
        document.querySelector("#RootPath").classList.remove("used");
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
                $u("#AddUserModalContent").removeClass("show");
                AddUserModalContent.style.display = "none";
            });
        document.querySelector("#btn-addUserAcept").addEventListener("click", e => {
            e.preventDefault();
            _addUser();
        });
    }

    let sel = document.querySelector("select");

    $(".AccessRightsSwitch").change(function() {
        if ($(this).is(":checked")) {
            if (userData.RunMode === "DEBUG") console.log("Is checked");
        } else {
            if (userData.RunMode === "DEBUG") console.log("Is Not checked");
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
        if (userData.RunMode === "DEBUG") console.log(oldData);
        for (let prop in oldData) {
            if (hasOwnProperty.call(oldData, prop)) {
                console.log(prop);
                if (prop === "UserRole") {
                    if (oldData[prop].toUpperCase() !== userRole.toUpperCase()) {
                        queryString.UserRole = userRole;
                        console.warn(oldData[prop], userRole);
                    } else {
                        console.log(oldData[prop], userRole);
                    }
                } else {
                    if (prop === "AccessString") {
                        console.log('old accessString: ', oldData[prop]);
                        console.log('new accessString: ', decodeURI(accessString));
                        if (oldData[prop] !== decodeURI(accessString)) {
                            console.warn(oldData[prop], accessString);
                            queryString.AccessString = accessString;
                        } else {
                            console.log(oldData[prop], accessString);
                        }
                    } else {
                        if (prop === "ExpirateDate") {
                            if (oldData[prop] === null) oldData[prop] = "";
                            if (oldData[prop] !== document.getElementById(prop).value) {
                                queryString.ExpirateDate = document.getElementById(prop).value;
                                queryString.UnixDate = moment(queryString.ExpirateDate).unix()
                                console.warn(
                                    oldData[prop],
                                    document.getElementById(prop).value
                                );
                            } else {
                                console.log(oldData[prop], document.getElementById(prop).value);
                            }
                        } else {
                            if (prop !== "UserId") {
                                if (prop === "UserPasswd") {
                                    let oPasswd = Base64.decode(oldData[prop]);
                                    let nPasswd = document.getElementById(prop).value;
                                    console.log('Old Pass: ', oPasswd);
                                    console.log('New Pass: ', nPasswd);
                                    if (oPasswd !== nPasswd) {
                                        queryString[prop] = md5(document.getElementById(prop).value);
                                    }
                                } else {
                                    console.log(prop);
                                    if (oldData[prop].toUpperCase() !== document.getElementById(prop).value.toUpperCase()) {
                                        queryString[prop] = document.getElementById(prop).value;
                                        console.warn(
                                            oldData[prop],
                                            document.getElementById(prop).value
                                        );
                                    } else {
                                        console.log(oldData[prop], document.getElementById(prop).value);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (userData.RunMode === "DEBUG") console.log(queryString);
        return queryString;
    };

    const _updateUser = oData => {

        let _goBack = () => {
            document.querySelector("#AddUserModalContent").style.display = "none";
            document.querySelector("#AddUserModalContent").classList.remove("show");
            document.querySelector(".container-overlay").style.display = "none";
            document.querySelector("#userMod").click();
        };

        let queryString = _getChanges();
        if (Object.keys(queryString).length > 0) {
            let data = {
                userName: oData.UserName,
                userId: oData.UserId,
                queryString: queryString
            };
            document.querySelector("#waiting").classList.add("active");
            axios
                .post("/updateuser", data, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userData.Token
                    },
                    timeout: 30000
                })
                .then(d => {
                    document.querySelector("#waiting").classList.remove("active");
                    if (userData.RunMode === "DEBUG") console.log(d);
                    if (d.data.status === "OK") {
                        showToast(
                            "User",
                            "Datos usuario " + data.userName + " actualizados.",
                            "success"
                        );
                        if (queryString.hasOwnProperty('RootPath')) {
                            document.getElementById("refresh").click();
                        }
                        _goBack();
                    }
                })
                .catch(e => {
                    document.querySelector("#waiting").classList.remove("active");
                    if (userData.RunMode === "DEBUG") console.log(e);
                    showToast(
                        "Error al grabar los cambios para el usuario " +
                        data.userName +
                        ".<br>Err:" +
                        e,
                        "error"
                    );
                });
        } else {
            _goBack();
        }
    };

    const _getAccessString = AccessSwitch => {
        let accessName = [
      "download",
      "upload",
      "deletefile",
      "deletefolder",
      "addfolder",
      "sharefiles"
    ];
        let result = "";
        let v = false;

        for (let x = 0; x < AccessSwitch.length; x++) {
            if (AccessSwitch[x].checked) {
                v = true;
            } else {
                v = false;
            }
            if (x != 0) {
                result += ',"' + accessName[x] + '":' + v;
            } else {
                result += '"' + accessName[x] + '":' + v;
            }
        }
        console.log("getAccessString: ", result);
        return encodeURI("{" + result + "}");
    };

    const _addUser = () => {
        let AccessSwitch = document.querySelectorAll(".AccessRightsSwitch");
        let userName = document.querySelector("#UserName").value;
        let companyName = document.querySelector("#CompanyName").value;
        let userPassword = document.querySelector("#UserPasswd").value;
        let userRole = sel[sel.selectedIndex].innerHTML;
        let userRootPath = document.querySelector("#RootPath").value;
        let expirateDate = document.querySelector("#ExpirateDate").value;

        if (userRootPath.trim() === "" && userRole !== "Admin") {
            showToast("New User", "Empty RootPath ", "error");
            return false;
        }

        let result = _getAccessString(AccessSwitch);

        let data = {
            userName: userName,
            userPassword: Base64.encode(md5(userPassword)),
            companyName: companyName,
            userRole: userRole,
            expirateDate: expirateDate,
            rootPath: userRootPath,
            accessRights: result,
            unixDate: moment(expirateDate).unix()
        };
        document.querySelector("#waiting").classList.add("active");
        axios.post("/adduser", data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userData.Token
                },
                timeout: 30000
            })
            .then(d => {
                document.querySelector("#waiting").classList.remove("active");
                if (userData.RunMode === "DEBUG") console.log(d.data.status);
                if (d.data.status === "OK") {
                    showToast("Usuario " + d.data.message, "success");
                    document.getElementById("refresh").click();
                    document.querySelector("#formAddUser").reset();
                    changeAccessRights(document.querySelectorAll(".AccessRightsSwitch"), "opt1");
                } else {
                    showToast("Usuario ", "Error al añadir usurio "+ d.data.message, "error");
                }
            })
            .catch(e => {
                document.querySelector("#waiting").classList.remove("active");
                showToast(
                    "User",
                    "Error al añadir usuario " + data.UserName + ".<br>Err:" + e,
                    "error"
                );
                if (userData.RunMode === "DEBUG") console.log(e);
            });
    };
}

////////////////////////////////////
// End user manage module
///////////////////////////////////