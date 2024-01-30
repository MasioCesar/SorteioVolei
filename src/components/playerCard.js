import { Card } from "@mui/material";
import Image from "next/image";
import { Ranking } from "./ranking";

export const getWeightedAverage = (player) => {
  const weights = {
    Cen: { attack: 1, defense: 1, block: 2, serve: 1, pass: 1, lifting: 1 },
    Líb: { attack: 1, defense: 2, block: 1, serve: 1, pass: 1, lifting: 1 },
    Opo: { attack: 2, defense: 1, block: 1, serve: 1, pass: 1, lifting: 1 },
    Pon: { attack: 2, defense: 1, block: 1, serve: 1, pass: 1, lifting: 1 },
    Lev: { attack: 1, defense: 1, block: 1, serve: 1, pass: 1, lifting: 2 },
    Ind: { attack: 1, defense: 1, block: 1, serve: 1, pass: 1, lifting: 1 },
  };

  const weightedSum =
    player.attack * weights[player.position].attack +
    player.defense * weights[player.position].defense +
    player.block * weights[player.position].block +
    player.serve * weights[player.position].serve +
    player.pass * weights[player.position].pass +
    player.lifting * weights[player.position].lifting;

  const totalWeight =
    weights[player.position].attack +
    weights[player.position].defense +
    weights[player.position].block +
    weights[player.position].serve +
    weights[player.position].pass +
    weights[player.position].lifting;

  return Math.round(weightedSum / totalWeight);
};

const PlayerCard = ({ player, isSelected, onPlayerSelection }) => {
  const handlePlayerClick = () => {
    onPlayerSelection(player.name);
  };

  const weightedAverage = getWeightedAverage(player);

  return (
    <Card
      className={"p-2"}
      onClick={handlePlayerClick}
      style={{
        border: isSelected ? '0px solid #ffcc00' : '',
        boxShadow: isSelected ? '0px 0px 5px 3px #ffcc00' : '',
        position: 'relative',
        width: '300px',
        height: '485px',
        backgroundImage: `url("${player.gender === 'female' ? '/fundoF.png' : '/fundoC2.png'}")`,
        backgroundPosition: 'center center',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        padding: '3.8rem 0',
        zIndex: 2,
        transition: '200ms ease -in',
      }}
    >
      <div className="fut-player-card">
        <div className="player-card-top">
          <div className="player-master-info">
            <div className="player-rating">
              <span>{weightedAverage}</span>
            </div>
            <div className="player-position">
              <span>{player.position}</span>
            </div>
            <div className="player-nation">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg"
                alt="Brasil"
                width={100}
                height={100}
              />
            </div>
          </div>
          <div className="player-picture">
            <div className="logo">
              <Image
                src={player.imgURL}
                alt={player.name}
                width={300}
                height={200}
                style={{ width: "auto", height: "auto" }}
                priority={true}
              />
            </div>
            <div className="player-extra">
              <span>{player.height}CM</span>
            </div>
          </div>
        </div>
        <div className="player-card-bottom">
          <div className="player-info">
            <div className="player-name">
              <span>{player.name}</span>
            </div>
            <div className="player-features">
              <div className="player-features-col">
                <span>
                  <div className="player-feature-value">{player.attack}</div>
                  <div className="player-feature-title">ATK</div>
                </span>
                <span>
                  <div className="player-feature-value">{player.defense}</div>
                  <div className="player-feature-title">DEF</div>
                </span>
                <span>
                  <div className="player-feature-value">{player.block}</div>
                  <div className="player-feature-title">BLK</div>
                </span>
              </div>
              <div className="player-features-col">
                <span>
                  <div className="player-feature-value">{player.serve}</div>
                  <div className="player-feature-title">SAQ</div>
                </span>
                <span>
                  <div className="player-feature-value">{player.pass}</div>
                  <div className="player-feature-title">PAS</div>
                </span>
                <span>
                  <div className="player-feature-value">{player.lifting}</div>
                  <div className="player-feature-title">LEV</div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card >
  );
};

const PlayerCards = ({ players, selectedPlayers, onPlayerSelection }) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <PlayerCard
            key={player.name}
            player={player}
            isSelected={selectedPlayers.includes(player.name)}
            onPlayerSelection={onPlayerSelection}
          />
        ))}
        <Ranking />
      </div>
    </div>
  );
};

export default PlayerCards;
