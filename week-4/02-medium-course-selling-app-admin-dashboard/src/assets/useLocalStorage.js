import { useEffect, useState } from "react"

export const useLocalStorage = (storageKey, fallback) => {
    const [state, setState] = useState(
        localStorage.getItem(storageKey) ?? fallback
        );

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [state, storageKey]);

    return [state, setState];

}