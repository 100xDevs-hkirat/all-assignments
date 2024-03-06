import { useNavigate } from "react-router-dom";

function useFetch(url, method, navTo) {
    const navigateTo = useNavigate();
    console.log("parent running");
    async function fetchData(body, header) {
        console.log(body);
        const response = await fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: header
        });
    
        const data = await response.json();
        if(response.ok) {
            navigateTo(navTo);
        }
        console.log(data);
        return data;
    }
    return fetchData;
}

export default useFetch;