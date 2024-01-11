import { useEffect, useState } from "react";
import { getPlayers, getRanking } from "./firebase";

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

export const GetRanking = (setRanking) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const Ranking = () => {
        getRanking(setRanking);
        setIsLoaded(true);
    }

    useEffect(() => {
        if (!isLoaded) {
            Ranking();
        }
    }, [isLoaded]);
}