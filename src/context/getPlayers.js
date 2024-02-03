import { useEffect, useState } from "react";
import { getGamesHistory, getPlayers, getRanking } from "./firebase";

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

export const GetGamesHistory = (setGamesHistory) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const gamesHistory = () => {
        getGamesHistory(setGamesHistory);
        setIsLoaded(true);
    }

    useEffect(() => {
        if (!isLoaded) {
            gamesHistory();
        }
    }, [isLoaded]);
}