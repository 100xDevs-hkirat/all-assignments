import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import "./Course.css";

const Course = ({ course, onDeleteCourse, onViewDetails }) => {
  var cardStyle = {
    width: "317px",
    height: "420px",
  };

  return (
    <div>
      <Card style={cardStyle} className="course-card" variant="outlined">
        <div className="course-img">
          <img src={course.imageLink} />
        </div>
        <div className="course-content">
          <div className="title">
            <h4>{course.title}</h4>
          </div>
          <div className="description">
            <p>{course.description.substr(0, 35)} ...</p>
          </div>
          <div className="price">
            <p>$ {course.price}</p>
          </div>
          <div>
            <Button
              className="btn"
              variant="contained"
              fullWidth={true}
              onClick={() => onViewDetails(course)}
            >
              View Details
            </Button>
            <Button
              className="btn"
              variant="contained"
              fullWidth={true}
              onClick={() => onDeleteCourse(course)}
            >
              Remove
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Course;
