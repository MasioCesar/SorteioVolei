import { Card } from "@mui/material";

const PlayerCard = ({ player, isSelected, onPlayerSelection }) => {
  const handlePlayerClick = () => {
    onPlayerSelection(player.name);
  };
  return (
    <Card
      className={`mb-2 p-2 ${isSelected ? 'selected' : ''}`}
      onClick={handlePlayerClick}
      style={{
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
  <div class="fut-player-card">
    <div class="player-card-top">
      <div class="player-master-info">
        <div class="player-rating">
          <span>{player.rating}</span>
        </div>
        <div class="player-position">
          <span>{player.position}</span>
        </div>
        <div class="player-nation">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brasil" draggable="false" />
        </div>
      </div>
      <div class="player-picture">
        <img src={player.foto} alt={player.name} draggable="false" />
        <div class="player-extra">
          <span>{player.height}CM</span>
        </div>
      </div>
    </div>
    <div class="player-card-bottom">
      <div class="player-info">
        <div class="player-name">
          <span>{player.name}</span>
        </div>
        <div class="player-features">
          <div class="player-features-col">
            <span>
              <div class="player-feature-value">{player.attack}</div>
              <div class="player-feature-title">ATK</div>
            </span>
            <span>
              <div class="player-feature-value">{player.defense}</div>
              <div class="player-feature-title">DEF</div>
            </span>
            <span>
              <div class="player-feature-value">{player.block}</div>
              <div class="player-feature-title">BLK</div>
            </span>
          </div>
          <div class="player-features-col">
            <span>
              <div class="player-feature-value">{player.serve}</div>
              <div class="player-feature-title">SAQ</div>
            </span>
            <span>
              <div class="player-feature-value">{player.pass}</div>
              <div class="player-feature-title">PAS</div>
            </span>
            <span>
              <div class="player-feature-value">{player.lifting}</div>
              <div class="player-feature-title">LEV</div>
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
      </div>
    </div>
  );
};

export default PlayerCards;
