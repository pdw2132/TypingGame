import React from 'react';
import {
    Button,
    Box
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

const GameInfo = () => {
    const pathNavigate = useNavigate();

    return (
        <Box >
            GameInfo
            <Button onClick={e=>pathNavigate("/gameStart")}>start</Button>
            <Button onClick={e=>pathNavigate("/gameEnd")}>end</Button>
        </Box>
    
    );
};

export default GameInfo;
