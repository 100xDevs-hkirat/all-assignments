//login logic
function loginCallback(resp) {
  const authToken = resp.headers.get("Authorization");
  console.log(authToken);
}
document.getElementById("loginform").addEventListener("submit", (e) => {
  e.preventDefault();
  const adminUrl = "http://localhost:3000/admin/login";
  const userUrl = "http://localhost:3000/users/login";
  const role = document.getElementById("role").value;
  const form = e.target;
  const formdata = new FormData(form);
  const data = Object.fromEntries(formdata.entries());
  if (role == "admin") {
    fetch(adminUrl, {
      method: "POST",
      headers: data,
    }).then(loginCallback);
  } else {
    fetch(userUrl, {
      method: "POST",
      headers: data,
    }).then(loginCallback);
  }
});

function signCallback(resp) {
  const authToken = resp.headers.get("Authorization");
  console.log(authToken);
}
document.getElementById("signUpform").addEventListener("submit", (e) => {
  e.preventDefault();
  const adminUrl = "http://localhost:3000/admin/signup";
  const userUrl = "http://localhost:3000/users/signup";
  const role = document.getElementById("role").value;
  const form = e.target;
  const formdata = new FormData(form);
  const data = Object.fromEntries(formdata.entries());
  if (role == "admin") {
    fetch(adminUrl, {
      method: "POST",
      headers: data,
    }).then(signCallback);
  } else {
    fetch(userUrl, {
      method: "POST",
      headers: data,
    }).then(signCallback);
  }
});
