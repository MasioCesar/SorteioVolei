import { useEffect, useState } from "react";
import { getPlayers } from "./firebase";

export const GetAllPlayers = (setAllPlayers) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const datasUsers = () => {
        getPlayers(setAllPlayers);
        setIsLoaded(true);
    };

    useEffect(() => {
        if (!isLoaded) {
            datasUsers();
        }
    }, [isLoaded]);
};