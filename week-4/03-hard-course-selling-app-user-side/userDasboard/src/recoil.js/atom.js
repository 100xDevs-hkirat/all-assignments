import {atom, selector} from "recoil"
import axios from "axios"
import { toast } from "react-hot-toast";

export const baseUrl = `http://localhost:3000`;

export const allCourses = selector({
    key: "allCourses",
    get: async ({get}) => {
        try {
            const response = await axios({
                url: "/users/courses",
                baseURL: baseUrl,
                method: "GET",
                headers: {
                    Authorization: sessionStorage.getItem("userToken"),
                    "Content-type": "application/json"
                }
            });
            return response.data.courses;
        } catch (error) {
            if(error) {
                if(error.response.status == 403) {
                    toast.error("Please Log in to continue");
                    sessionStorage.clear();
                }
            }
        }
    }
});

export const localCourse = atom({
    key: "localCourse",
    default: allCourses
});

export const pCourses = atom({
    key: "pCourses",
    default: []
})