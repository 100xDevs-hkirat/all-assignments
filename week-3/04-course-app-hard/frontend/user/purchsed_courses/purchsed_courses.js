const token = localStorage.getItem("token");
const _BASE_URL = "http://localhost:3000";

let content = document.getElementById("content");
let loadingChild = document.createElement("p");
loadingChild.innerHTML = "Loading...";
content.appendChild(loadingChild);
purchsed_courses();
async function purchsed_courses() {
    let purchsedCourseRes = await fetch(_BASE_URL + "/users/purchasedCourses", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    });

    let purchasedCoursesJson = await purchsedCourseRes.json();
    if (purchasedCoursesJson.statusCode == 1) {
        loadingChild.innerHTML = "";
        console.log(purchasedCoursesJson.data.length);

        for (let i = 0; i < purchasedCoursesJson.data.length; i++) {
            let brChild = document.createElement("br");

            let nameChild = document.createElement("p");
            let detailsChild = document.createElement("p");
            let amountChild = document.createElement("p");
            nameChild.innerHTML = "Name : " + purchasedCoursesJson.data[i].courseName;
            detailsChild.innerHTML = "Details : " + purchasedCoursesJson.data[i].courseDetails;
            amountChild.innerHTML = "Rs : " + purchasedCoursesJson.data[i].amount;

            content.appendChild(nameChild);
            content.appendChild(detailsChild);
            content.appendChild(amountChild);
            content.appendChild(brChild);
            content.appendChild(brChild);
            content.appendChild(brChild);
            content.appendChild(brChild);




        }

    } else {
        loadingChild.innerHTML = purchasedCoursesJson.message;
        // setTimeout(() => {
        //     loadingChild.innerHTML = "";
        // }, 2000)
    }
}
