import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

function CourseCard(props) {
  const navigate = useNavigate();
  return (
    <div key={props.course._id}>
      <Card
        sx={{ maxWidth: 345, height: 350 }}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <CardMedia
            sx={{ height: 200, width: 350 }}
            image={props.course.imageLink}
            title={props.course.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {props.course.title}
            </Typography>
          </CardContent>
        </div>

        <div>
          <CardActions>
            <Button
              size="small"
              onClick={() => navigate(`/UpdateCourse/${props.course._id}`)}
            >
              UPDATE
            </Button>
            <Button size="small">Learn More</Button>
          </CardActions>
        </div>
      </Card>
    </div>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageLink: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default CourseCard;
