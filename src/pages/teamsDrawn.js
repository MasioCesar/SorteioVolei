import React from 'react';
import { useRouter } from 'next/router';
import { PlayerDraw } from '../components/playerDraw';

const TeamsDrawn = () => {
    const router = useRouter();
    const { equipe1, equipe2 } = router.query;

    if (!equipe1 || !equipe2) {
        return <div>Carregando...</div>;
    }

    const parsedEquipe1 = JSON.parse(equipe1);
    const parsedEquipe2 = JSON.parse(equipe2);

    return (
        <div className='pb-4'>
            <h1>Equipes Sorteadas</h1>

            <div className="w-full flex justify-center">
                <div className="flex grid-cols-2 gap-4">
                    <PlayerDraw players={parsedEquipe1} />
                </div>
            </div>

            <h1 className='text-5xl text-yellow-300 font-bold flex justify-center p-8'>VS</h1>

            <div className="w-full flex justify-center">
                <div className="flex grid-cols-2 gap-4">
                    <PlayerDraw players={parsedEquipe2} />
                </div>
            </div>
        </div>
    );
};

export default TeamsDrawn;
