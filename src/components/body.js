import React, { useEffect, useState } from 'react';
import { Button } from "@mui/material";
import PlayerCards from './playerCard';
import { useRouter } from 'next/router';

const Body = () => {
    const [playersData, setPlayersData] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const router = useRouter();

    const sortearClick = () => {
        // Cria uma cópia dos jogadores selecionados
        const jogadoresSelecionados = [...selectedPlayers];
        const equipe1 = [];
        const equipe2 = [];
    
        // Cria uma lista de jogadores disponíveis com base nos jogadores selecionados
        const jogadoresDisponiveis = jogadoresSelecionados.map((selectedPlayer) =>
            playersData.find((player) => player.name === selectedPlayer)
        );

        console.log(jogadoresDisponiveis)
    
        // Sorteia os jogadores disponíveis para as equipes
        while (jogadoresDisponiveis.length > 0) {
            const jogadorIndex = Math.floor(Math.random() * jogadoresDisponiveis.length);
            const jogadorSelecionado = jogadoresDisponiveis[jogadorIndex];
    
            if (equipe1.length <= equipe2.length) {
                equipe1.push(jogadorSelecionado);
            } else {
                equipe2.push(jogadorSelecionado);
            }
    
            jogadoresDisponiveis.splice(jogadorIndex, 1);
        }
    
        // Redireciona para a página de equipes sorteadas com os dados das equipes
        router.push({
            pathname: '/teamsDrawn',
            query: { equipe1: JSON.stringify(equipe1), equipe2: JSON.stringify(equipe2) },
        });
    };
    
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
            <div className="mt-4">
                <PlayerCards players={playersData} selectedPlayers={selectedPlayers} onPlayerSelection={handlePlayerSelection} />
            </div>
        </div>
    );
}

export default Body;
