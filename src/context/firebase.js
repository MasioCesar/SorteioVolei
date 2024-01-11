import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

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
