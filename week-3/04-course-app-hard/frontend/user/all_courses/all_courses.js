const token = localStorage.getItem("token");
const _BASE_URL = "http://localhost:3000";

let content = document.getElementById("content");
let loadingChild = document.createElement("p");
loadingChild.innerHTML = "Loading ...";
content.appendChild(loadingChild);
getAllCourses();

async function buyCourse(courseId) {
    loadingChild.innerHTML = "";

    console.log(_BASE_URL + "/users/courses/" + courseId);
    let res = await fetch(_BASE_URL + "/users/courses/" + courseId, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "token": token
        }
    });
    console.log(res);
    let resJson1 = await res.json();

    if (resJson1.statusCode == 1) {
        setTimeout(() => {
            loadingChild.innerHTML = "";
        }, 2000);
    } else {
        loadingChild.innerHTML = resJson1.message;
        setTimeout(() => {
            loadingChild.innerHTML = "";
        }, 2000);
    }
}
async function getAllCourses() {
    let res = await fetch(_BASE_URL + "/users/courses", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    });
    let resJson = await res.json();
    if (resJson.statusCode == 1) {
        loadingChild.innerHTML = "";
        for (let i = 0; i < resJson.data.length; i++) {
            console.log(resJson.data[i]._id);
            let brChild = document.createElement("br");
            let nameChild = document.createElement("p");
            let detailsChild = document.createElement("p");
            let amountChild = document.createElement("p");
            let buyButton = document.createElement("button");
            buyButton.innerHTML = "Buy Now"
            // buyButton.setAttribute("onclick", "buyCourse(resJson.data[i]._id);");
            // button.setAttribute("name", "Buy Now");
            buyButton.onclick = function () {
                buyCourse(resJson.data[i]._id);
            };
            nameChild.innerHTML = resJson.data[i].courseName;
            detailsChild.innerHTML = resJson.data[i].courseDetails;
            amountChild.innerHTML = resJson.data[i].amount;

            content.appendChild(nameChild);
            content.appendChild(detailsChild);
            content.appendChild(amountChild);
            content.appendChild(buyButton);

            content.appendChild(brChild);
            content.appendChild(brChild);
            content.appendChild(brChild);

        }

    } else {
        loadingChild.innerHTML = resJson.message;
        // setTimeout(() => {
        //     loadingChild.innerHTML = "";
        // }, 2000);
    }

}
