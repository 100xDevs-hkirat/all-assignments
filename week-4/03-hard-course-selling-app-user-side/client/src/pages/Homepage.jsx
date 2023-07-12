import { Link } from "react-router-dom"
import imgsrc from './../assets/heroimage.svg'
function Homepage() {
    return (
        <div className="main">
            <div className="text">
                <h1 className="heading">
                    Learn New <span>Skills</span> Online With Top 
                    <span> Educators</span>
                </h1>

                <h3 className="sub-heading">We add Value to our Student Journey, Make them Future Ready</h3>

                <Link className="btn-imp">Start Learning Today 🠖</Link>
            </div>

            <div>
                <img  className="heroimg" src={imgsrc} alt="heroimg" />
            </div>
        </div>
    )
}

export default Homepage
