/* jshint laxbreak: true */
import moment from "moment";
import axios from "axios";
import { getRealPath, serializeObject } from "./general";

import { modalDialog } from "../vendor/modalDialog";

import uuidv4 from "uuid/v4";
import DataTable from "../vendor/dataTables";


let htmlAuditTemplate = `
<div>
      <div class="head-Title">Audit Log</div> 
      <table id="AuditTableList" class="tableList audit">
        <thead class="audit">
          <tr>
            <th>Id</th>
            <th>Client IP</th>
            <th>User Name</th>
            <th>Action</th>
            <th>Result</th>
            <th data-type="date" data-format="YYYY/MM/DD">Date</th>
            <th>Message</div>
          </tr>
        </thead>
        <tbody id="bodyList" class="audit">    
        </tbody>
      </table>
      <div class="AddUserModalContent-footer">
        <div class="button-container">
            <button class="waves-effect waves-teal btn-flat btn2-unify" id="btn-EditSharedFileCancel" type="submit" name="action">Close</button>
        </div> 
      </div>
</div>
`;


let htmlLogFileTemplate = `
<div>
      <div class="head-Title">Log</div> 
      <div class="viewlog">      
        <div id="logcontent" style="overflow: auto;max-width: 80%"> 
        </div>
      </div>
      <div class="AddUserModalContent-footer">
        <div class="button-container">
            <button class="waves-effect waves-teal btn-flat btn2-unify" id="btn-EditSharedFileCancel" type="submit" name="action">Close</button>
        </div> 
      </div>
</div>
`;




export function showAudit() {
    let AddUserModalContent = document.querySelector("#AddUserModalContent");
    let containerOverlay = document.querySelector(".container-overlay");

    AddUserModalContent.innerHTML = htmlAuditTemplate;
    $u("#AddUserModalContent").addClass("edit");
    AddUserModalContent.style.display = "block";
    containerOverlay.style.display = "block";
    document.querySelector("#waiting").classList.add("active");
    axios
    //.get("/admin/audit/" + userData.UserName, {
        .get("/admin/audit", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.Token
            },
            timeout: 300000
        })
        .then(d => {
            document.querySelector("#waiting").classList.remove("active");
            if (userData.RunMode === "DEBUG") console.log("Hello: ", d.data.status);
            if (d.data.status === "OK") {
                let auditrows = d.data.data;
                let i;
                let htmlListContent = "";
                let bodyList = document.querySelector("#bodyList");
                if (userData.RunMode === "DEBUG") console.log("files: ", auditrows.length);
                for (i = 0; i < auditrows.length; i++) {
                    htmlListContent += `
                  <tr class="data-row">
                    <td>${auditrows[i].id}</td>
                    <td>${auditrows[i].ClientIP}</td>
                    <td>${auditrows[i].UserName}</td>
                    <td>${auditrows[i].Action}</td>
                    <td>${auditrows[i].Result}</td>
                    <td>${auditrows[i].date}</td>
                    <td>${auditrows[i].Message}</td>
                  </tr>`;

                    //console.log('User Role. ',users[i].UserRole.trim().toUpperCase());
                }
                bodyList.innerHTML = htmlListContent;

                let table = new DataTable(
                    document.querySelector("#AuditTableList"), {
                        searchable: true,
                        fixedHeight: true,
                        info: false,
                        perPageSelect: null,
                        perPage: 200
                    }
                );

                [].forEach.call(
                    document.querySelectorAll(".del-SahredFile-icon"),
                    function(el) {
                        el.addEventListener("click", function(e) {
                            let userId = e.target.id.slice(0, -3);
                            let userName =
                                e.target.parentNode.parentNode.children[1].innerHTML;
                            userName = userName.charAt(0).toUpperCase() + userName.slice(1);
                            console.log("userId: ", userId);
                            _removeUser(userId, userName, d => {
                                showToast(
                                    "Delete User",
                                    `Usuario ${userName} borrado`,
                                    "success"
                                );
                                AddUserModalContent.style.display = "none";
                                $u("#AddUserModalContent").removeClass("edit");
                                containerOverlay.style.display = "none";
                                document.getElementById("userMod").click();
                            });
                        });
                    }
                );

                [].forEach.call(
                    document.querySelectorAll(".edit-SharedFile-icon"),
                    function(el) {
                        el.addEventListener("click", function(e) {
                            let userId = e.target.id.slice(0, -3);
                            console.log("userId: ", userId);
                            _editUser(userId, d => {
                                document.querySelector("#AddUserModalContent").style.display =
                                    "none";
                                $u("#AddUserModalContent").removeClass("edit");
                                document.querySelector(".container-overlay").style.display =
                                    "none";
                                showAddUserForm("Edit User", d);
                            });
                        });
                    }
                );

                document
                    .querySelector("#btn-EditSharedFileCancel")
                    .addEventListener("click", e => {
                        e.preventDefault();
                        AddUserModalContent.style.display = "none";
                        $u("#AddUserModalContent").removeClass("edit");
                        containerOverlay.style.display = "none";
                    });
            } else {
                showToast("Users", d.data.message, "error");
            }
        })
        .catch(e => {
            document.querySelector("#waiting").classList.remove("active");
            if (userData.RunMode === "DEBUG") console.log(e);
            showToast("Users", e, "error");
        });
}

export function showLog() {
    let AddUserModalContent = document.querySelector("#AddUserModalContent");
    let containerOverlay = document.querySelector(".container-overlay");

    AddUserModalContent.innerHTML = htmlLogFileTemplate;
    $u("#AddUserModalContent").addClass("edit");
    AddUserModalContent.style.display = "block";
    containerOverlay.style.display = "block";
    document.querySelector("#waiting").classList.add("active");
    axios
    //.get("/admin/audit/" + userData.UserName, {
        .get("/admin/log", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.Token
            },
            timeout: 300000
        })
        .then(d => {
            document.querySelector("#waiting").classList.remove("active");
            if (userData.RunMode === "DEBUG") console.log("Hello: ", d.data.status);
            if (d.data.status === "OK") {
                let auditrows = d.data.data;
                let i;
                let htmlListContent = "";
                let logcontent = document.querySelector("#logcontent");
                if (userData.RunMode === "DEBUG") console.log("files: ", auditrows.length);
                for (i = 0; i < auditrows.length; i++) {

                    if (auditrows[i].indexOf("[ERROR]") > -1) {
                        htmlListContent += `
                        <pre class="logFail">
                          ${auditrows[i]}
                        </pre>`;

                    } else {
                        if (auditrows[i].indexOf("[WARNING]") > -1) {
                            htmlListContent += `
                            <pre class="logWarning">
                              ${auditrows[i]}
                            </pre>`;

                        } else {
                            htmlListContent += `
                            <pre class="logInfo">
                              ${auditrows[i]}
                            </pre>`;
                        }
                    }

                    //console.log('User Role. ',users[i].UserRole.trim().toUpperCase());
                }
                logcontent.innerHTML = htmlListContent;

                document
                    .querySelector("#btn-EditSharedFileCancel")
                    .addEventListener("click", e => {
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