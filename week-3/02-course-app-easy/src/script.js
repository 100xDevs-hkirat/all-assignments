//login logic
function adminCallback(resp) {
  const authToken = resp.headers.get("Authorization");
  console.log(authToken);
}
document.getElementById("loginform").addEventListener("submit", (e) => {
  e.preventDefault();
  const adminUrl = "http://localhost:3000/admin/login";
  const role = document.getElementById("role").value;
  console.log(role);
  const form = e.target;
  const formdata = new FormData(form);
  const data = Object.fromEntries(formdata.entries());
  if (role == "admin") {
    fetch(adminUrl, {
      method: "POST",
      headers: data,
    }).then(adminCallback);
  }
});
