import React from 'react';
import {
    Button,
    Box
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

const GameStart = () => {
    const pathNavigate = useNavigate();

    return (
        <Box >
            GameStart
            <Button onClick={e=>pathNavigate("/gameInfo")}>Info</Button>
            <Button onClick={e=>pathNavigate("/gameEnd")}>End</Button>
        </Box>
    
    );
};

export default GameStart;
