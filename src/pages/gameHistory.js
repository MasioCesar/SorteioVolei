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
                <div key={index} className="border border-gray-600 p-4 rounded-md mb-4 m-2">
                    <p className="text-yellow-300">Data: {game.date}</p>
                    <div className='flex-1 pt-3'>
                        <div className='bg-green-500 p-1 px-2 rounded-t-md bold text-xl text-gray-100'>Venceu:</div>
                        <div className="border-2 px-1.5 border-green-500 rounded-b-md pt-2">
                            <PlayerHistory players={game.winningTeam} />
                        </div>
                    </div>
                    <div className='flex-1 pt-4'>
                        <div className='bg-red-500 p-1 px-2 rounded-t-md bold text-xl text-gray-100'>Perdeu:</div>
                        <div className="border-2 px-1.5 border-red-500 rounded-b-md pt-2">
                            <PlayerHistory players={game.losingTeam} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}