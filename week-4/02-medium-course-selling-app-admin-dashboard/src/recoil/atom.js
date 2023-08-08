import axios from 'axios';
import { atom, selector } from 'recoil'
import { useLocalStorage } from '../assets/useLocalStorage';
import { baseUrl } from '../components/Register';


export const user = atom({
    key: "user",
    default: {},
});

export const loading = atom({
    key: "loading",
    default: false
});


export const coursesList = atom({
    key: "coursesList",
    default: selector({
        key: "getCourses",
        get: async ({ get }) => {
            const response = await axios({
                url: "/admin/courses",
                baseURL: baseUrl,
                method: "GET",
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-type": "application/json"
                },
            });
            
            return response.data.courses;
        }
    })
})


export const localCourses = atom({
    key: "localCourses",
    default: coursesList
})