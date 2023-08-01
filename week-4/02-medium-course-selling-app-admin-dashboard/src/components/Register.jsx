import React from "react";

function Register() {
  function handleClick() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    fetch("http://localhost:3000/admin/signup", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        resp.json().then((parsedResp) => {
            localStorage.setItem('token',parsedResp.token);
          console.log(parsedResp);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div>
      <h1>Register to the website</h1>
      <br />
      <label htmlFor="username" style={{ marginRight: "10px" }}>
        Username
      </label>
      <input type="text" name="username" id="username" />
      <br /> <br />
      <label htmlFor="password" style={{ marginRight: "10px" }}>
        Password
      </label>
      <input type="text" name="password" id="password" />
      <br />
      <button name="register" onClick={handleClick}>
        Register
      </button>
      <br />
      Already a user? <a href="/login">Login</a>
    </div>
  );
}

export default Register;
