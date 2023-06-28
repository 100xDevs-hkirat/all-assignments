const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [
  {
    username: "admin1",
    password: "adminpass1",
  },
  {
    username: "admin2",
    password: "adminpass2",
  },
];
let USERS = [
  {
    username: "user1",
    password: "password1",
  },
  {
    username: "user2",
    password: "password2",
  },
  {
    username: "user3",
    password: "password3",
  },
];
let COURSES = [
  {
    id: 1,
    title: "Introduction to Programming",
    description: "Learn the basics of programming",
    price: 5,
    image: "https://example.com/intro-programming.jpg",
    published: true,
  },
  {
    id: 2,
    title: "Web Development Fundamentals",
    description: "Learn the fundamentals of web development",
    price: 3,
    image: "https://example.com/web-dev-fundamentals.jpg",
    published: true,
  },
  {
    id: 3,
    title: "Python for Beginners",
    description: "A beginner's guide to Python programming",
    price: 7,
    image: "https://example.com/python-beginners.jpg",
    published: true,
  },
  {
    id: 4,
    title: "JavaScript Masterclass",
    description: "Become an expert in JavaScript",
    price: 9,
    image: "https://example.com/js-masterclass.jpg",
    published: true,
  },
  {
    id: 5,
    title: "Data Structures and Algorithms",
    description: "Learn essential data structures and algorithms",
    price: 4,
    image: "https://example.com/data-structures-algorithms.jpg",
    published: false,
  },
];
let PURCHASED_COURSES = [];

// Admin routes
app.post("/admin/signup", (req, res) => {
  const { username, password } = req.body;
  const isUsername = ADMINS.find((admin) => admin.username === username);

  if (isUsername) {
    res.status(400).json("Username exists");
  } else {
    ADMINS.push({
      username: username,
      password: password,
    });
    res.status(201).json({ message: "Admin created succesfully" });
  }
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.headers;
  const foundAdmin = ADMINS.find((admin) => {
    return admin.username === username && admin.password === password;
  });

  if (foundAdmin) {
    res.status(200).json({ message: "Logged in successfully" });
  } else {
    res.status(404).json({ message: "Admin Not Found" });
  }
});

app.post("/admin/courses", (req, res) => {
  const { username, password } = req.headers;
  const foundAdmin = ADMINS.find((admin) => {
    return admin.username === username && admin.password === password;
  });

  if (!foundAdmin) {
    res.status(403).json({ message: "Forbidden or Unauthorised" });
  } else {
    if (COURSES.length) {
      var previous_id = COURSES.at(COURSES.length - 1).id;
    }

    const id = previous_id ? previous_id + 1 : 1;
    COURSES.push({
      id: id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageLink: req.body.imageLink,
      published: req.body.published,
    });
    res
      .status(201)
      .json({ message: "Course created successfully", courseId: id });
  }
});

app.put("/admin/courses/:courseId", (req, res) => {
  const { username, password } = req.headers;
  const foundAdmin = ADMINS.find((admin) => {
    return admin.username === username && admin.password === password;
  });

  if (!foundAdmin) {
    res.status(403).json({ message: "Forbidden or Unauthorised" });
  } else {
    const idx = COURSES.findIndex((course) => {
      return course.id == req.params.courseId;
    });

    if (idx === -1) {
      res.status(404).json({ message: "Course Not Found" });
    } else {
      COURSES[idx].title = req.body.title;
      COURSES[idx].description = req.body.description;
      COURSES[idx].price = req.body.price;
      COURSES[idx].imageLink = req.body.imageLink;
      COURSES[idx].published = req.body.published;
      res.status(200).json({ message: "Course updated succesfully" });
    }
  }
});

app.get("/admin/courses", (req, res) => {
  const { username, password } = req.headers;
  const foundAdmin = ADMINS.find((admin) => {
    return admin.username === username && admin.password === password;
  });

  if (!foundAdmin) {
    res.status(403).json({ message: "Forbidden or Unauthorised" });
  } else {
    res.status(200).json({ courses: COURSES });
  }
});

// User routes
app.post("/users/signup", (req, res) => {
  const isUsername = USERS.find((user) => user.username === req.body.username);

  if (isUsername) {
    res.status(400).json({ message: "Username exists" });
  } else {
    USERS.push({
      username: req.body.username,
      password: req.body.password,
    });
    console.warn(USERS);
    res.status(201).json({ message: "User created succesfully" });
  }
});

app.post("/users/login", (req, res) => {
  const foundUser = USERS.find((user) => {
    return (
      user.username === req.headers.username &&
      user.password === req.headers.password
    );
  });

  if (!foundUser) {
    res.status(404).json({ message: "User not found" });
  } else {
    res.status(200).json({ message: "Logged in succesfully" });
  }
});

app.get("/users/courses", (req, res) => {
  const foundUser = USERS.find((user) => {
    return (
      user.username === req.headers.username &&
      user.password === req.headers.password
    );
  });

  if (!foundUser) {
    res.status(403).json({ message: "Forbidden or Unauthorised" });
  } else {
    res.status(200).json({ courses: COURSES });
  }
});

app.post("/users/courses/:courseId", (req, res) => {
  const foundUser = USERS.find((user) => {
    return (
      user.username === req.headers.username &&
      user.password === req.headers.password
    );
  });

  if (!foundUser) {
    res.status(403).json({ message: "Forbidden or Unauthorised" });
  } else {
    const purchase_course = COURSES.find(
      (course) => course.id == req.params.courseId
    );
    if (!purchase_course) {
      res.status(404).json({ message: "Course not found" });
    } else {
      PURCHASED_COURSES.push(purchase_course);
      res.status(200).json({ message: "Course purchased successfully" });
    }
  }
});

app.get("/users/purchasedCourses", (req, res) => {
  const foundUser = USERS.find((user) => {
    return (
      user.username === req.headers.username &&
      user.password === req.headers.password
    );
  });

  if (!foundUser) {
    res.status(403).json({ message: "Forbidden or Unauthorised" });
  } else {
    res.status(200).json({ purchasedcourse: PURCHASED_COURSES });
  }
});

app.listen(3000, () => {
  console.log("crush it on port 3000");
});
