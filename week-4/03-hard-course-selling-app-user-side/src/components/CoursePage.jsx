import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DownloadIcon from "@mui/icons-material/Download";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import Button from "@mui/material/Button";

function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:3000/users/courses/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setCourse(res.data.course);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "50px",
        flexWrap: "wrap",
        flex: "1",
        marginTop: "150px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <div>
          <img
            src={course.imageLink}
            alt={course.imageLink}
            width="300px"
            style={{ borderRadius: "20px" }}
          />
        </div>

        <div>
          <Typography
            variant="h3"
            component="div"
            style={{
              flexGrow: 1,
              padding: "10px",
              borderRadius: "4px",
              fontWeight: "bold",
              color: "#101460",
            }}
          >
            {course.title}
          </Typography>
        </div>

        <div>
          <Typography
            variant="h6"
            component="div"
            style={{
              flex: "1",
              padding: "10px",
              borderRadius: "4px",
              fontWeight: "bold",
              color: "#101460",
              width: "600px",
            }}
          >
            {course.description}
          </Typography>
        </div>

        <div>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#bc1c44",
              padding: "10px 20px",
              fontWeight: "700",
              fontSize: "1rem",
              borderRadius: "50px",
            }}
          >
            BUY @ ${course.price}
          </Button>
        </div>
      </div>

      <div>
        <Card
          sx={{ width: "350px" }}
          style={{
            backgroundColor: " #101460",
            color: "white",
            borderRadius: "10px",
            paddingRight: "6px",
            display: "flex",
            padding: "8px",
          }}
        >
          <CardActionArea>
            <CardContent style={{ textAlign: "center" }}>
              <Typography gutterBottom variant="h4" component="div">
                Course Overview
              </Typography>
              <br />
              <Box
                sx={{
                  bgcolor: "background.paper",
                  color: "black",
                  borderRadius: "20px",
                  padding: "20px 5px",
                }}
              >
                <nav aria-label="main mailbox folders">
                  <List style={{ padding: "10px" }}>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <SignalCellularAltIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Beginner to Pro
"
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <OndemandVideoIcon />
                        </ListItemIcon>
                        <ListItemText primary="20+ Hours of HD video" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <FormatListBulletedIcon />
                        </ListItemIcon>
                        <ListItemText primary="150+ Lessons" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <DownloadIcon />
                        </ListItemIcon>
                        <ListItemText primary="Downloadable content" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <ClosedCaptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="English captions" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <MilitaryTechIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Certificate of completion
"
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <AllInclusiveIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Lifetime access
"
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </nav>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
}

export default CoursePage;
