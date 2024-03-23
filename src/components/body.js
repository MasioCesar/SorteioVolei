import React, { useState } from 'react';
import { Button } from "@mui/material";
import PlayerCards from './playerCard';
import { useRouter } from 'next/router';
import { GetAllPlayers } from '../context/getPlayers';
import { Loader } from './loader';
const Body = () => {
    const [playersData, setPlayersData] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const router = useRouter();
    GetAllPlayers(setPlayersData)
    if (!playersData) {
        return <> <Loader /> </>;
    }

    const sortearClick = () => {
        if (selectedPlayers.length < 6) {
            alert("Selecione no mínimo 6 jogadores");
            return;
        }
        const valorDiffMedia = 15;
        let diferencaMedia = 20;
        let equipe1 = [];
        let equipe2 = [];
        const jogadoresSelecionados = [...selectedPlayers];
    
        // Array para armazenar as últimas 5 combinações de equipes
        let ultimasEquipes = JSON.parse(localStorage.getItem('ultimasEquipes')) || [];
    
        let iteracoes = 0;
    
        while (diferencaMedia > valorDiffMedia && iteracoes < 400) { 
            equipe1 = [];
            equipe2 = [];
            iteracoes++;
    
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
    
            let jogadoresDiferentes = true;
            if (jogadoresSelecionados.length >= 8 && ultimasEquipes.length > 0) {
                const jogadoresDiferentes1 = diferentes2Jogadores(ultimasEquipes[ultimasEquipes.length - 1].equipe1, equipe1);
                jogadoresDiferentes = jogadoresDiferentes1;
            }
    
            if (equipesDiferentes && jogadoresDiferentes) {
                const mediaRatingEquipe1 = calculateOverall(equipe1);
                const mediaRatingEquipe2 = calculateOverall(equipe2);
                const totalTeam1 = equipe1.reduce((acc, player) => {
                    return acc + player.attack + player.defense + player.block + player.serve + player.pass + player.lifting;
                }, 0);
                const totalTeam2 = equipe2.reduce((acc, player) => {
                    return acc + player.attack + player.defense + player.block + player.serve + player.pass + player.lifting;
                }, 0);
                
                diferencaMedia = Math.abs(mediaRatingEquipe1 - mediaRatingEquipe2);

                console.log(`Interacao: ${iteracoes}`,diferencaMedia);
                console.log("Time diff: ",totalTeam1 - totalTeam2)

                if (iteracoes > 200) {
                    if (totalTeam1 - totalTeam2 >= 460) {
                        diferencaMedia = 20;
                    }
                } else {
                    if (totalTeam1 - totalTeam2 >= 430) {
                        diferencaMedia = 20;
                    }
                }

                if (diferencaMedia <= valorDiffMedia) {
                    if (ultimasEquipes.length === 5) {
                        ultimasEquipes.shift(); // Remove a combinação mais antiga
                    }
                    ultimasEquipes.push({ equipe1, equipe2 });
                    localStorage.setItem('ultimasEquipes', JSON.stringify(ultimasEquipes));
                }
            }
        }
    
        if (diferencaMedia <= valorDiffMedia) {
            router.push({
                pathname: '/teamsDrawn',
                query: { equipe1: JSON.stringify(equipe1), equipe2: JSON.stringify(equipe2) },
            });
        } else {
            console.log("Não foi possível encontrar equipes adequadas após 200 iterações.");
        }
    };
    
    const calculateOverall = (team) => {
        const overall = team.reduce((acc, player) => {
            console.log(player.attack, player.defense, player.block, player.serve, player.pass, player.lifting)
            return acc + player.attack + player.defense + player.block + player.serve + player.pass + player.lifting;
        }, 0);
        return overall / team.length;
    };
    function equipesSaoIguaisSemOrdem(equipeA, equipeB) {
        if (equipeA.length !== equipeB.length) {
            return false;
        }
        const jogadoresA = equipeA.map((jogador) => jogador.name).sort();
        const jogadoresB = equipeB.map((jogador) => jogador.name).sort();

        return JSON.stringify(jogadoresA) === JSON.stringify(jogadoresB);
    }

    function diferentes2Jogadores(equipeA, equipeB) {
        const jogadoresA = equipeA.map((jogador) => jogador.name);
        const jogadoresB = equipeB.map((jogador) => jogador.name);

        let diferencaComAnterior = 0;
        for (let i = 0; i < jogadoresA.length; i++) {
            if (!jogadoresB.includes(jogadoresA[i])) {
                diferencaComAnterior++;
            }
        }
        return diferencaComAnterior >= 2;
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
            {!playersData.length && <Loader />}
            {!!playersData.length && (
                <>
                    <h1 className='text-2xl text-green-400'>Selecione quem vai jogar:</h1>
                    <div className="mt-4">
                        <PlayerCards players={playersData} selectedPlayers={selectedPlayers} onPlayerSelection={handlePlayerSelection} />
                    </div>
                    <div className='py-4'>
                        <Button variant="outlined" size="large" style={{ minWidth: '300px', fontSize: '25px' }} onClick={sortearClick}>
                            Realizar Sorteio
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
export default Body;