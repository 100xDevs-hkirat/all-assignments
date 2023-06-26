const http = require("http");
const server = require("./index");

const username = "testuser";
const password = "testpassword";

describe("API Tests", () => {
  let globalServer;
  let courseId;

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

  it("should allow admins to signup", async () => {
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
    expect(response.body).toBe(
      JSON.stringify({ message: "Admin created successfully" })
    );
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

    expect(response.statusCode).toBe(404);
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
    expect(response.body).toBe(
      JSON.stringify({ message: "Logged in successfully" })
    );
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
        username: username,
        password: password,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(201);

    const responseBody = JSON.parse(response.body);

    expect(responseBody.message).toBe("Course created successfully");
    expect(responseBody.courseId).toBeTruthy();

    courseId = responseBody.courseId;
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
        username: username,
        password: password,
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
        username: username,
        password: password,
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
        username: username,
        password: password,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).length).toBeTruthy();
  });
});

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
