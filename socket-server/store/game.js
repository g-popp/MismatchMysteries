import { getRoom, getUser } from './rooms.js';

const playerChoices = [];

const addPlayerChoice = (playerId, playerChoice) => {
    const ownPlayer = getUser(playerId);
    const chosenPlayer = getUser(playerChoice);

    if (ownPlayer && chosenPlayer) {
        playerChoices.push({ chooser: ownPlayer, chosen: chosenPlayer });
    } else {
        return { error: 'Player not found' };
    }

    return { playerChoices };
};

const haveAllPlayersChosen = roomId => {
    const room = getRoom(roomId);

    if (room) {
        const players = room.users;

        if (players.length === playerChoices.length) {
            return true;
        }

        return false;
    }
};

export { addPlayerChoice, haveAllPlayersChosen };
