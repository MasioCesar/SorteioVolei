import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PlayerDraw } from '../components/playerDraw';
import Header from '../components/header';
import { Button } from '@mui/material';
import { getTeams, savedGames, updateGames } from '../context/firebase';

const TeamsDrawn = () => {
    const router = useRouter();
    const { equipe1, equipe2, equipe3 } = router.query; // Agora temos 3 times

    const [jogadoresEquipe1, setJogadoresEquipe1] = useState([]);
    const [jogadoresEquipe2, setJogadoresEquipe2] = useState([]);
    const [jogadoresEquipe3, setJogadoresEquipe3] = useState([]); // Estado para o terceiro time

    const [showVs, setShowVs] = useState(false);
    const [winPercentage1, setWinPercentage1] = useState(0);
    const [winPercentage2, setWinPercentage2] = useState(0);
    const [winPercentage3, setWinPercentage3] = useState(0); // Probabilidade para o terceiro time

    useEffect(() => {
        if (!equipe1 || !equipe2 || !equipe3) return; // Verifica se todas as equipes estão disponíveis

        const fetchData = async () => {
            try {
                const team1 = await getTeams(JSON.parse(equipe1));
                const team2 = await getTeams(JSON.parse(equipe2));
                const team3 = await getTeams(JSON.parse(equipe3)); // Obtém o terceiro time
                setJogadoresEquipe1(team1);
                setJogadoresEquipe2(team2);
                setJogadoresEquipe3(team3);
            } catch (error) {
                console.error('Erro ao obter os times:', error);
            }
        };

        fetchData();
    }, [equipe1, equipe2, equipe3]);

    useEffect(() => {
        if (jogadoresEquipe1.length > 0 && jogadoresEquipe2.length > 0 && jogadoresEquipe3.length > 0) {
            try {
                const overall1 = calculateOverall(jogadoresEquipe1);
                const overall2 = calculateOverall(jogadoresEquipe2);
                const overall3 = calculateOverall(jogadoresEquipe3); // Cálculo para o terceiro time
                const total = overall1 + overall2 + overall3;
                const percentage1 = Math.max(0, (100 * overall1) / total);
                const percentage2 = Math.max(0, (100 * overall2) / total);
                const percentage3 = 100 - percentage1 - percentage2; // Probabilidade para o terceiro time
                setWinPercentage1(percentage1.toFixed(0));
                setWinPercentage2(percentage2.toFixed(0));
                setWinPercentage3(percentage3.toFixed(0));
            } catch (error) {
                console.error('Erro ao analisar os dados da equipe:', error);
            }
        }
    }, [jogadoresEquipe1, jogadoresEquipe2, jogadoresEquipe3]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowVs(true);
        }, 550);

        return () => clearTimeout(timeout);
    }, []);

    const calculateOverall = (team) => {
        const overall = team.reduce((acc, player) => {
            return acc + player.attack + player.defense + player.block + player.serve + player.pass + player.lifting;
        }, 0);

        return overall / team.length;
    };

    const handleWinner = async (winnerTeam) => {
        const winnerPlayers = winnerTeam === 'Azul' ? jogadoresEquipe1 :
                              winnerTeam === 'Vermelho' ? jogadoresEquipe2 : jogadoresEquipe3; // Considera três times
        const allPlayers = jogadoresEquipe1.concat(jogadoresEquipe2, jogadoresEquipe3); // Todos os jogadores

        const password = prompt(`Digite a senha para confirmar que o time ${winnerTeam} venceu`);

        if (password === "1234") {
            for (const player of allPlayers) {
                player.games = (player.games || 0) + 1;

                if (winnerPlayers.find((p) => p.name === player.name)) {
                    player.wins = (player.wins || 0) + 1;
                }
                await updateGames(player);
            }
            savedGames(jogadoresEquipe1, jogadoresEquipe2, jogadoresEquipe3, winnerTeam); // Salva os jogos com três times

            router.push('/');
        } else {
            console.log("Senha incorreta. Ação cancelada.");
        }
    };

    if (!equipe1 || !equipe2 || !equipe3) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <Header />
            <div className='cards pb-4'>
                <div className="flex justify-center pt-2">
                    <div className="text-center w-full px-4 pb-4">
                        <h2 className='text-2xl text-yellow-300 font-bold flex justify-center pb-2'>Probabilidade de vitória</h2>
                        <div className="progress p-4">
                            <div
                                className="progress-bar-inner team1 items-center flex justify-center text-gray-200 font-bold"
                                style={{ width: `${winPercentage1}%` }}
                            >{winPercentage1}%</div>
                            <div
                                className="progress-bar-inner team2 items-center flex justify-center text-gray-200 font-bold"
                                style={{ width: `${winPercentage2}%` }}
                            >{winPercentage2}%</div>
                            <div
                                className="progress-bar-inner team3 items-center flex justify-center text-gray-200 font-bold"
                                style={{ width: `${winPercentage3}%` }}
                            >{winPercentage3}%</div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center">
                    <div className='block'>
                        <div className='flex-1 py-2'>
                            <div className='bg-[#2196F3] p-2 rounded-t-md bold text-2xl text-gray-100'>Time Azul</div>
                            <div className="border-2 px-10 border-[#2196F3] rounded-b-md pt-2">
                                <PlayerDraw players={jogadoresEquipe1} />
                            </div>
                        </div>
                        <div className='flex-1'>
                            <div className='bg-[#F44336] p-2 rounded-t-md bold text-2xl text-gray-100'>Time Vermelho</div>
                            <div className="border-2 px-10 border-[#F44336] rounded-b-md pt-2">
                                <PlayerDraw players={jogadoresEquipe2} />
                            </div>
                        </div>
                        <div className='flex-1 py-2'>
                            <div className='bg-[#4CAF50] p-2 rounded-t-md bold text-2xl text-gray-100'>Time Verde</div> {/* Novo time verde */}
                            <div className="border-2 px-10 border-[#4CAF50] rounded-b-md pt-2">
                                <PlayerDraw players={jogadoresEquipe3} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full justify-center flex grid-cols-3 gap-4 p-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4'>
                        <Button variant='contained' color='info' className='w-[300px]' onClick={() => handleWinner('Azul')}>Time Azul</Button>
                        <Button variant='contained' color='inherit' className='w-[300px]'>Quem Venceu?</Button>
                        <Button variant='contained' color='error' className='w-[300px]' onClick={() => handleWinner('Vermelho')}>Time Vermelho</Button>
                        <Button variant='contained' color='success' className='w-[300px]' onClick={() => handleWinner('Verde')}>Time Verde</Button> {/* Botão para o time verde */}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TeamsDrawn;
