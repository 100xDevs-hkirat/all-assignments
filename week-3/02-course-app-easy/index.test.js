const http = require('http');
const server = require('./index');

const admin = {
  username: 'TestAdmin',
  password: 'TestAdminPass',
};

const user = {
  username: 'TestUser',
  password: 'TestUserPass',
};

describe('API Tests', () => {
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

  it('should allow admins to signup', async () => {
    const requestBody = JSON.stringify({
      username: admin.username,
      password: admin.password,
    });

    const options = {
      method: 'POST',
      path: '/admin/signup',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      JSON.stringify({ message: 'Admin created successfully' })
    );
  });

  it("shouldn't allow duplicate usernames for admins", async () => {
    const requestBody = JSON.stringify({
      username: admin.username,
      password: admin.password,
    });

    const options = {
      method: 'POST',
      path: '/admin/signup',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(403);

    expect(response.body).toBe(
      JSON.stringify({ message: 'Admin already exists' })
    );
  });

  it('should allow admins to login', async () => {
    const options = {
      method: 'POST',
      path: '/admin/login',
      headers: {
        'Content-Type': 'application/json',
        username: admin.username,
        password: admin.password,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      JSON.stringify({ message: 'Logged in successfully' })
    );
  });

  it("shouldn't allow admins to login on invalid credentials", async () => {
    const requestBody = JSON.stringify({
      username: admin.username,
      password: 'incorrectPass',
    });

    const options = {
      method: 'POST',
      path: '/admin/login',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(403);

    expect(response.body).toBe(
      JSON.stringify({ message: 'Admin authentication failed' })
    );
  });

  it("shouldn't allow admins to login with bad request body", async () => {
    const requestBody = JSON.stringify({ username: admin.username });

    const options = {
      method: 'POST',
      path: '/admin/login',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBe(
      JSON.stringify({ message: 'Admin authentication failed' })
    );
  });

  it('should allow admins to create courses', async () => {
    const requestBody = JSON.stringify({
      title: 'course title',
      description: 'course description',
      price: 100,
      imageLink: 'https://linktoimage.com',
      published: true,
    });

    const options = {
      method: 'POST',
      path: '/admin/courses',
      headers: {
        'Content-Type': 'application/json',
        username: admin.username,
        password: admin.password,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(200);

    const responseBody = JSON.parse(response.body);

    expect(responseBody.message).toBe('Course created successfully');
    expect(responseBody.courseId).toBeTruthy();

    courseId = responseBody.courseId;
  });

  it('should allow admins to update courses', async () => {
    const requestBody = JSON.stringify({
      title: 'updated course title',
      description: 'updated course description',
      price: 100,
      imageLink: 'https://linktoimage.com',
      published: true,
    });

    const options = {
      method: 'PUT',
      path: `/admin/courses/${courseId}`,
      headers: {
        'Content-Type': 'application/json',
        username: admin.username,
        password: admin.password,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(200);

    expect(response.body).toBe(
      JSON.stringify({ message: 'Course updated successfully' })
    );
  });

  it('should send 404 on updating invalid courseId', async () => {
    const requestBody = JSON.stringify({
      title: 'updated course title',
      description: 'updated course description',
      price: 100,
      imageLink: 'https://linktoimage.com',
      published: true,
    });

    const options = {
      method: 'PUT',
      path: `/admin/courses/invald-course-id`,
      headers: {
        'Content-Type': 'application/json',
        username: admin.username,
        password: admin.password,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(404);
  });

  it('admins should get courses', async () => {
    const options = {
      method: 'GET',
      path: `/admin/courses`,
      headers: {
        'Content-Type': 'application/json',
        username: admin.username,
        password: admin.password,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).courses.length).toBeTruthy();
  });

  // USER API TESTS

  it('should allow users to signup', async () => {
    const requestBody = JSON.stringify({
      username: user.username,
      password: user.password,
    });

    const options = {
      method: 'POST',
      path: '/users/signup',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      JSON.stringify({ message: 'User created successfully' })
    );
  });

  it('should allow users to login', async () => {
    const options = {
      method: 'POST',
      path: '/users/login',
      headers: {
        'Content-Type': 'application/json',
        username: user.username,
        password: user.password,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      JSON.stringify({ message: 'Logged in successfully' })
    );
  });

  it("shouldn't allow users to login on invalid credentials", async () => {
    const requestBody = JSON.stringify({
      username: user.username,
      password: 'incorrectPass',
    });

    const options = {
      method: 'POST',
      path: '/users/login',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(403);

    expect(response.body).toBe(
      JSON.stringify({ message: 'User authentication failed' })
    );
  });

  it("shouldn't allow users to login with bad request body", async () => {
    const requestBody = JSON.stringify({ username: user.username });

    const options = {
      method: 'POST',
      path: '/users/login',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(403);

    expect(response.body).toBe(
      JSON.stringify({ message: 'User authentication failed' })
    );
  });

  it('users should be able to get all courses', async () => {
    const options = {
      method: 'GET',
      path: `/users/courses`,
      headers: {
        'Content-Type': 'application/json',
        username: user.username,
        password: user.password,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);

    const courses = JSON.parse(response.body).courses;

    expect(courses.length).toBeTruthy();

    courseId = courses[0].id;
  });

  it('should allow users to purchase courses', async () => {
    const options = {
      method: 'POST',
      path: `/users/courses/${courseId}`,
      headers: {
        'Content-Type': 'application/json',
        username: user.username,
        password: user.password,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);

    const responseBody = JSON.parse(response.body);

    expect(responseBody.message).toBe('Course purchased successfully');
  });

  it('should send 404 on purchasing course with invalid courseId', async () => {
    const options = {
      method: 'POST',
      path: `/users/courses/invald-course-id`,
      headers: {
        'Content-Type': 'application/json',
        username: user.username,
        password: user.password,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(404);

    expect(response.body).toBe(
      JSON.stringify({ message: 'Course not found or not available' })
    );
  });

  it('should allow users to get purchased courses', async () => {
    const options = {
      method: 'GET',
      path: `/users/purchasedCourses`,
      headers: {
        'Content-Type': 'application/json',
        username: user.username,
        password: user.password,
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).purchasedCourses.length).toBeTruthy();
  });

  it("shouldn't allow users to access admin routes", async () => {
    const requestBody = JSON.stringify({
      title: 'updated course title',
      description: 'updated course description',
      price: 100,
      imageLink: 'https://linktoimage.com',
      published: true,
    });

    const options = {
      method: 'PUT',
      path: `/admin/courses/${courseId}`,
      headers: {
        'Content-Type': 'application/json',
        username: user.username,
        password: user.password,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(403);
  });
});

function sendRequest(options, requestBody) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        ...options,
        host: 'localhost',
        port: 3000,
      },
      (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
          });
        });
      }
    );

    req.on('error', (err) => {
      reject(err);
    });

    if (requestBody) {
      req.write(requestBody);
    }

    req.end();
  });
}
