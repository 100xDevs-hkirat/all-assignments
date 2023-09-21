import { selector } from "recoil";
import { courseState } from "../atoms/course";

export const isCourseLoading = selector({
    key: "isCourseLoading",
    get: ({ get }) => {
        const state = get(courseState);
        return state.isLoading
    }
})

export const courseTitle = selector({
    key: "courseTitle",
    get: ({ get }) => {
        const state = get(courseState);
        if (state.course) {
            return state.course.title
        } else {
            return "";
        }
    }
})

export const courseDescription = selector({
    key: "courseDescription",
    get: ({ get }) => {
        const state = get(courseState);
        if (state.course) {
            return state.course.description
        } else {
            return "";
        }
    }
})

export const coursePrice = selector({
    key: "coursePrice",
    get: ({ get }) => {
        const state = get(courseState);
        if (state.course) {
            return state.course.price
        } else {
            return "";
        }
    }
})

export const courseImageLink = selector({
    key: "courseImageLink",
    get: ({ get }) => {
        const state = get(courseState);
        if (state.course) {
            return state.course.imageLink
        } else {
            return "";
        }
    }
})

export const coursePublished = selector({
    key: "coursePublished",
    get: ({ get }) => {
        const state = get(courseState);
        if (state.course) {
            return state.course.published
        } else {
            return "";
        }
    }
})