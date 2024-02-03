import { useState } from "react";
import { GetGamesHistory } from "../context/getPlayers";
import Header from "../components/header";
import { PlayerHistory } from "../components/playerHistory";

export default function GameHistory() {
    const [gamesHistory, setGamesHistory] = useState([]);

    GetGamesHistory(setGamesHistory);

    console.log(gamesHistory)

    return (
        <div>
            <Header />
            {gamesHistory.map((game, index) => (
                <div key={index} className="border border-gray-300 p-4 rounded-md mb-4 m-2">
                    <p className="text-yellow-300">Data: {game.date}</p>
                    <p className="text-gray-100">Vencedor: Time {game.winnerTeam}</p>
                    <p className="text-gray-100">Perdedor: Time {game.loserTeam}</p>
                    <p className="pt-2 text-lg text-green-400">Time Vencedor:</p>
                    <ul>
                        <PlayerHistory players={game.winningTeam} />
                    </ul>

                    <p className="text-lg text-red-500">Time Perdedor:</p>
                    <ul>
                        <PlayerHistory players={game.losingTeam} />
                    </ul>
                </div>
            ))}
        </div>
    );
}