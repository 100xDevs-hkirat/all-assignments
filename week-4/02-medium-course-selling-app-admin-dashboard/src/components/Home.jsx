import { Typography,Card } from "@mui/material"

const Home = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 30,
      }}
    >
      <div>
        <Typography style={{}} variant="h5">
          Welcome to CoursePro
        </Typography>
      </div>
      <div>
        <img
          src="https://img.freepik.com/free-vector/webinar-internet-lesson-distance-university-tutor-educator-online-learning-seniors-online-courses-seniors-additional-education-concept_335657-681.jpg"
          alt=""
          style={{ width: 500 }}
        />
      </div>
      <div>
        <Typography style={{ marginTop: 30 }} variant="h5">
          Featured Courses
        </Typography>
      </div>
      <div style={{ marginTop: 15 }}>
        <img
          src="https://bloggingwizard.com/wp-content/uploads/2020/09/Best-Online-Course-Platforms-Featured.png"
          alt="Featured course"
        />
      </div>
      <div>
        <Typography style={{ marginTop: 30 }} variant="h5">
          About CoursePro
        </Typography>
      </div>

      <div>
        <Card
          style={{
            backgroundImage: 'linear-gradient(to bottom right, pink, white)',
            marginInline: 40,
            marginBlock: 20,
            padding: 30,
          }}
        >
          <Typography variant="h6">Welcome to CoursePro.</Typography>
          <Typography>
            Course Pro is your premier online course marketplace, connecting
            learners with expert instructors. We offer a diverse range of
            high-quality courses in various disciplines. Our platform is
            designed to be user-friendly, allowing you to learn at your own pace
            and access valuable resources. Join Course Pro today and unlock your
            full potential through the power of education.
          </Typography>
        </Card>
      </div>
    </div>
  )
}

export default Home
