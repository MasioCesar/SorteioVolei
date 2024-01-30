import { Card } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getWeightedAverage } from "./playerCard";

export const PlayerDraw = ({ players }) => {
    const [visibleCards, setVisibleCards] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleCards((prev) => {
                const next = prev + 1;
                return next <= players.length ? next : prev;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [players]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {players.map((player, index) => {
                const weightedAverage = getWeightedAverage(player);
                return (
                    <Card
                        key={player.name}
                        className={`mb-2 p-2 fut-player-card fade-in ${index < visibleCards ? "fade-in-init" : "hide"
                            }`}
                        style={{
                            transition: "transform 0.5s ease",
                            transform: `translateX(${index < visibleCards ? "0" : "-100%"})`,
                            opacity: index < visibleCards ? 1 : 0,
                            zIndex: index < visibleCards ? 2 : 1,
                            position: "relative",
                            width: "300px",
                            height: "485px",
                            backgroundImage: `url("${player.gender === "female" ? "/fundoF.png" : "/fundoC2.png"
                                }")`,
                            backgroundPosition: "center center",
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                            padding: "3.8rem 0",
                            backgroundColor: "transparent",
                            boxShadow: "none",
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
                                            style={{ width: "100%", height: "auto" }}
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
                )
            })}
        </div>
    );
};