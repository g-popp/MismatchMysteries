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

    if (!room) return false;

    const players = room.users;

    if (!players) return false;

    const playerIds = players.map(player => player.id);

    const choices = playerChoices.map(choice => choice.chooser.id);

    const uniqueChoices = [...new Set(choices)];

    if (uniqueChoices.length !== playerIds.length) {
        return false;
    } else {
        clearChoices();
        return true;
    }
};

const clearChoices = () => {
    playerChoices.length = 0;
};

export { addPlayerChoice, haveAllPlayersChosen };
