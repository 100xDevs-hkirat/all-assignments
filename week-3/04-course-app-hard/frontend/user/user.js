let content = document.getElementById("content");
let loadingChild = document.createElement("p");
loadingChild.innerHTML = "Loading ...";
const _BASE_URL = "http://localhost:3000";


async function onSignUp() {
    content.appendChild(loadingChild);
    let userName = document.getElementById("UrsName").value;
    let userPassword = document.getElementById("UrsPassword").value;
    let sendJson = {
        "userName": userName,
        "userPassword": userPassword
    }
    let resAllCourses = await fetch(_BASE_URL + "/users/signup", {
        method: "POST", body: JSON.stringify(sendJson),
        headers: {
            "Content-Type": "application/json"
        }

    });
    let resJson = await resAllCourses.json();
    if (resJson.statusCode == 1) {
        localStorage.setItem("token", resJson.token);
        loadingChild.innerHTML = "Account SignIn Successfully";
        // window.location.href = ("./all_courses/all_courses.html");
    } else {
        loadingChild.innerHTML = resJson.message;
        setTimeout(() => {
            loadingChild.innerHTML = "";

        }, 2000);
    }
}
async function onSignIn() {
    content.appendChild(loadingChild);

    let userName = document.getElementById("UrsName").value;
    let userPassword = document.getElementById("UrsPassword").value;
    let sendJson = {
        "userName": userName,
        "userPassword": userPassword
    }
    let resAllCourses = await fetch(_BASE_URL + "/users/login", {
        method: "POST", body: JSON.stringify(sendJson),
        headers: {
            "Content-Type": "application/json"
        }

    });
    let resJson = await resAllCourses.json();
    if (resJson.statusCode == 1) {
        localStorage.setItem("token", resJson.token);
        loadingChild.innerHTML = "You are now signed in to your account.";
        // window.location.href = ("./all_courses/all_courses.html");
    } else {
        loadingChild.innerHTML = resJson.message;
        setTimeout(() => {
            loadingChild.innerHTML = "";

        }, 2000);
    }
}