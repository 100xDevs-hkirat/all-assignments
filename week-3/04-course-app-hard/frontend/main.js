// const _BASE_URL = "http://localhost:3000";
// console.log("Bhaiii");

// async function onSignUp() {
//     let adminName = document.getElementById("AdmName").value;
//     let adminPassword = document.getElementById("AdmPassword").value;
//     // console.log(adminName);
//     // console.log(adminPassword);

//     let uploadJson = JSON.stringify(
//         {
//             "adminName": adminName,
//             "adminPassword": adminPassword
//         }
//     );
//     let admSignUpRes = await fetch(_BASE_URL + "/admin/signup", {
//         method: "POST", body: uploadJson, headers: {
//             "Content-Type": "application/json"
//         }
//     })
//     // then((value) => {

//     // console.log(admSignUpRes.type);
//     // });
//     //  admSignUpRes.json().then(ele => {
//     //     console.log(ele.message);
//     // })
//     let data = await admSignUpRes.json();
//     let parentId = document.getElementById("parent");
//     parentId.innerHTML = "";
//     let child = document.createElement("p");
//     if (data.statusCode == 1) {
//         child.innerHTML = "Account Created";
//         localStorage.setItem("token", data.token);
//         window.location.href = "./admin/admin.html"
//     } else {
//         child.innerHTML = data.message;
//         // window.location.href = "./admin/admin.html"

//     }
//     parentId.append(child);

// }



// async function onSignIn() {
//     let adminName = document.getElementById("AdmName").value;
//     let adminPassword = document.getElementById("AdmPassword").value;
//     // console.log(adminName);
//     // console.log(adminPassword);

//     let uploadJson = JSON.stringify(
//         {
//             "adminName": adminName,
//             "adminPassword": adminPassword
//         }
//     );
//     let admSignUpRes = await fetch(_BASE_URL + "/admin/login", {
//         method: "POST", body: uploadJson, headers: {
//             "Content-Type": "application/json"
//         }
//     })
//     // then((value) => {

//     // console.log(admSignUpRes.type);
//     // });
//     //  admSignUpRes.json().then(ele => {
//     //     console.log(ele.message);
//     // })
//     let data = await admSignUpRes.json();
//     let parentId = document.getElementById("parent");
//     parentId.innerHTML = "";
//     let child = document.createElement("p");
//     if (data.statusCode == 1) {
//         child.innerHTML = "Account Created";
//         localStorage.setItem("token", data.token);
//         window.location.href = "./admin/admin.html"
//     } else {
//         child.innerHTML = data.message;
//         // window.location.href = "./admin/admin.html"

//     }
//     parentId.append(child);

// }

