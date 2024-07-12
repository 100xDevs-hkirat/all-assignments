const token = localStorage.getItem("token");
const _BASE_URL = "http://localhost:3000";

let content = document.getElementById("content");
let loadingChild = document.createElement("p");
loadingChild.innerHTML = "";
content.appendChild(loadingChild);

async function onCourseCreatedPressed() {
    loadingChild.innerHTML = "Loading...";

    let courseName = document.getElementById("courseNameInput").value;
    let courseDetails = document.getElementById("courseDetailsInput").value;
    let amount = document.getElementById("amountInput").value;


    let rendData = {
        "courseName": courseName,
        "courseDetails": courseDetails,
        "amount": amount,
    }
    let res = await fetch(_BASE_URL + "/admin/courses", {
        method: "POST",
        body: JSON.stringify(rendData),
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    });


    let resData = await res.json();
    if (resData.statusCode == 1) {
        loadingChild.innerHTML = resData.message;
        setTimeout(() => {
            loadingChild.innerHTML = "";
        }, 2000)
    }
}