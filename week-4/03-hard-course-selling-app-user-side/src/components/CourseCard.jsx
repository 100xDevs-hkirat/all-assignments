import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CourseCard(props) {
  const navigate = useNavigate();
  const [isMoveOver, setIsMoueOver] = useState(false);
  return (
    <div>
      <Card
        sx={{ maxWidth: 345, height: 400 }}
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          border: isMoveOver ? "1px solid #bc1c44" : "1px solid lightsteelblue",
        }}
        onMouseOver={() => setIsMoueOver(true)}
        onMouseLeave={() => setIsMoueOver(false)}
        onClick={() => {
          navigate(`/courses/${props.course._id}`);
        }}
      >
        <div>
          <CardMedia
            sx={{ height: 200, width: 350 }}
            image={props.course.imageLink}
            title={props.course.title}
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              style={{ fontWeight: "700", color: isMoveOver && "#bc1c44" }}
            >
              {props.course.title}
            </Typography>
            <br />
            <Typography
              gutterBottom
              variant="h8"
              component="div"
              style={{
                fontWeight: "50",
                fontFamily: "inherit",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {props.course.description}
            </Typography>
            <br />
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              style={{ fontWeight: "900" }}
            >
              ${props.course.price}
            </Typography>
          </CardContent>
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
