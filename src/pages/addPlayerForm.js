import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Container, MenuItem, Select } from "@mui/material";
import { addPlayerCard } from "../context/firebase";
import Header from "../components/header";

const AddPlayerForm = () => {
    const [playerName, setPlayerName] = useState('');
    const [playerPosition, setPlayerPosition] = useState('');
    const [playerGender, setPlayerGender] = useState('');
    const [playerStats, setPlayerStats] = useState({
        attack: 0, defense: 0, pass: 0, lifting: 0, serve: 0, block: 0
    });

    const handleOverallChange = (e) => {
        const overallValue = parseInt(e.target.value);

        setPlayerStats({
            ...playerStats,
            attack: overallValue,
            defense: overallValue,
            pass: overallValue,
            lifting: overallValue,
            serve: overallValue,
            block: overallValue,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Dados do jogador a serem enviados para o Firestore
        const playerData = {
            name: playerName,
            games: 0,
            wins: 0,
            attack: playerStats.attack,
            defense: playerStats.defense,
            pass: playerStats.pass,
            lifting: playerStats.lifting,
            serve: playerStats.serve,
            block: playerStats.block,
            position: playerPosition,
            id: Date.now(), // ID único
            nation: "Brasil",
            gender: playerGender
        };

        // Chama a função para adicionar o jogador
        await addPlayerCard(playerData);

        // Limpa o formulário
        setPlayerName('');
        setPlayerPosition('')
        setPlayerGender('')
        setPlayerStats({ attack: 0, defense: 0, pass: 0, lifting: 0, serve: 0, block: 0 });
    };

    return (
        <>
            <Header />
            <Container>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Typography variant="h4" gutterBottom className="text-white">
                        Adicionar Jogador
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nome do Jogador"
                                variant="outlined"
                                fullWidth
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <FormLabel>Overall</FormLabel>
                            <TextField
                                label="Overall"
                                type="number"
                                variant="outlined"
                                fullWidth
                                onChange={handleOverallChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl variant="outlined" fullWidth required>
                                <FormLabel>Posição</FormLabel>
                                <Select
                                    value={playerPosition}
                                    onChange={(e) => setPlayerPosition(e.target.value)}
                                >
                                    <MenuItem value="Lev">Levantador</MenuItem>
                                    <MenuItem value="Opo">Oposto</MenuItem>
                                    <MenuItem value="Pon">Ponta</MenuItem>
                                    <MenuItem value="Líb">Líbero</MenuItem>
                                    <MenuItem value="Cen">Central</MenuItem>
                                    <MenuItem value="Ind">Indefinido</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Gênero</FormLabel>
                                <RadioGroup
                                    row
                                    value={playerGender}
                                    onChange={(e) => setPlayerGender(e.target.value)}
                                >
                                    <FormControlLabel value="Male" className="text-white" control={<Radio />} label="Masculino" />
                                    <FormControlLabel value="Female" className="text-white" control={<Radio />} label="Feminino" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box mt={3}>
                        <Button type="submit" variant="outlined" color="primary">
                            Adicionar Jogador
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default AddPlayerForm;
