import { Typography } from "@mui/material";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    return (
        <div style={{ display: 'flex', justifyContent:'space-between', marginTop: 100}} >
            <Typography variant="h5"><b> Learn from industry-leading professionals and gain hands-on expertise in the most in-demand technologies. </b></Typography>
            <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam illo doloremque tempora cum eligendi non iusto dolore! Vero quisqua
                <Typography variant="h5">IMGAE COMING SOON!!</Typography>
            </div>
        </div>
    )
}

export default Landing;