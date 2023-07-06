//login logic
function adminCallback(resp) {
  resp.text().then((data) => {
    console.log(JSON.stringify(data));
  });
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
      body: JSON.stringify(data),
    }).then(adminCallback);
  }
});
