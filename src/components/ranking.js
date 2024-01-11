import {
    Box,
    Card,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';

import { useState } from 'react';
import { Loader } from './loader';
import { GetRanking } from '../context/getPlayers';

export const Ranking = () => {
    const [ranking, setRanking] = useState([])

    GetRanking(setRanking)

    if (!ranking) {
        return <Box className='h-full flex items-center justify-center bg-[#1F2937] rounded-lg'><Loader /></Box>;
    }

    return (
        <Card>
            <CardHeader
                title="Ranking"
            />
            <Box className='overflow-y-auto h-[414.41px] w-[300px]'>
                <Table size='small'
                    aria-label="a dense table">
                    <TableHead sx={{ backgroundColor: 'background.dark' }}>
                        <TableRow>
                            <TableCell style={{ color: '#9b9ea3' }}>
                                % de Vitórias
                            </TableCell>
                            <TableCell style={{ color: '#9b9ea3' }}>
                                Nome
                            </TableCell>
                            <TableCell style={{ color: '#9b9ea3' }}>
                                Jogos
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ranking.map((ranking, indice) => (
                            <TableRow
                                key={indice}
                            >
                                <TableCell>
                                    {ranking.winPercentage}%
                                </TableCell>
                                <TableCell>
                                    {ranking.name}
                                </TableCell>
                                <TableCell style={{ color: '#9b9ea3' }}>
                                    {ranking.games}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Card>
    );
}