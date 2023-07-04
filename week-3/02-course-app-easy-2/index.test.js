const http = require("http");
const server = require("./index");

const adminusername = "admin";
const adminpassword = "pass";
let adminAuthHeader, userAuthHeader, admincourseId;
const userusername = "user";
const userpassword = "pass";

describe("API Tests", () => {
  let globalServer;
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

  it("should allow admin to signup", async () => {
    const requestBody = JSON.stringify({
      username: adminusername,
      password: adminpassword,
    });

    const options = {
      method: "POST",
      path: "/admin/signup",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": requestBody.length,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(201);
    // expect(response.body).toBe("Admin created successfully");
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("Admin created successfully");
    expect(responseBody.token).toBeDefined();
    adminAuthHeader = responseBody.token;
  });

  it("should allow admin to login", async () => {
    const options = {
      method: "POST",
      path: "/admin/login",
      headers: {
        "Content-Type": "application/json",
        username: adminusername,
        password: adminpassword,
      },
    };

    const response = await sendRequest(options);
    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("Logged in successfully");
    expect(responseBody.token).toBeDefined();
    adminAuthHeader = `Bearer ${responseBody.token}`;
  });

  it("admin should be able to create course", async () => {
    const requestBody = JSON.stringify({
      title: "mycourse",
      description: "course description",
      price: 100,
      imageLink: "https://somelink.com",
      published: false,
    });
    const options = {
      method: "POST",
      path: "/admin/courses",
      headers: {
        "Content-Type": "application/json",
        authorization: adminAuthHeader,
      },
    };

    const response = await sendRequest(options, requestBody);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("Course created successfully");
    expect(responseBody.courseId).toBeDefined();
    admincourseId = responseBody.courseId;
  });

  it("admin should be able to edit course", async () => {
    const requestBody = JSON.stringify({
      title: "updatedmycourse",
      description: "updated course description",
      price: 500,
      imageLink: "https://somelink.com",
      published: true,
    });
    const options = {
      method: "PUT",
      path: `/admin/courses/${admincourseId}`,
      headers: {
        "Content-Type": "application/json",
        authorization: adminAuthHeader,
      },
    };

    const response = await sendRequest(options, requestBody);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("Course updated successfully");
  });

  it("admin should be able to get courses", async () => {
    const options = {
      method: "GET",
      path: "/admin/courses/",
      headers: {
        "Content-Type": "application/json",
        authorization: adminAuthHeader,
      },
    };

    const response = await sendRequest(options);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toBeDefined();
  });

  it("it should allow user to signup", async () => {
    const requestBody = JSON.stringify({
      username: userusername,
      password: userpassword,
    });

    const options = {
      method: "POST",
      path: "/users/signup",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": requestBody.length,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(201);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("User created successfully");
    expect(responseBody.token).toBeDefined();
    userAuthHeader = `Bearer ${responseBody.token}`;
  });

  it("it should allow user to login", async () => {
    const options = {
      method: "POST",
      path: "/users/login",
      headers: {
        "Content-Type": "application/json",
        username: userusername,
        password: userpassword,
      },
    };

    const response = await sendRequest(options);
    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("Logged in successfully");
    expect(responseBody.token).toBeDefined();
  });

  it("user should be able to purchase courses", async () => {
    const options = {
      method: "POST",
      path: `/users/courses/${admincourseId}`,
      headers: {
        "Content-Type": "application/json",
        authorization: userAuthHeader,
      },
    };

    const response = await sendRequest(options);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("Course purchased successfully");
  });

  it("user should be able to get purchased courses", async () => {
    const options = {
      method: "GET",
      path: "/users/purchasedCourses",
      headers: {
        "Content-Type": "application/json",
        authorization: userAuthHeader,
      },
    };

    const response = await sendRequest(options);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toBeDefined();
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
