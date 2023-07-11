import { useEffect, useState } from "react";

function AllTodos() {
    const [data, setData] = useState([]);
    const [todoDone, setTodoDone] = useState();

    // getting all the todos
    function fetchingInfo() {
        return fetch("http://127.0.0.1:3000/todos")
            .then((res) => res.json())
            .then((d) => setData(d));
    }
    useEffect(() => {
        fetchingInfo();
    }, []);

    // setting it to true

    return (
        <>
            <center>
                {data.map((rec, index) => {
                    return (
                        <div
                            style={{
                                borderRadius: 10,
                                backgroundColor: "pink",
                                width: "15em",
                                height: "5em",
                            }}
                        >
                            {rec.id}.{rec.Title}
                            <br />
                            {rec.Description} <br />
                            <input type="checkbox" checked={rec.Completed} />
                            <br />
                            <br />
                        </div>
                    );
                })}
            </center>
        </>
    );
}
export default AllTodos;
