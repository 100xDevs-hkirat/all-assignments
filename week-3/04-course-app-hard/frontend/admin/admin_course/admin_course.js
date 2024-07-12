let adminToken = localStorage.getItem("token");
const _BASE_URL = "http://localhost:3000";

let divContent = document.getElementById("mainContent");
let loadingChild = document.createElement("p");
loadingChild.innerHTML = "Loading...";
divContent.appendChild(loadingChild);
getUserData();
async function getUserData() {
    let res = await fetch(_BASE_URL + "/admin/courses", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": adminToken
        }
    });
    console.log(res);
    let courses = await res.json();
    console.log(courses);

    if (courses.statusCode == 1) {
        if (courses.data.length > 0) {
            divContent.innerHTML = "";

            for (let i = 0; i < courses.data.length; i++) {
                let childBr = document.createElement("br");
                let childName = document.createElement("p");
                let childDetails = document.createElement("p");
                let childamount = document.createElement("p");
                childName.innerHTML = ("Name :" + courses.data[i].courseName);
                childDetails.innerHTML = ("Details :" + courses.data[i].courseDetails);
                childamount.innerHTML = ("Rs :" + courses.data[i].amount);
                divContent.appendChild(childName);
                divContent.appendChild(childDetails);
                divContent.appendChild(childamount);
                divContent.appendChild(childBr);
                divContent.appendChild(childBr);
            }
        } else {
            loadingChild.innerHTML = "No Course Fould";
        }

    } else {
        loadingChild.innerHTML = "No course Found";
    }

}  