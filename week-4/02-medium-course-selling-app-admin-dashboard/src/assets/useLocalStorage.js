import { useEffect, useState } from "react"

export const useLocalStorage = (storageKey, fallback) => {
    const [state, setState] = useState(
        localStorage.getItem(storageKey) ?? fallback
        );

    useEffect(() => {
        localStorage.setItem(storageKey, state);
    }, [state, storageKey]);

    return [state, setState];

}