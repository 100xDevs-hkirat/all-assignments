import HomeIcon from "@mui/icons-material/Home"
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Card, Typography } from '@mui/material';

function Menu() {
    return <div >
        <Card
            style={{ width: 270, position: "absolute", top: 60, bottom: 0, backgroundColor: "#e9f1fc", }} variant='text'>
            <Button
                style={{ height: 40, marginTop: 15 }}
                sx={{
                    color: 'primary',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    paddingLeft: 5,
                    textTransform: "none"
                }}
                fullWidth={true}
                startIcon={<HomeIcon color="primary" />}
                variant="text"
            >
                Home
            </Button>
            <Button
                style={{ height: 40, marginTop: 15 }}
                sx={{
                    color: 'primary',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    paddingLeft: 5,
                    textTransform: "none"
                }}
                fullWidth={true}
                startIcon={<SchoolIcon color="primary" />}
                variant="text"
            >
                Courses
            </Button>
            <Button
                style={{ height: 40, marginTop: 15 }}
                sx={{
                    color: 'primary',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    paddingLeft: 5,
                    textTransform: "none"
                }}
                fullWidth={true}
                startIcon={<ShoppingCartIcon color="primary" />}
                variant="text"
            >
                Purchases
            </Button>
            <Button
                style={{ height: 40, marginTop: 15 }}
                sx={{
                    color: 'primary',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    paddingLeft: 5,
                    textTransform: "none"
                }}
                fullWidth={true}
                startIcon={<SettingsIcon color="primary" />}
                variant="text"
            >
                Settings
            </Button>
            <Button
                style={{ height: 40, marginTop: 15 }}
                sx={{
                    color: 'primary',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    paddingLeft: 5,
                    textTransform: "none"
                }}
                fullWidth={true}
                startIcon={<LogoutIcon color="primary" />}
                variant="text"
            >
                Logout
            </Button>
        </Card>
    </div>
}

export default Menu;