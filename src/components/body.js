import React, { useEffect, useState } from 'react';
import { Button, TextField } from "@mui/material";
import PlayerCards from './playerCard';
import { useRouter } from 'next/router';
import { GetAllPlayers } from '../context/getPlayers';

const Body = () => {
    const [playersData, setPlayersData] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);


    GetAllPlayers(setPlayersData)


    if (!playersData) {
        return <div>Carregando...</div>;
    }

    const router = useRouter();

    const sortearClick = () => {
        if (selectedPlayers.length < 6) {
            alert("Selecione no mínimo 6 jogadores");
            return;
        }

        let diferencaMedia = 10;
        let equipe1 = [];
        let equipe2 = [];
        const jogadoresSelecionados = [...selectedPlayers];

        // Array para armazenar as últimas 5 combinações de equipes
        let ultimasEquipes = JSON.parse(localStorage.getItem('ultimasEquipes')) || [];

        while (diferencaMedia > 5) {
            equipe1 = [];
            equipe2 = [];

            const jogadoresEmbaralhados = jogadoresSelecionados
                .map((selectedPlayer) => playersData.find((player) => player.name === selectedPlayer))
                .sort(() => Math.random() - 0.5);

            for (let i = 0; i < jogadoresEmbaralhados.length; i++) {
                if (i % 2 === 0) {
                    equipe1.push(jogadoresEmbaralhados[i]);
                } else {
                    equipe2.push(jogadoresEmbaralhados[i]);
                }
            }

            const equipesDiferentes = ultimasEquipes.every((ultimaEquipe) => {
                const equipe1Diferente = !equipesSaoIguaisSemOrdem(ultimaEquipe.equipe1, equipe1) && !equipesSaoIguaisSemOrdem(ultimaEquipe.equipe1, equipe2);
                const equipe2Diferente = !equipesSaoIguaisSemOrdem(ultimaEquipe.equipe2, equipe1) && !equipesSaoIguaisSemOrdem(ultimaEquipe.equipe2, equipe2);
                return equipe1Diferente && equipe2Diferente;
            });

            if (equipesDiferentes) {
                const somaRatingEquipe1 = equipe1.reduce((acc, jogador) => acc + jogador.rating, 0);
                const somaRatingEquipe2 = equipe2.reduce((acc, jogador) => acc + jogador.rating, 0);
                const mediaRatingEquipe1 = somaRatingEquipe1 / equipe1.length;
                const mediaRatingEquipe2 = somaRatingEquipe2 / equipe2.length;
                diferencaMedia = Math.abs(mediaRatingEquipe1 - mediaRatingEquipe2);

                if (ultimasEquipes.length === 5) {
                    ultimasEquipes.shift(); // Remove a combinação mais antiga
                }
                ultimasEquipes.push({ equipe1, equipe2 });
                localStorage.setItem('ultimasEquipes', JSON.stringify(ultimasEquipes));
            }
        }

        router.push({
            pathname: '/teamsDrawn',
            query: { equipe1: JSON.stringify(equipe1), equipe2: JSON.stringify(equipe2) },
        });
    };

    function equipesSaoIguaisSemOrdem(equipeA, equipeB) {
        if (equipeA.length !== equipeB.length) {
            return false;
        }
        const jogadoresA = equipeA.map((jogador) => jogador.name).sort();
        const jogadoresB = equipeB.map((jogador) => jogador.name).sort();
        return JSON.stringify(jogadoresA) === JSON.stringify(jogadoresB);
    }



    const handlePlayerSelection = (playerId) => {
        if (selectedPlayers.includes(playerId)) {
            setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
        } else {
            setSelectedPlayers([...selectedPlayers, playerId]);
        }
    };

    return (
        <div className="text-gray-50 w-full flex flex-col items-center justify-center py-2 px-4">
            <Button variant="outlined" size="large" style={{ minWidth: '316px', fontSize: '25px' }} onClick={sortearClick}>
                Realizar Sorteio
            </Button>
            <h1 className='text-2xl text-green-400 pt-4'>Selecione quem vai jogar:</h1>
            <div className="mt-4">
                <PlayerCards players={playersData} selectedPlayers={selectedPlayers} onPlayerSelection={handlePlayerSelection} />
            </div>
        </div>
    );
}

export default Body;
