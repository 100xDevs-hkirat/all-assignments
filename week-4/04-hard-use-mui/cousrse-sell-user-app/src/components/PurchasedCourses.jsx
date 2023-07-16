import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.

function listPurchase(setPurchased) {
    axios.get('http://localhost:3000/users/purchasedCourses', {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('userToken')
        }
    })
        .then(response => {
            console.log("Purchase fetched");
            setPurchased(response.data.purchasedCourses);
        })
        .catch(error => {
            console.error('User registration error:', error);
        });

}

function PurchasedCourses() {
    const [purchased, setPurchased] = React.useState([]);
    const navigate = useNavigate();
    React.useEffect(()=>{
        listPurchase(setPurchased);
        const timeout = setInterval(()=>{listPurchase(setPurchased);},5000);
        return ()=>clearInterval(timeout);
    },[]);
    return <div>
        <CssBaseline/>
        <h1>Purchased Courses</h1>
        <Link href="/courses">List all available courses</Link>
        <br/>
        <List>
        {purchased.map((cousrse)=> <Purchase title={cousrse.title} id={cousrse.id}></Purchase>)}
        </List>
    </div>
}

function Purchase(props){
    return <ListItemText>
         <Grid container spacing={2}>
             <Grid item xs={1}>
                id : {props.id}
             </Grid>
             <Grid item xs={3}>
                title : {props.title}
             </Grid>
             <Grid item xs={3}>
                 <Button variant="outlined" onClick={() => purchaseCourse(props.courseId)}> Purchase Course</Button>
             </Grid>
         </Grid>
     </ListItemText>
}
export default PurchasedCourses;