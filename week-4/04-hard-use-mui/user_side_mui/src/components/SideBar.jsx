import { useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';

export default function SideBar() {
  const navigate = useNavigate();
  return (
    <Box sx={{ width: '100%', maxWidth: 360 }}>
      <List>
        <ListItemButton onClick={() => navigate('/courses')}>
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText
            sx={{ display: { xs: 'none', md: 'block' } }}
            primary="Courses"
          />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/courses/purchased')}>
          <ListItemIcon>
            <FileDownloadDoneIcon />
          </ListItemIcon>
          <ListItemText
            sx={{ display: { xs: 'none', md: 'block' } }}
            primary="Purchases"
          />
        </ListItemButton>
      </List>
    </Box>
  );
}
