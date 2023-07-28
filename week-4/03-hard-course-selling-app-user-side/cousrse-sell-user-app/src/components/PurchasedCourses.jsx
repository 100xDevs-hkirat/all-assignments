import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
        const timeout = setInterval(()=>{listPurchase(setPurchased);},2000);
        return ()=>clearInterval(timeout);
    },[]);
    return <div>
        <h1>Purchased Courses</h1>
        <a href="/courses">List all available courses</a>
        <br/>
        {purchased.map((cousrse)=> <Purchase title={cousrse.title} id={cousrse.id}></Purchase>)}
    </div>
}

function Purchase(props){
    return <div>
            id : {props.id}<br/>
            title : {props.title}<br/>
        </div>
}
export default PurchasedCourses;