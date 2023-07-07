import React from "react";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    function handleClick(){
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        fetch("http://localhost:3000/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            username: username,
            password: password,
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

    return <div>
        <h1>Login to admin dashboard</h1>
        <br/>
        Username <input type={"text"} name="username" id="username"/>
        <br/><br />
        Password <input type={"text"} name="password" id="password"/>
        <br/>
        <button onClick={handleClick}>Login</button>
        <br/>
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;