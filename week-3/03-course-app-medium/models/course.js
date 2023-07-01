const { v4: uuidv4 } = require("uuid");

class Course {
  #id;
  #title;
  #description;
  #price;
  #imgLink;
  #published;
  #userID;
  constructor(title, description, price, imgLink, published, userID) {
    this.#id = uuidv4();
    this.#title = title;
    this.#description = description;
    this.#price = price;
    this.#imgLink = imgLink;
    this.#published = published;
    this.#userID = userID;
  }
  getDetails() {
    return {
      id: this.#id,
      title: this.#title,
      description: this.#description,
      price: this.#price,
      imgLink: this.#imgLink,
      published: this.#published,
      user: {
        userID: this.#userID,
      },
    };
  }
}

module.exports = Course;
