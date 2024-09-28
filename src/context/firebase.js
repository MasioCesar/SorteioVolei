import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
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
        player.imgURL = '/user.png';
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


// Função para adicionar jogador com o imgURL sendo o ID do usuário
export const addPlayerCard = async (playerData, playerImageFile) => {
    try {
        let imgURL = "";

        // Verifica se há uma imagem e faz o upload para o Firebase Storage
        if (playerImageFile) {
            // Usar o ID do jogador como nome do arquivo no Firebase Storage
            const storageRef = ref(storage, `players/${playerData.id}.png`);
            const uploadTask = uploadBytesResumable(storageRef, playerImageFile);

            // Espera o upload concluir e obtém o URL da imagem
            await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => reject(error),
                    async () => {
                        // Obtém o URL público da imagem após o upload
                        imgURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve();
                    }
                );
            });
        }

        // Adiciona os dados do jogador no Firestore, incluindo o imgURL (que agora é o URL da imagem)
        const playersCollection = collection(db, 'players');
        const newPlayer = {
            ...playerData, // Nome, estatísticas, etc.
            imgURL,        // URL da imagem do Firebase Storage
        };

        await addDoc(playersCollection, newPlayer);

        console.log("Jogador adicionado com sucesso:", newPlayer);
    } catch (error) {
        console.error("Erro ao adicionar jogador:", error);
    }
};
