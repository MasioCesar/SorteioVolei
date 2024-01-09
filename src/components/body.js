import React, { useEffect, useState } from 'react';
import { Button, TextField } from "@mui/material";
import PlayerCards from './playerCard';
import { useRouter } from 'next/router';

const Body = () => {
    const [playersData, setPlayersData] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const router = useRouter();

    const sortearClick = () => {
        if (selectedPlayers.length < 4) {
            alert("Selecione no mínimo 4 jogadores");
            return;
        }

        let diferencaMedia = 10;
        let equipe1 = [];
        let equipe2 = [];
        const jogadoresSelecionados = [...selectedPlayers];

        // Array para armazenar as últimas 5 combinações de equipes
        let ultimasEquipes = JSON.parse(localStorage.getItem('ultimasEquipes')) || [];

        console.log(ultimasEquipes)
        while (diferencaMedia > 3) {
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

            // Verifica se as equipes são diferentes das últimas 5 combinações
            const equipesDiferentes = ultimasEquipes.every((ultimaEquipe) => {
                const equipe1Diferente = !equipesSaoIguaisSemOrdem(ultimaEquipe.equipe1, equipe1) && !equipesSaoIguaisSemOrdem(ultimaEquipe.equipe1, equipe2);
                const equipe2Diferente = !equipesSaoIguaisSemOrdem(ultimaEquipe.equipe2, equipe1) && !equipesSaoIguaisSemOrdem(ultimaEquipe.equipe2, equipe2);
                return equipe1Diferente && equipe2Diferente;
            });

            if (equipesDiferentes) {
                // Calcula a média de rating das equipes e a diferença de média
                const somaRatingEquipe1 = equipe1.reduce((acc, jogador) => acc + jogador.rating, 0);
                const somaRatingEquipe2 = equipe2.reduce((acc, jogador) => acc + jogador.rating, 0);
                const mediaRatingEquipe1 = somaRatingEquipe1 / equipe1.length;
                const mediaRatingEquipe2 = somaRatingEquipe2 / equipe2.length;
                diferencaMedia = Math.abs(mediaRatingEquipe1 - mediaRatingEquipe2);

                // Se as equipes são diferentes das últimas 5 combinações, adiciona esta combinação à lista
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



    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch('/players.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch players data');
                }
                const data = await response.json();
                setPlayersData(data);
            } catch (error) {
                console.error('Error fetching players data:', error);
            }
        };

        fetchPlayers();
    }, []);

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
