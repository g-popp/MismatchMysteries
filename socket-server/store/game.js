import { getRoom, getUser } from './rooms.js';

const playerChoices = [];
const playerBlames = [];

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
        return true;
    }
};

const addPlayerBlame = (playerId, playerChoice) => {
    const ownPlayer = getUser(playerId);
    const chosenPlayer = getUser(playerChoice);

    if (ownPlayer && chosenPlayer) {
        playerBlames.push({ chooser: ownPlayer, chosen: chosenPlayer });
    } else {
        return { error: 'Player not found' };
    }

    return { playerBlames };
};

const haveAllPlayersBlamed = roomId => {
    const room = getRoom(roomId);
    if (!room) return false;

    const players = room.users;
    if (!players) return false;

    const playerIds = players.map(player => player.id);

    const choices = playerBlames.map(choice => choice.chooser.id);

    const uniqueChoices = [...new Set(choices)];

    if (uniqueChoices.length !== playerIds.length) {
        return false;
    } else {
        return true;
    }
};

// TODO: Add room id to this function
const getMostCommonBlame = () => {
    const choices = playerBlames.map(choice => choice.chosen);

    const uniqueChoices = [...new Set(choices)];

    const counts = uniqueChoices.map(choice => {
        return {
            id: choice.id,
            name: choice.name,
            imposter: choice.imposter,
            count: choices.filter(c => c.id === choice.id).length
        };
    });

    const sorted = counts.sort((a, b) => b.count - a.count);

    return sorted;
};

const revealMismatch = () => {
    const sortedBlames = getMostCommonBlame();

    const imposter = sortedBlames.find(player => player.imposter);

    const defaults = sortedBlames.filter(player => !player.imposter);

    if (imposter.count <= defaults[0].count) {
        return 'imposterWon';
    }

    return 'defaultsWon';
};

export {
    addPlayerBlame,
    addPlayerChoice,
    getMostCommonBlame,
    haveAllPlayersBlamed,
    haveAllPlayersChosen,
    revealMismatch
};
