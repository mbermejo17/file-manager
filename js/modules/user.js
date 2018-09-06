import axios from 'axios';
import { Base64 } from "js-base64";
import md5 from "../vendor/md5.min";
import moment from "moment";
import { modalDialog } from "../vendor/modalDialog";

////////////////////////////////////
// Users manage module
///////////////////////////////////

/* let htmlUserFormTemplate = `
      <div id="AddUserModal">
          <h4 id ="userFormTitle" class="header2">New User</h4>
          <div class="row">
              <form class="col s12 m12 l12" id="formAddUser">
                  <div class="row">
                      <div class="userForm-input-field col s6"><input id="UserName" type="text" class="userForm-input"/>
                      <label for="UserName" class="userForm-label">Name</label></div>
                      <div class="input-field col s6"><input id="CompanyName" type="text" class="userForm-input"/>
                      <label for="CompanyName" class="userForm-label">Company Name</label></div>
                  </div>
                  <div class="row">
                      <div class="userForm-input-field"><input id="UserPasswd" type="password" autocomplete="off" class="userForm-input"/>
                      <label for="UserPasswd" class="userForm-label">Password</label></div>
                      <div class="userForm-input-field"><input id="repeatUserPasswd" type="password" autocomplete="off" class="userForm-input" />
                      <label for="repeatUserPasswd" class="userForm-label">Repeat Password</label></div>
                  </div>
                  <div class="row">
                      <div class="userForm-input-field">
                      <input id="rootpath" type="text" class="userForm-input"/>
                      <label for="rootpath" class="userForm-label">Root Path</label>
                      </div>
                      <i class="mdi-action-find-in-page col s2" id="FindPath"></i>
                      <div class="userForm-input-field right">
                        <input class="datepicker userForm-input" id="ExpirateDate" type="date"/>
                        <label for="ExpirateDate" class="userForm-label">Expiration Date</label>
                      </div>
                  </div>
                  <div class="row">
                      <div class="rights">Access Rights</div>
                  </div>
                  <div class="row">
                      <div class="userForm-input-field"></div>
                      <div class="userForm-input-field" style="line-height: .9em;" >
                        <input id="Role" type="hidden" value="" class="userForm-input"/>
                        <select id="RoleOptions" name="optionsname" required="">
                          <option value="opt1">User</option>
                          <option value="opt2">Admin</option>
                          <option value="opt3">Advanced User</option>
                          <option value="opt4">Custom</option>
                        </select>
                        <label>User Role</label>
                      </div>
                      <div class="userForm-input-field"></div>
                  </div>
                  <br/>
                  <div class="row">
                      <span class="label-switch">Download</span>
                      <div class="switch">
                        <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                        <span class="lever"></span>On</label>
                      </div>
                      <span class="col s2"></span>
                      <span class="label-switch">Upload</span>
                      <div class="switch">
                        <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                        <span class="lever"></span>On</label>
                      </div>
                  </div>
                  <div class="row"><span class="label-switch">Delete File</span>
                      <div class="switch">
                        <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                        <span class="lever"></span>On</label>
                      </div>
                      <span class="col">   </span>
                      <span class="label-switch">Delete Folder</span>
                      <div class="switch">
                        <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                        <span class="lever"></span>On</label>
                      </div>
                  </div>
                  <div class="row">
                      <span class="label-switch">Add Folder</span>
                      <div class="switch">
                        <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                        <span class="lever"></span>On</label>
                      </div>
                      <span class="col s2"></span>
                      <span class="label-switch">Share files</span>
                      <div class="switch">
                        <label>Off<input type="checkbox" class="AccessRightsSwitch"/>
                        <span class="lever"></span>On</label>
                      </div>
                  </div>
                  <div class="row"><br/>
                      <div class="input-field"></div>
                      <div class="input-field"><button class="waves-effect waves-teal btn-flat btn2-unify right" id="btn-addUserCancel" type="submit" name="action">Cancel</button></div>
                      <div class="input-field"><button class="waves-effect waves-teal btn-flat btn2-unify right" id="btn-addUserAcept" type="submit" name="action">Accept</button></div>
                  </div>
              </form>
          </div>
      </div>`; */

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
              <input id="rootpath" type="text" class="userForm-input">
                <label for="rootpath" class="userForm-label">Root Path</label>
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

let htmlSearchUserTemplate = `<div id="searchUserModal">
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
                                </div>`;

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
            AccessSwitch[0].checked = true;
            AccessSwitch[1].checked = true;
            AccessSwitch[2].checked = false;
            AccessSwitch[3].checked = false;
            AccessSwitch[4].checked = false;
            AccessSwitch[5].checked = false;
            AccessSwitch[2].disabled = true;
            AccessSwitch[3].disabled = true;
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
            AccessSwitch[2].checked = false;
            AccessSwitch[2].disabled = true;
            AccessSwitch[3].checked = false;
            AccessSwitch[3].disabled = true;
            AccessSwitch[4].checked = true;
            AccessSwitch[5].checked = false;
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


export function searchUserName(userName) {
    if (userData.RunMode === "DEBUG") console.log(userName);
    $u("#waiting").addClass("active");
    axios.get('/searchuser?userName=" + userName', {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.Token
        },
        timeout: 30000
    }).then((d) => {
        $u("#waiting").removeClass("active");
        if (userData.RunMode === "DEBUG") console.log(d);
        if (d.data.status == "OK") {
            showAddUserForm("Edit User", d.data);
        } else {
            showToast('Search Users', d.data.message, "error");
        }
    }).catch((e) => {
        $u("#waiting").removeClass("active");
        showToast(
            'Search Users', "Error al buscar usuario " + userName + ".<br>Err:" + e,
            "error"
        );
        if (userData.RunMode === "DEBUG") console.log(e);
    });
}


export function LoadUsersList(el) {

    $u("#waiting").addClass("active");
    axios.get('/users', {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.Token
        },
        timeout: 30000
    }).then((d) => {
        $u("#waiting").removeClass("active");
        if (userData.RunMode === "DEBUG") console.log(d);
        if (d.data.atatus === 'OK') {
            let users = d.data.data;
            let options = '';
            for (let x = 0; x < users.length; x++) {
                options += `<option id="${users[x].UserId}">${users[x].UserName}</option>`;
            }
            el.innerHTML = options;
        } else {
            showToast(
                "Users",
                d.data.data.message,
                "error"
            );
        }
    }).catch((e) => {
        $u("#waiting").removeClass("active");
        if (userData.RunMode === "DEBUG") console.log(e);
        showToast('Users', e, "error");
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
    //LoadUsersList(document.getElementById('usersList'));
    SearchUserModalContent.style.display = "block";
    containerOverlay.style.display = "block";
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + userData.Token
        }
    };
    $u("#waiting").addClass("active");
    axios.get('/users', config)
        .then((res) => {
            $u("#waiting").removeClass("active");
            let listContent = '';
            console.log(res.data.data);
            res.data.data.forEach(function(value, idx, arr) {
                listContent += `<a href="#">${arr[idx].UserName}</a>`;
            });
            document.getElementById('user-List').innerHTML = listContent;
            console.log(listContent);
        })
        .catch((err) => {
            $u("#waiting").removeClass("active");
            console.log(err);
        });

    SearchUserModalContent.addEventListener("keyup", e => {
        e.preventDefault();

        let input = document.getElementById('searchUserName');
        let filter = input.value.toUpperCase();
        let div = document.getElementById('user-List');
        let a = div.getElementsByTagName('a');
        for (let i = 0; i < a.length; i++) {
            if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = '';
            } else {
                a[i].style.dsiplay = 'none';
            }
        }
        /* if (e.keyCode === 13) {
          searchUserName(document.getElementById("searchUserName").value);
        } */
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


export function selectRole(element, role) {
    if (userData.RunMode === "DEBUG") console.log(role);
    for (let x = 0; x < element.options.length; x++) {
        if (userData.RunMode === "DEBUG") console.log("option: ", element.options[x].text);
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
    let SearchUserModalContent = document.querySelector(
        "#searchUserModalContent"
    );
    let mode = data ? "edit" : "add";
    let oldData = null;
    SearchUserModalContent.style.display = "none";

    AddUserModalContent.innerHTML = htmlUserFormTemplate;
    if (data) {
        if (userData.RunMode === "DEBUG") console.log(data);
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
        if (data.Role.toUpperCase() === "CUSTOM") checkAccessRights(data.AccessString);
        containerOverlay.style.display = "block";
        AddUserModalContent.style.display = "block";
        document.querySelector("label[for=UserName]").classList.add("active");
        document.querySelector("label[for=CompanyName]").classList.add("active");
        document.querySelector("label[for=UserPasswd]").classList.add("active");
        document.querySelector("label[for=repeatUserPasswd]").classList.add("active");
        document.querySelector("label[for=RootPath]").classList.add("active");
        document.querySelector("#UserName").disabled = true;

        document.querySelector("#btn-addUserCancel").addEventListener("click", e => {
                e.preventDefault();
                //containerOverlay.style.display = "none";
                AddUserModalContent.style.display = "none";
                SearchUserModalContent.style.display = "block";
            });
        document.querySelector("#btn-addUserAcept").addEventListener("click", e => {
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
        document.querySelector("#btn-addUserCancel").addEventListener("click", e => {
                e.preventDefault();
                containerOverlay.style.display = "none";
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
        if (userData.RunMode === 'DEBUG') console.log(queryString);
        return queryString;
    };

    const _updateUser = (oData) => {
        let queryString = _getChanges();
        if (queryString) {
            let data = {
                userName: oData.UserName,
                queryString: queryString
            };
            $u("#waiting").addClass("active");
            axios.post('/updateuser', data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userData.Token
                },
                timeout: 30000
            }).then((d) => {
                $u("#waiting").removeClass("active");
                if (userData.RunMode === "DEBUG") console.log(d);
                if (d.data.status === 'OK') {
                    showToast(
                        "User", "Datos usuario " + data.userName + " actualizados.",
                        "success"
                    );
                    document.getElementById("refresh").click();
                }
            }).catch((e) => {
                $u("#waiting").removeClass("active");
                if (userData.RunMode === "DEBUG") console.log(e);
                showToast(
                    "Error al grabar los cambios para el usuario " +
                    data.userName +
                    ".<br>Err:" +
                    e,
                    "error"
                );
            });
        }
    };

    const _getAccessString = AccessSwitch => {
        let accessName = [
            'download',
            'upload',
            'deletefile',
            'deletefolder',
            'addfolder',
            'sharefiles'
        ];
        let result = '';
        let v = false;

        for (let x = 0; x < AccessSwitch.length; x++) {
            if (AccessSwitch[x].checked) {
                v = true;
            } else {
                v = false;
            }
            if (x !=0 ){
                result += ',"' + accessName[x] + '":' + v;
            } else {
                result += '"' + accessName[x] + '":' + v;
            }
        }
        console.log('getAccessString: ',result);
        return encodeURI('{'+result+'}');
    };

    const _addUser = () => {
        let AccessSwitch = document.querySelectorAll(".AccessRightsSwitch");
        let userName = document.querySelector("#UserName").value;
        let companyName = document.querySelector("#CompanyName").value;
        let userPassword = document.querySelector("#UserPasswd").value;
        let userRole = sel[sel.selectedIndex].innerHTML;
        let userRootPath = document.querySelector("#rootpath").value;
        let expirateDate = document.querySelector("#ExpirateDate").value;
        let result = _getAccessString(AccessSwitch);

        if (userData.RunMode === "DEBUG") console.log("User Name: " + userName);
        if (userData.RunMode === "DEBUG") console.log("Company Name: " + companyName);
        if (userData.RunMode === "DEBUG") console.log("Password: " + userPassword);
        if (userData.RunMode === "DEBUG") console.log("Root Path: " + userRootPath);
        if (userData.RunMode === "DEBUG") console.log("Expirate Date: " + expirateDate);
        if (userData.RunMode === "DEBUG") console.log("Role: " + userRole);
        if (userData.RunMode === "DEBUG") console.log("Access Rights: " +  result );
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
        $u("#waiting").addClass("active");
        axios.post('/adduser', data,{
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.Token
            },
            timeout: 30000
        }).then((d) => {
            $u("#waiting").removeClass("active");
            if (userData.RunMode === "DEBUG") console.log(d.data.status);
            if (d.data.status === 'OK') {
                showToast("Usuario " + d.data.message, "success");
                document.getElementById("refresh").click();
                document.querySelector("#formAddUser").reset();
                changeAccessRights(
                    document.querySelectorAll(".AccessRightsSwitch"),
                    "opt1"
                );
            } else {
                showToast("Usuario " + d.data.message, "success");
                //document.getElementById("refresh").click();
                //document.querySelector("#formAddUser").reset();
                /* changeAccessRights(
                    document.querySelectorAll(".AccessRightsSwitch"),
                    "opt1"
                ); */
            }
        }).catch((e) => {
            $u("#waiting").removeClass("active");
            showToast(
                'User', "Error al añadir usuario " + data.UserName + ".<br>Err:" + e,
                "error"
            );
            if (userData.RunMode === "DEBUG") console.log(e);
        });
    };
}

////////////////////////////////////
// End user manage module
///////////////////////////////////