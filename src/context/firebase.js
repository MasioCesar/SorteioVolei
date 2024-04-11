import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { format } from 'date-fns';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export const getPlayers = async (setPlayers) => {
    const playersRef = collection(db, 'players');
    const querySnapshot = await getDocs(playersRef);

    const playerPromises = querySnapshot.docs.map(async (doc) => {
        const player = doc.data();
        player.id = parseInt(doc.id, 10);
        player.imgURL = await getPictureUser(player.id);
        return player;
    });

    // Aguarda todas as promessas serem resolvidas
    const resolvedPlayers = await Promise.all(playerPromises);

    setPlayers(resolvedPlayers);

    resolvedPlayers.sort((a, b) => a.id - b.id);
};

export const getPictureUser = async (userId) => {
    const url = await getDownloadURL(ref(storage, `${userId}.png`));
    console.log(url)
    return url;
};

export const getRanking = async (setRanking) => {
    const rankingRef = collection(db, "players");
    const querySnapshot = await getDocs(rankingRef);

    const ranking = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const wins = data.wins;
        const games = data.games;
        const winPercentage = Math.floor((wins / games) * 100) || 0;
        return {
            name: data.name,
            winPercentage: winPercentage,
            games: games
        };
    });

    ranking.sort((a, b) => b.winPercentage - a.winPercentage);

    setRanking(ranking);
};

export const updateGames = async (player) => {
    const playerIdString = player.id.toString();
    const scoreRef = doc(db, "players", playerIdString);
    await updateDoc(scoreRef, {
        games: player.games,
        wins: player.wins,
    });
}

export const savedGames = async (parsedEquipe1, parsedEquipe2, winnerTeam) => {
    const gamesRef = collection(db, "games");
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 3);
    const isoString = currentDate.toISOString();

    const gameData = {
        winnerTeam: winnerTeam === 'Azul' ? 'Azul' : 'Vermelho',
        loserTeam: winnerTeam === 'Azul' ? 'Vermelho' : 'Azul',
        winningTeam: winnerTeam === 'Azul' ? parsedEquipe1 : parsedEquipe2,
        losingTeam: winnerTeam === 'Azul' ? parsedEquipe2 : parsedEquipe1,
        date: isoString,
    };

    await addDoc(gamesRef, gameData);

}

export const getGamesHistory = async (setGamesHistory) => {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const gamesHistory = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            winnerTeam: data.winnerTeam,
            loserTeam: data.loserTeam,
            winningTeam: data.winningTeam,
            losingTeam: data.losingTeam,
            date: format(new Date(data.date).setHours(new Date(data.date).getHours() + 3), 'dd/MM/yyyy HH:mm:ss')
        };
    });

    setGamesHistory(gamesHistory);
};

export const getTeams = async (team) => {
    const teamPlayers = [];
    const teamsRef = collection(db, 'players');
    const querySnapshot = await getDocs(teamsRef);

    querySnapshot.forEach((doc) => {
        const player = doc.data();
        if (team.includes(player.name)) {
            teamPlayers.push(player);
        }
    });

    return teamPlayers;
};