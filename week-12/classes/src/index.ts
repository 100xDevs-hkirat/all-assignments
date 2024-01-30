import { measure, once } from "helpful-decorators";

class DateClass {
  private timeZone: string;
  constructor(timeZone: string) {
    this.timeZone = timeZone;
  }

  @measure
  getTime() {
    const d = new Date();
    console.log("Hi from getTime");
    return d.getTime();
  }
}

const dateObj = new DateClass("IND");
dateObj.getTime();
dateObj.getTime();
dateObj.getTime();
dateObj.getTime();
