import { Grid } from '@mui/material';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';

export default function Layout() {
  return (
    <>
      <NavBar />
      <Grid
        container
        flexWrap="nowrap">
        <Grid item>
          <SideBar />
        </Grid>
        <Grid
          item
          sx={{ flexGrow: 1 }}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
}
