import { getRoom, getUser } from './rooms.js';

const playerChoices = [];
const playerBlames = [];

const updatePlayerChoice = (playerId, playerChoice) => {
    const ownPlayer = getUser(playerId);
    const chosenPlayer = getUser(playerChoice);

    // Check if player has already chosen
    const playerHasChosen = playerChoices.find(
        choice => choice.chooser.id === ownPlayer.id
    );

    if (!ownPlayer || !chosenPlayer) return { error: 'Player not found' };

    if (playerHasChosen) {
        playerHasChosen.chosen = chosenPlayer;
    } else {
        playerChoices.push({ chooser: ownPlayer, chosen: chosenPlayer });
    }

    return { playerChoices };
};

const getPlayerChoices = roomId => {
    const room = getRoom(roomId);
    if (!room) return { error: 'Room not found' };

    const players = room.users;

    if (!players) return { error: 'Players not found' };

    return playerChoices;
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

const updatedPlayerBlame = (playerId, playerChoice) => {
    const ownPlayer = getUser(playerId);
    const chosenPlayer = getUser(playerChoice);

    // check if player has already blamed
    const playerHasBlamed = playerBlames.find(
        choice => choice.chooser.id === ownPlayer.id
    );

    if (!ownPlayer || !chosenPlayer) return { error: 'Player not found' };

    if (playerHasBlamed) {
        playerHasBlamed.chosen = chosenPlayer;
    } else {
        playerBlames.push({ chooser: ownPlayer, chosen: chosenPlayer });
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

const getMostCommonBlames = roomId => {
    const room = getRoom(roomId);
    if (!room) return console.log({ error: 'Room not found!' });

    const players = room.users;
    if (!players) return console.log({ error: 'Players not found' });

    const choices = playerBlames.map(choice => choice.chosen.id);

    const uniqueChoices = [...new Set(choices)];

    const sortedPlayers = uniqueChoices
        .map(choice => {
            const count = choices.filter(player => player === choice).length;
            const player = players.find(player => player.id === choice);

            return { player, count };
        })
        .sort((a, b) => b.count - a.count);

    return sortedPlayers;
};

const revealMismatch = roomId => {
    const sortedBlames = getMostCommonBlames(roomId);

    const imposter = sortedBlames.find(player => player.imposter);

    const defaults = sortedBlames.filter(player => !player.imposter);

    if (!imposter) return 'imposterWon';
    if (!defaults) return 'defaultsWon';

    if (imposter.count <= defaults[0].count) {
        return 'imposterWon';
    }

    return 'defaultsWon';
};

const clearForNewGame = roomId => {
    const room = getRoom(roomId);
    if (!room) return false;

    const players = room.users;

    if (!players) return false;

    // Clear choices and blames
    playerChoices.length = 0;
    playerBlames.length = 0;

    // Clear imposter
    players.forEach(player => {
        player.imposter = false;
    });

    return true;
};

export {
    clearForNewGame,
    getPlayerChoices,
    haveAllPlayersBlamed,
    haveAllPlayersChosen,
    revealMismatch,
    updatePlayerChoice,
    updatedPlayerBlame
};
