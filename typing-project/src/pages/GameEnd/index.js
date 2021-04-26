import React from 'react';
import {
    Button,
    Box
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

const GameEnd = () => {
    const pathNavigate = useNavigate();

    return (
        <Box >
            GameEnd
            <Button onClick={e=>pathNavigate("/gameInfo")}>Info</Button>
            <Button onClick={e=>pathNavigate("/gameStart")}>Start</Button>
        </Box>
    
    );
};

export default GameEnd;
