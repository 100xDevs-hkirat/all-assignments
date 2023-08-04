import Course from "../model/Course.js";
import CrudRepository from "./Crud-Repository.js";

class CourseRepository extends CrudRepository {
  constructor() {
    super(Course);
  }
}

export default CourseRepository;
