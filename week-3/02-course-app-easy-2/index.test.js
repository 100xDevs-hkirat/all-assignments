const http = require("http");
const server = require("./index");
const jsonwebtoken = require("jsonwebtoken");

const username = "testuser";
const password = "testpassword";

describe("API Tests", () => {
  let globalServer;
  let courseId;
  let adminToken;
  let userToken;

  beforeAll((done) => {
    if (globalServer) {
      globalServer.close();
    }
    globalServer = server.listen(3000);
    done();
  });

  afterAll((done) => {
    globalServer.close(done);
  });

  it("should allow users to signup", async () => {
    const requestBody = JSON.stringify({
      username: username,
      password: password,
    });

    const options = {
      method: "POST",
      path: "/users/signup",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(201);

    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("User created successfully");
    expect(responseBody.token.length).toBeTruthy();

    const token = responseBody.token;
    expect(isValidJWT(token)).toBeTruthy();

    userToken = token;
  });

  it("should allow admins to signup and test validity of jwt", async () => {
    const requestBody = JSON.stringify({
      username: username,
      password: password,
    });

    const options = {
      method: "POST",
      path: "/admin/signup",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(201);

    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("Admin created successfully");
    expect(responseBody.token.length).toBeTruthy();

    const token = responseBody.token;
    expect(isValidJWT(token)).toBeTruthy();
  });

  it("shouldn't allow duplicate usernames for admins", async () => {
    const requestBody = JSON.stringify({
      username: username,
      password: password,
    });

    const options = {
      method: "POST",
      path: "/admin/signup",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(400);
  });

  it("shouldn't allow admins to signup with bad request body", async () => {
    const requestBody = JSON.stringify({ username: username });

    const options = {
      method: "POST",
      path: "/admin/signup",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(400);
  });

  it("should allow admins to login", async () => {
    const requestBody = JSON.stringify({
      username: username,
      password: password,
    });

    const options = {
      method: "POST",
      path: "/admin/login",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(200);

    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("Logged in successfully");
    expect(responseBody.token.length).toBeTruthy();

    // test validity of jwt
    const token = responseBody.token;
    expect(isValidJWT(token)).toBeTruthy();

    adminToken = token;
  });

  it("shouldn't allow admins to login on invalid credentials", async () => {
    const requestBody = JSON.stringify({
      username: username,
      password: "incorrectPass",
    });

    const options = {
      method: "POST",
      path: "/admin/login",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(401);
  });

  it("shouldn't allow admins to login with bad request body", async () => {
    const requestBody = JSON.stringify({ username: username });

    const options = {
      method: "POST",
      path: "/admin/login",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(400);
  });

  it("should allow admins to create courses", async () => {
    const requestBody = JSON.stringify({
      title: "course title",
      description: "course description",
      price: 100,
      imageLink: "https://linktoimage.com",
      published: true,
    });

    const options = {
      method: "POST",
      path: "/admin/courses",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(201);

    const responseBody = JSON.parse(response.body);

    expect(responseBody.message).toBe("Course created successfully");
    expect(responseBody.courseId).toBeTruthy();

    courseId = responseBody.courseId;
  });

  it("should not allow users to access admin routes", async () => {
    const requestBody = JSON.stringify({
      title: "course title",
      description: "course description",
      price: 100,
      imageLink: "https://linktoimage.com",
      published: true,
    });

    const options = {
      method: "POST",
      path: "/admin/courses",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(401);
  });

  it("should allow admins to update courses", async () => {
    const requestBody = JSON.stringify({
      title: "updated course title",
      description: "updated course description",
      price: 100,
      imageLink: "https://linktoimage.com",
      published: true,
    });

    const options = {
      method: "PUT",
      path: `/admin/courses/${courseId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(200);

    expect(response.body).toBe(
      JSON.stringify({ message: "Course updated successfully" })
    );
  });

  it("should send 404 on updating invalid courseId", async () => {
    const requestBody = JSON.stringify({
      title: "updated course title",
      description: "updated course description",
      price: 100,
      imageLink: "https://linktoimage.com",
      published: true,
    });

    const options = {
      method: "PUT",
      path: `/admin/courses/invald-course-id`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(404);
  });

  it("admins should get courses", async () => {
    const options = {
      method: "GET",
      path: `/admin/courses`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).length).toBeTruthy();
  });

  it("users should get courses", async () => {
    const options = {
      method: "GET",
      path: `/users/courses`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).length).toBeTruthy();
  });

  it("non authorized users shouldn't get courses", async () => {
    const options = {
      method: "GET",
      path: `/users/courses`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(401);
  });

  it("shouldn't allow duplicate usernames for users", async () => {
    const requestBody = JSON.stringify({
      username: username,
      password: password,
    });

    const options = {
      method: "POST",
      path: "/users/signup",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(400);
  });

  it("shouldn't allow users to signup with bad request body", async () => {
    const requestBody = JSON.stringify({ username: username });

    const options = {
      method: "POST",
      path: "/users/signup",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(400);
  });

  it("should allow users to login", async () => {
    const requestBody = JSON.stringify({
      username: username,
      password: password,
    });

    const options = {
      method: "POST",
      path: "/users/login",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("Logged in successfully");
    expect(responseBody.token.length).toBeTruthy();

    // test validity of jwt
    const token = responseBody.token;
    expect(isValidJWT(token)).toBeTruthy();
  });

  it("shouldn't allow users to login on invalid credentials", async () => {
    const requestBody = JSON.stringify({
      username: username,
      password: "incorrectPass",
    });

    const options = {
      method: "POST",
      path: "/users/login",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(401);
  });

  it("shouldn't allow users to login with bad request body", async () => {
    const requestBody = JSON.stringify({ username: username });

    const options = {
      method: "POST",
      path: "/users/login",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(400);
  });

  it("should allow users to purchase courses", async () => {
    const options = {
      method: "POST",
      path: `/users/courses/${courseId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);

    const responseBody = JSON.parse(response.body);

    expect(responseBody.message).toBe("Course purchased successfully");
  });

  it("should send 404 on purchasing course with invalid courseId", async () => {
    const options = {
      method: "POST",
      path: `/users/courses/invald-course-id`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(404);
  });

  it("should allow users to get purchased courses", async () => {
    const options = {
      method: "GET",
      path: `/users/purchasedCourses`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).length).toBeTruthy();
  });
});

function isValidJWT(token) {
  try {
    const decoded = jsonwebtoken.decode(token);

    if (decoded) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - currentTimestamp;

      // check if JWT expires with in an hour
      if (expiresIn <= 3600) {
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

function sendRequest(options, requestBody) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        ...options,
        host: "localhost",
        port: 3000,
      },
      (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
          });
        });
      }
    );

    req.on("error", (err) => {
      reject(err);
    });

    if (requestBody) {
      req.write(requestBody);
    }

    req.end();
  });
}
