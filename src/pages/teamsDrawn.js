import React from 'react';
import { useRouter } from 'next/router';

const TeamsDrawn = () => {
  const router = useRouter();
  const { equipe1, equipe2 } = router.query;

  if (!equipe1 || !equipe2) {
    return <div>Carregando...</div>;
  }

  const parsedEquipe1 = JSON.parse(equipe1);
  const parsedEquipe2 = JSON.parse(equipe2);

  return (
    <div>
      <h1>Equipes Sorteadas</h1>
      <h2>Equipe 1</h2>
      <ul>
        {parsedEquipe1.map((jogador, index) => (
          <li key={index}>{jogador.name}</li>
        ))}
      </ul>
      <h2>Equipe 2</h2>
      <ul>
        {parsedEquipe2.map((jogador, index) => (
          <li key={index}>{jogador.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TeamsDrawn;
