import { useContext } from "react";
import { CourseContext } from "../context/CourseContext";
import { AuthContext } from "../context/AuthContext";

function Course({id, imageLink,title, instructor, duration, description,price, rating}) {

    const colors = [ '#F99090', "#ABDEB6", '#C0C891','#BCCEE4' ]
    let cardColor;
        Array.from({ length: 4 }, (_, index) => {
        const randomColorIndex = Math.floor(Math.random() * colors.length);
         cardColor = colors[randomColorIndex]; })

            const { buyCourse} = useContext(CourseContext);
            const { state } = useContext(AuthContext);
            function handlechange() {
                buyCourse(id, state.user._id);
            }
    return (
        <div className="course" style={{backgroundColor : cardColor}}>
            <div>
                <img className="course-img" src={imageLink} alt="" />
            </div>
            <div className="details">
                <h4 className="title">{title}</h4>
                <h5 className="instructor">{instructor}</h5>
                <div className="extra">
                    <h5>{rating} ⭐⭐⭐⭐</h5>
                    <h5>{duration}hrs</h5>
                </div>
                <div className="main-info">
                    <h3>${price}</h3>
                    <span onClick={handlechange}>Buy Now</span>
                </div>
            </div>
        </div>
    )
}

export default Course
