document.getElementById("admin-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    onpress(); // Call your function to handle the form submission
});

function parsedresponse(data) {
    console.log(data);
}

function callback(resp) {
    resp.json().then(parsedresponse);
}

function onpress() {
    var adminUsername = document.getElementById("admin-username").value;
    var adminPassword = document.getElementById("admin-password").value;
    fetch("http://localhost:3000/admin/signup", {
        method: "POST",
        body: JSON.stringify({
            adminusername: adminUsername,
            adminpassword: adminPassword,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(callback)
    .catch(function (error) {
        console.error('Error:', error);
    });
}