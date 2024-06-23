console.log("TEST1")
//TODO:Search for gameState to see if you accidentaly assigned stuff wrongly, fix errors first.
let gameState = {
  currentPlayerIndex : 0,
  currentPlayerColor : '', // Variable to store the current player's color
  playerColors : [],
  playerNames : [],
  playerNamesVoteOption : [],
  colorVotes : [],
  messages : [],
  voter : "", //gameState.currentPlayerColor,
  votes : [], //TODO: Is this one still used? I don't think so.
  numPlayers : 0,
  currentPlayerIsFaded : [],
  fadedColors : {}, // Object to track faded colors and their energy points
  playerColor : "", //gameState.currentPlayerColor,
  playerPoints : {}, // Object to store player points
  currentPlayerName : "",
  turnCount : 0, // Variable to track the current turn count
  roundLimit : 0, // Variable to store the turn limit
  roundCount : 1, // Variable to track the current round TODO: I changed roundcount from 0 to 1, this might have some unforseen consequences.
  actionCount : 0,
  fadedColorStolenPoints : 0,
  messagesByRound : [],
  spyMessagesForNextRound : [],
  revivePointCost : {},
  revivePointCostIncreaseMultiplier : 1,
  fadedColorRank : false,
  fadedColorCount : 0,
  actionLimit : 1,
  playerTurnCounts : {},//Object to track how many turns each player has had.
  roundVoted : "", //roundCount,
  fadedColorMessages : [],
  spyMessages : [],
  fadedColorStartEnabled : false,
  fadedColorPassivePoints : 1,
  numMaxTurnTime : 60,
  maxTurnTime : false,
  turnTimer: 0, // Variable to hold the timer
  timeLeft : 0, //gameState.numMaxTurnTime, // Initial time left for the turn //TODO: Check if this still works and if it now adapts properly based on how much you change numMaxTurntime in the settings.
  timeAttackEnabled : false,
  causeOfGameEnd : document.getElementById('causeOfGameEnd'),
  revealIdentity : [],
  revealRandomNamesEnabled: false,
  revealRandomNamesRandomSettings: false,
  revealIdentityAmountOfReveals : 0,
  revealIdentityRevealToAmount: 0,
  revealIdentityRoundInterval: 0
};
console.log("TEST1")
const votesDiv = document.getElementById('colorVotesTable');
document.getElementById('playerNames').style.display = 'none';
document.getElementById('fadedOptions').style.display = 'none';
document.getElementById('sendAs').style.display = 'none';
document.getElementById('sendMessageAction').style.display = 'none';
document.getElementById('spyAction').style.display = 'none';
document.getElementById('fakeAction').style.display = 'none';
document.getElementById('sendAsDiv').style.display = 'none';
document.getElementById('fadedMessageDisplay').style.display = 'none';
document.getElementById('causeOfGameEnd').style.display = 'none';
document.getElementById('gameSettingsModes').style.display = 'none';
document.getElementById('gameSettingsBalancing').style.display = 'none';






function startGame() {
  gameState.roundLimit = parseInt(prompt("Enter the round limit:"));
  document.getElementById('playerNames').style.display = 'inline';
  const nameInputs = document.querySelectorAll('#nameInputs input');
  for (const input of nameInputs) {
    if (input.value.trim() === '') {
      alert('Please enter names for all players.');
      return;
    } 
        gameState.playerNames.push(input.value);
      
  
  }
  //TODO: Add a check here to see if timeAttackMode has been activated and if the kind of time decrease and the stating time and the amout that gets subtracted or divided by is set, set whichever one of them is not set.
  // Assign random colors to players
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'magenta', 'cyan', 'black', 'maroon', 'teal'];
  gameState.playerColors = [];
  for (let i = 0; i < gameState.numPlayers; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      gameState.playerColors.push(colors[randomIndex]);
      // Remove the assigned color to avoid duplicate assignment
      colors.splice(randomIndex, 1);
      console.log("test")
  }
  // Initialize player points based on player names
  gameState.playerNames.forEach(name => {
    gameState.playerPoints[name] = 0; // Start each player with 0 points
    gameState.revivePointCost[name] = document.getElementById("revCost").value;
    gameState.playerTurnCounts[name] = 0;
  });
  console.log(gameState.playerTurnCounts)
  console.log("Check of playerturncounts")
  console.log(document.getElementById("revCost").value)
  
  const fakeColorSelect = document.getElementById('fake-color');
  const colorSendFakeSelect = document.getElementById('colorSendFake');
  const spyColorSelect = document.getElementById('spy');
  const colorSendSelect = document.getElementById('colorSend');
  const voteColorSelect = document.getElementById('vote-color');
  const voteNameSelect = document.getElementById('vote-name');
  fakeColorSelect.innerHTML = '';
  colorSendFakeSelect.innerHTML = '';
  spyColorSelect.innerHTML = '';
  colorSendSelect.innerHTML = '';
  voteColorSelect.innerHTML = '';
  voteNameSelect.innerHTML = '';
  gameState.playerNamesVoteOption = gameState.playerNames.slice();
  console.log("gameState.playerNames")
  console.log(gameState.playerNames)
  shuffleArray(gameState.playerNamesVoteOption);
  console.log(gameState.playerNames)
  gameState.playerNamesVoteOption.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    voteNameSelect.appendChild(option);
  });
  const uniquePlayerColors = [...new Set(gameState.playerColors)];
  uniquePlayerColors.forEach(color => {
    const option = document.createElement('option');
    option.value = color;
    option.textContent = color.charAt(0).toUpperCase() + color.slice(1); // Capitalize first letter
    fakeColorSelect.appendChild(option.cloneNode(true));
    colorSendFakeSelect.appendChild(option.cloneNode(true));
    spyColorSelect.appendChild(option.cloneNode(true));
    voteColorSelect.appendChild(option.cloneNode(true));
    colorSendSelect.appendChild(option);
});

  console.log(gameState.playerColors)
  document.getElementById('gameSettings').style.display = 'none';
  // Hide start screen
  document.getElementById('startScreen').style.display = 'none';
  // Show game screen
  document.getElementById('gameScreen').style.display = 'block';
  if (devTestSetting === true) {
    displayAssignedColors(gameState.playerColors);
  }
  gameState.currentPlayerIndex = 0;
  // Set the current player's color to the first player's color
  gameState.currentPlayerColor = gameState.playerColors[0];
  document.getElementById('beginTurnBtn').style.display = 'inline'; // Show begin turn button
  if (gameState.fadedColorStartEnabled === true) {
    assignFadedColors(numStartFadedColors); //TODO: Make this a changable value in the settings
  }
  beginTurn()
  

  // Additional game initialization logic can go here
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function assignColors() {
  // Assign random colors to players
  for (let i = 0; i < gameState.numPlayers; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    gameState.playerColors.push(colors[randomIndex]);
    // Remove the assigned color to avoid duplicate assignment
    colors.splice(randomIndex, 1);
  }
  const uniquePlayerColors = [...new Set(gameState.playerColors)];
  uniquePlayerColors.forEach(color => {
    const option = document.createElement('option');
    option.value = color;
    option.textContent = color.charAt(0).toUpperCase() + color.slice(1); // Capitalize first letter
    document.getElementById('colorSend').appendChild(option);
    document.getElementById('colorSendFake').appendChild(option.cloneNode(true));
    document.getElementById('spy').appendChild(option.cloneNode(true));
  });

  // Hide start screen
  document.getElementById('startScreen').style.display = 'none';
  // Show game screen
  document.getElementById('gameScreen').style.display = 'block';
}

function beginGame() {
  gameState.numPlayers = parseInt(document.getElementById('numPlayers').value);
  console.log(gameState.numPlayers)
  if (isNaN(gameState.numPlayers) || gameState.numPlayers < 3 || gameState.numPlayers > 12) {
      alert("Please enter a number between 3 and 12 for the number of players.");
      return;
  }

  
  // Show player name input fields
  document.getElementById('playerNames').style.display = 'block';
  document.getElementById('nameInputs').innerHTML = '';
  for (let i = 0; i < gameState.numPlayers; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter Player ' + (i + 1) + ' Name';
    document.getElementById('nameInputs').appendChild(input);
  }
  displayColorVotes()
  const fadedColor = gameState.playerColors[gameState.currentPlayerIndex - 1]; // Assuming gameState.currentPlayerIndex was already incremented
  if (gameState.fadedColors.hasOwnProperty(fadedColor)) {
    gameState.fadedColors[fadedColor]++; // Increment energy points for the faded color
  }
}

function endTurn() {
  RevealRandomIdentities(gameState.revealIdentityAmountOfReveals, gameState.revealIdentityRevealToAmount, gameState.revealIdentityRoundInterval)
  gameState.actionCount = 0
  if (gameState.turnCount % gameState.numPlayers === 0) {
    gameState.roundCount++; // Increase roundCounter when turnCount is divisible by numPlayers
  } //POT ERROR: this used to be at the start of beginturn
  
  console.log(gameState.messages)
  document.getElementById('beginTurnBtn').style.display = 'inline'; // Show begin turn button
  document.getElementById('endTurnBtn').style.display = 'none';
  document.getElementById('playerOptions').style.display = 'none';
  document.getElementById('fadedOptions').style.display = 'none';
  document.getElementById('messageDisplay').style.display = 'none';
  document.getElementById('fadedMessageDisplay').style.display = 'none';
  
  
  gameState.currentPlayerIndex++;
  gameState.numPlayers = parseInt(document.getElementById('numPlayers').value);
  if (gameState.currentPlayerIndex >= gameState.numPlayers) {
      gameState.currentPlayerIndex = 0; // Reset to the first player if all players have finished their turns
  }
  if (gameState.roundCount >= gameState.roundLimit) {
    // End the game
    alert("The game has ended.");
    document.getElementById('playerOptions').style.display = 'none';
    document.getElementById('fadedOptions').style.display = 'none';

    endGame() 


    // You can add further logic here to display the final scores or perform any other end-game actions.
  }
  if (gameState.maxTurnTime) {
    clearInterval(gameState.turnTimer); // Stop the timer
    if (gameState.timeAttackEnabled) {
      gameState.timeLeft = gameState.numMaxTurnTime - (gameState.playerTurnCounts[gameState.playerNames[gameState.currentPlayerIndex]] * 5) //Check if this actually sets timeleft based on the next player's amount of turns.
    } else {
      gameState.timeLeft = gameState.numMaxTurnTime;
    } // Reset time left TODO: Check if timeattack is set and if it is calculate it based based on what turn it is for the next player, so the player after the currrentplayer.
  }
  gameState.currentPlayerColor = gameState.playerColors[gameState.currentPlayerIndex];
}


function beginTurn() {
  gameState.playerTurnCounts[gameState.currentPlayerName] += 1;
  console.log(gameState.playerTurnCounts)
  gameState.turnCount++; // Increase the turn count at the beginning of each turn
  

  console.log(gameState.messages)
  votesDiv.innerHTML = '';
  if (gameState.maxTurnTime) {
    startTimer();
  }
  if (devTestSetting === true) {
    displayAssignedColors(gameState.playerColors);
  }
  
  displayVoteCounts();
  checkVotes(gameState.currentPlayerColor);
  //displayMessages()
  // Check if the current player is a faded color
  gameState.currentPlayerIsFaded = gameState.fadedColors.hasOwnProperty(gameState.currentPlayerColor);
   // Display faded options if the current player is faded
  if (gameState.currentPlayerIsFaded) {
    document.getElementById('fadedOptions').style.display = 'block'; //TODO: If a new player becomes faded then take all their points and divide them between all the other faded people, except for the new one. This should give an incentive for the other faded colors to help others find out the truth more.But also the player has to balance giving themselves away and giving the other on eaway.
    document.getElementById('sendAs').style.display = 'inline';
    document.getElementById('sendAsDiv').style.display = 'inline';
    document.getElementById('fadedMessageDisplay').style.display = 'inline';
    
  } else {
    document.getElementById('fadedOptions').style.display = 'none';
    document.getElementById('sendAs').style.display = 'none';
    document.getElementById('sendAsDiv').style.display = 'none';
    document.getElementById('fadedMessageDisplay').style.display = 'none';
    console.log(gameState.currentPlayerIsFaded)
  }
  // Show game elements and hide begin turn button
  document.getElementById('beginTurnBtn').style.display = 'none';
  document.getElementById('endTurnBtn').style.display = 'inline';
  document.getElementById('playerOptions').style.display = 'inline';
  document.getElementById('messageDisplay').style.display = 'inline';
  updateVoteOptions();
  displayPlayerPoints();
  displayMessages();
  displayColorVotes();
  displayFadedColorChat ();
  updateColorOptions();
  processSpyRequests();
  revealIdentityCheck ();
  gameState.currentPlayerName = gameState.playerNames[gameState.currentPlayerIndex];
}






    function sendMessage() {
      if (gameState.actionCount === gameState.actionLimit) {
        alert('You have already taken an action this turn.');
        return;
      }
      //TODO: Make it impossible to send a message without anything in it.
      //const playerColor = gameState.playerColors[gameState.currentPlayerIndex]; //TODO: For some reason playerColor is undefined here. It shows up in my gameState.messages undefined anyway.
      console.log(gameState.currentPlayerColor)
      gameState.currentPlayerIsFaded = gameState.fadedColors.hasOwnProperty(gameState.currentPlayerColor);
 
      
      const sendAs = document.getElementById('sendAs').value;
      
      if (gameState.currentPlayerIsFaded) {
        if (sendAs === 'faded') {
          gameState.playerColor = "Faded Color"
        } else {
          gameState.playerColor = gameState.currentPlayerColor; 
        }
      } else {
        gameState.playerColor = gameState.currentPlayerColor; 
      }

      const receivingColor = document.getElementById('colorSend').value;
      console.log(gameState.playerColor)
      const message = document.getElementById('message').value;
      if (message.trim() === '') {
        alert('Please enter text to send a message.');
        return; // Exit the function early
      }
      const roundSent = gameState.roundCount
      const faked = false
        gameState.messages.push({ playerColor, message, receivingColor, roundSent, faked });
        console.log("Player color after assignment:" + gameState.playerColor);
        displayMessages();
        actionButtons();
        document.getElementById('message').value = "";
    }

  function spyColor() {
    if (gameState.actionCount === gameState.actionLimit) {
      alert('You have already taken an action this turn.');
      return;
    }
    const spiedColor = document.getElementById('spy').value;
    const spyColor = gameState.currentPlayerColor
    if ( spiedColor === spyColor) {
      alert('You cannot spy on yourself.')
      return;
    }
      

    // Filter gameState.messages where either the sender or the receiver matches the spy color
    console.log("Messages")
    console.log(gameState.messages)
    spyMessages = gameState.messages.filter(msg => (msg.playerColor === spiedColor || msg.receivingColor === spiedColor) && msg.roundSent === gameState.roundCount);
    console.log("gameState.spyMessages")
    console.log(gameState.spyMessages)
    // Store the spy request for the next round
    gameState.spyMessagesForNextRound.push({ spyColor, spiedColor, spyMessages });
    
    console.log(gameState.spyMessagesForNextRound)
    // Display the messages
    actionButtons();
  }

  function processSpyRequests() {
    console.log("pushed spy message")
    console.log(gameState.spyMessagesForNextRound)
    if (gameState.spyMessagesForNextRound.length === 0) return;
    console.log("there are spy requests")
    console.log(gameState.spyMessagesForNextRound[0].spyColor)
    console.log(gameState.currentPlayerColor)
    if (gameState.spyMessagesForNextRound[0].spyColor !== gameState.currentPlayerColor) return; //TODO: This should make sure that if the spyColor is not the one who is currently playing they see the requests.
    console.log("The current player is the spy")
    const spyRequest = gameState.spyMessagesForNextRound.shift(); // Get the first spy request
    const spiedColor = spyRequest.spiedColor;
    const messagesReceivedBySpy = gameState.messages.filter((msg) => msg.receivingColor === spiedColor && msg.roundSent === (gameState.roundCount - 1));
    console.log("recieved" + messagesReceivedBySpy)
    
    // Filter messages sent by the spy color
    const messagesSentBySpy = gameState.messages.filter((msg) => msg.playerColor === spiedColor && msg.roundSent === (gameState.roundCount - 1));
    console.log("sent" + messagesSentBySpy)
    console.log(gameState.spyMessages)
    const indexFakeCheck = gameState.messages.findIndex(msg => msg.faked === true);
    if (indexFakeCheck !== -1 && gameState.messages[indexFakeCheck].roundSent === gameState.roundCount - 1) {
      console.log("fake message spotted");
      console.log(fakedMessageSpotted);
      alert('One of these gameState.messages is faked.');
    }
    
  
    // Prepare the message for display
    let messageText = `Messages for ${spiedColor}:\n`;
    console.log("recieved spy messages")
    console.log(messagesReceivedBySpy)
    messagesReceivedBySpy.forEach((msg) => {
      messageText += `${msg.gameState.playerColor}: ${msg.message}\n`;
    });

    // Add messages sent by the spy color to the display
    messageText += `\nMessages sent by ${spiedColor}:\n`;
    console.log("sent spy gameState.messages")
    console.log(messagesSentBySpy)
    messagesSentBySpy.forEach((msg) => {
      messageText += `${msg.gameState.playerColor}: ${msg.message}\n`;
    });
  
    // Display the messages
    alert(messageText);
    
  }
    
  
  function fakeMessage() {
    if (gameState.actionCount === gameState.actionLimit) {
      alert('You have already taken an action this turn.');
      return;
    }
      const playerColor = document.getElementById('fake-color').value;
      const receivingColor = document.getElementById('colorSendFake').value;
      if ( gameState.playerColor === receivingColor) {
        alert('You cannot make one color both the sender and reciever.')
        return;
      }
      //if (gameState.playerColor === fakeColor) {
          //alert("You cannot fake your own gameState.messages!");
         // return;
      //}
      const message = document.getElementById('fake-message').value;
      if (message.trim() === '') {
        alert('Please enter text to send a message.');
        return; // Exit the function early
      }
      const roundSent = gameState.roundCount
      const faked = true
      gameState.messages.push({ playerColor, message, receivingColor, roundSent, faked });
      displayMessages();
      actionButtons();
  }

  function displayAssignedColors(colors) {
    const messagesDiv = document.getElementById('messages'); //TODO: PRobably use a different div for this.
    
    messagesDiv.innerHTML = '<h2>Assigned Colors</h2>';
    colors.forEach((color, index) => {
        const playerNumber = index + 1;
        const messageDiv = document.createElement('div');
        //messageDiv.textContent = `Player ${playerNumber}: ${color}`;
        messageDiv.textContent = `Player ${playerNumber}: ${color} (${gameState.playerNames[index]})`;
        if (playerNumber === gameState.currentPlayerIndex + 1) {
            messageDiv.textContent += ' (You)';
        }
        messagesDiv.appendChild(messageDiv);
    });
  }

  function displayMessages() {
      storeMessagesForRound();
    
    console.log(gameState.messages)
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Clear previous gameState.messages before appending new ones
    //messagesDiv.innerHTML = '';
    gameState.messages.forEach(msg => {
      console.log(msg.receivingColor + "Reciever")
      console.log(gameState.currentPlayerColor)
      if (msg.receivingColor === gameState.currentPlayerColor) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${msg.gameState.playerColor}: ${msg.message}`; 
        messagesDiv.appendChild(messageDiv);
      }
    });
    displayMessagesByRound(gameState.roundCount)
  
}

function colorVote() {
  if (gameState.roundCount < 1) {
    alert('Please refrain from voting until round 2 starts.')
    return;
  }
  const voteColorSelect = document.getElementById('vote-color');
  const voteNameSelect = document.getElementById('vote-name');
  const voteColor = document.getElementById('vote-color').value;
  const voteName = document.getElementById('vote-name').value;

  
  
  gameState.voter = gameState.currentPlayerColor
  console.log("colorVoteCheck")
  console.log(gameState.currentPlayerColor)
  console.log(gameState.currentPlayerName)
  if (voteColor === gameState.currentPlayerColor || voteName === gameState.currentPlayerName) {
    //TODO: For some reason this doesn't properly trigger.
    alert('You cannot vote on yourself. You cannot use your own name or color in a vote.')
    return;
  }
  gameState.roundVoted = gameState.roundCount
  if (voteColor.trim() === '' || voteName.trim() === '') {
    alert('There are no vote options left. Revoke a vote if you want to change it.');
    return; // Exit the function early
  }
  

  // Remove the selected color and name from the dropdown menus
  removeOptionFromSelect(voteColorSelect, voteColor, gameState.voter, gameState.roundVoted);
  removeOptionFromSelect(voteNameSelect, voteName, gameState.voter, gameState.roundVoted);
  //TODO: For some reason the code doesn't trigger.
  if (voteColor.trim() === '' || voteName.trim() === '') {
    alert('Please select both a color and a name to vote.'); //TODO: Use this code to make the option dissapear.
    return; // Exit the function early
  }

  gameState.colorVotes.push({ voteColor, voteName, voter, roundVoted });
  console.log(gameState.colorVotes); // Optionally, you can log the array to verify it's working
  displayColorVotes();
}

function removeOptionFromSelect(selectElement, value, voter) {
  const options = voter === gameState.currentPlayerColor ? selectElement.querySelectorAll('option') : selectElement.querySelectorAll(`option[value='${gameState.voter}']`);
  //const options = selectElement.querySelectorAll('option');
  options.forEach(option => {
    if (option.value === value) {
      option.remove();
    }
  });
    
}

function displayColorVotes() {

  
  //TODO: The vote cache only gets properly cleared each turn, when the player comes back for some reason all options are put back. (Try to fix that)
  votesDiv.innerHTML = ''; // Clear previous gameState.messages before appending new ones
  //messagesDiv.innerHTML = '';
  gameState.colorVotes.forEach((clrVt, index) => {
    console.log(gameState.currentPlayerColor)
    if (clrVt.gameState.voter === gameState.currentPlayerColor) {
      const voteDiv = document.createElement('div');
      voteDiv.textContent = `${clrVt.voteColor}: ${clrVt.voteName}`; 
      // Create a button to revoke the vote
      const revokeButton = document.createElement('button');
      revokeButton.textContent = 'Revoke Vote';
      revokeButton.addEventListener('click', () => revokeVote(index));

      voteDiv.appendChild(revokeButton);
      votesDiv.appendChild(voteDiv);
    }
  });
  
}

function revokeVote(index) {
  const revokedVote = gameState.colorVotes.splice(index, 1)[0]; // Remove the vote from colorVotes array
  const voteColorSelect = document.getElementById('vote-color');
  const voteNameSelect = document.getElementById('vote-name');

  // Add the revoked color and name back to the dropdown menus
  const colorOption = document.createElement('option');
  colorOption.value = revokedVote.voteColor;
  colorOption.textContent = revokedVote.voteColor.charAt(0).toUpperCase() + revokedVote.voteColor.slice(1);
  voteColorSelect.appendChild(colorOption);

  const nameOption = document.createElement('option');
  nameOption.value = revokedVote.voteName;
  nameOption.textContent = revokedVote.voteName;
  voteNameSelect.appendChild(nameOption);

  displayColorVotes(); // Refresh the displayed votes
}

function countVotes() {
  const voteCounts = {}; // Object to store the count of votes for each player's color

  // Initialize the vote count for each player's color
  gameState.playerColors.forEach(color => {
    voteCounts[color] = 0;
  });

  // Count the votes
  gameState.colorVotes.forEach(vote => {
    if (voteCounts[vote.voteColor] !== undefined) {
      voteCounts[vote.voteColor]++;
    }
  });

  return voteCounts;
}

function displayVoteCounts() {
  const voteCounts = countVotes();
  const voteCountsDiv = document.getElementById('voteCounts');
  voteCountsDiv.innerHTML = '<h2>Vote Counts</h2>';

  gameState.playerColors.forEach(color => {
    const voteCount = voteCounts[color];
    const voteCountDiv = document.createElement('div');
    voteCountDiv.textContent = `${color}: ${voteCount}`;
    voteCountsDiv.appendChild(voteCountDiv);
  });
}

function checkVotes() {
  gameState.currentPlayerName = gameState.playerNames[gameState.currentPlayerIndex];

  // Array to store unique votes
  const uniqueColorVotes = [];

  // Iterate through gameState.colorVotes array
  gameState.colorVotes.forEach(vote => {
    const existingIndex = uniqueColorVotes.findIndex(uniqueVote =>
      uniqueVote.voteColor === vote.voteColor &&
      uniqueVote.voteName === vote.voteName &&
      uniqueVote.gameState.roundVoted < vote.gameState.roundVoted
    );

    // If no existing vote or current vote has higher gameState.roundVoted, add it to uniqueColorVotes
    if (existingIndex === -1) {
      uniqueColorVotes.push(vote);
    } else {
      // Replace existing vote with the current one
      uniqueColorVotes[existingIndex] = vote;
    }
  });
  console.log("Uniquevotes")
  console.log(uniqueColorVotes)
  console.log(gameState.colorVotes)

  const correctVotes = uniqueColorVotes.filter(vote => vote.voteColor === gameState.currentPlayerColor && vote.voteName === gameState.currentPlayerName && vote.gameState.roundVoted < gameState.roundCount);
  const numCorrectVotes = correctVotes.length;
  // Filter votes where color is correct but name is wrong
  const wrongNameVotes = uniqueColorVotes.filter(vote => vote.voteColor === gameState.currentPlayerColor && vote.voteName !== gameState.currentPlayerName && vote.gameState.roundVoted < gameState.roundCount);
  console.log(wrongNameVotes)
  const numWrongNameVotes = wrongNameVotes.length
  console.log("numWrongNameVotes")
  console.log(numWrongNameVotes)

  // Filter votes where name is correct but color is wrong
  const wrongColorVotes = uniqueColorVotes.filter(vote => vote.voteColor !== gameState.currentPlayerColor && vote.voteName === gameState.currentPlayerName && vote.gameState.roundVoted < gameState.roundCount);
  const numWrongColorVotes = wrongColorVotes.length
  console.log("numWrongColorVotes")
  console.log(numWrongColorVotes)
  // Combine both types of wrong votes
  const numWrongVotesTotal = (numWrongNameVotes + numWrongColorVotes)
  const totalVotesForPlayer = (numCorrectVotes + numWrongVotesTotal)
  if (gameState.playerTurnCounts[gameState.currentPlayerName] > 1) {
    alert(`You received ${numCorrectVotes} correct votes out of ${totalVotesForPlayer} total votes. That means you Received ${numWrongVotesTotal} wrong votes.`);
    if (gameState.fadedColorStartEnabled) {
      if (gameState.currentPlayerIsFaded) {
        awardPoints(gameState.currentPlayerName, (10*numWrongVotesTotal)) //TODO: Set how many times the player's points get boosted per wrong answer with the start fadedcolorgamemode.
      } else {
        awardPoints(gameState.currentPlayerName, (1*numWrongVotesTotal))
      }
    } else {
      awardPoints(gameState.currentPlayerName, (1*numWrongVotesTotal))
    }
    deductPoints(gameState.currentPlayerName, (2*numCorrectVotes))
  } else {
    return;
  }
  
  gameState.currentPlayerIsFaded = gameState.fadedColors.hasOwnProperty(gameState.currentPlayerColor);
    //TODO: Check if this triggers or not it should only trigger if the curentplayer is not a fadedcolor.
    console.log("numCorrectVotes")
    console.log(numCorrectVotes)
    console.log("Vote requirement")
    console.log(((gameState.numPlayers - (1 + gameState.fadedColorCount)) / 2))
    if (numCorrectVotes > ((gameState.numPlayers - (1 + gameState.fadedColorCount)) / 2)) { 
      //TODO: For some reason the faded color math doesn't seem to work anymore. Check this out
      console.log((gameState.numPlayers - (1 + gameState.fadedColorCount) / 2)) //TODO: Check if theis part of the gamemath seems to work, I added the fadedcolorcount to what should be subtracted.
      //TODO: Check if this code is still corect or not.
      if (!gameState.currentPlayerIsFaded) {
        alert(`You got found out. You are now a faded color.`);
        gameState.fadedColorCount += 1
        gameState.fadedColors[gameState.currentPlayerColor] = true;
        if ((Object.keys(gameState.fadedColors).length - 1) !== 0) {
          //The above line is to make sure you don't divide by zero
          gameState.fadedColorStolenPoints = gameState.playerPoints[gameState.currentPlayerName]/ ( Object.keys(gameState.fadedColors).length - 1)
          console.log("gameState.fadedColorStolenPoints" + gameState.fadedColorStolenPoints)
          console.log( Object.keys(gameState.fadedColors).length)
          gameState.playerColors.forEach(playerColor => {
            if (gameState.fadedColors.hasOwnProperty(playerColor)){
              awardPoints(gameState.playerColor, gameState.fadedColorStolenPoints) //TODO: Find a way to check the name based on the color. And then replace playercolor here by that.
            }
            console.log(gameState.fadedColorStolenPoints) //TODO: There is something wrong with this.
            //TODO: Test out this experimental code, check out to see if this works or not. Alos, I want it to not trigger for each playerName but for each playername in fadedcolor
          });
        }
        deductPoints(gameState.currentPlayerName, gameState.playerPoints[gameState.currentPlayerName])
      } else {
      alert(`The majority still thinks it was you.`)
      awardPoints(gameState.currentPlayerName, (gameState.fadedColorPassivePoints)) //TODO: Make a setting for how much points each faded color gains per turn.
      }
    } else {
      alert(`You are currently not found out.`)
      
    }
    displayPlayerPoints()
  }

function specialMove() {
  const fadedColor = gameState.currentPlayerColor;
  const energyPoints = gameState.fadedColors[fadedColor]; //TODO: Convert the energypoint to the regular point vaibale to make sure that it properly works.
  
  // Check if enough energy points are available for the special move
  if (energyPoints >= requiredEnergyPoints) {
    deductPoints(gameState.currentPlayerName, requiredEnergyPoints)
    // Implement the special move logic here
    // For example, coming back to life or scrambling gameState.messages
  } else {
    alert("Not enough energy points for this special move.");
  }
}

function reviveFadedColor() {
  //TODO: Check if the revcostincreases properly function.
  console.log(gameState.revivePointCost[gameState.currentPlayerName] + " revpointcost")
  const revRules = document.getElementById('reviveRulesApplication').value;
  const revCostIncRule = document.getElementById('revCostIncreaseRule').value;
  gameState.revivePointCostIncreaseMultiplier = document.getElementById('revCostIncrease').value;
  if (gameState.playerPoints[gameState.currentPlayerName] >= gameState.revivePointCost[gameState.currentPlayerName]) {
    deductPoints(gameState.currentPlayerName, gameState.revivePointCost[gameState.currentPlayerName])
    delete gameState.fadedColors[gameState.currentPlayerColor];
    console.log(gameState.currentPlayerColor + " just revived.")
    document.getElementById('fadedOptions').style.display = 'none';
    document.getElementById('sendAs').style.display = 'none';
    //TODO: Give an in game prompt that is not a pop-up to tell the player that they got revived
    alert("You just revived.");
    if (gameState.fadedColorStartEnabled) {
      alert("Game over, a faded color just revived.") //TODO: Make this visually update the endgame part. To properly display the cause of the endgame function being called. (Maybe add a div that is called "cause of endgame")
      gameState.causeOfGameEnd.innerHTML = "Cause of ended game: A faded color revived.";
      
      endGame()
    }
    gameState.fadedColorCount -= 1
    if (revCostIncRule === "noIncrease") {

    } else {
      if (revRules === "shared") {
        if (revCostIncRule === "multiIncrease") {
          gameState.playerNames.forEach(name => {
            gameState.revivePointCost[name] *= gameState.revivePointCostIncreaseMultiplier;
          });
        console.log("shared cost of revive option just increased.")
        } else if (revCostIncRule === "expoIncrease") {
            gameState.playerNames.forEach(name => {
              gameState.revivePointCost[name] **= gameState.revivePointCostIncreaseMultiplier;
            });
          console.log("shared cost of revive option just increased.")
        }
      } else if (revRules === "separate") {
          if (revCostIncRule === "multiIncrease") {
            gameState.revivePointCost[gameState.currentPlayerName] *= gameState.revivePointCostIncreaseMultiplier;
            console.log("Revive cost for " + gameState.currentPlayerName + " just increased.")
          } else if (revCostIncRule === "expoIncrease") {
            gameState.revivePointCost[gameState.currentPlayerName] **= gameState.revivePointCostIncreaseMultiplier;
            console.log("Revive cost for " + gameState.currentPlayerName + " just increased.")
          }
      }
    }
  } else {
    alert("Not enough energy points to revive.");
  }
}

function scrambleMessage() {
  // Get the color whose message to scramble
  const colorSelect = document.getElementById('scramble-color');
  const selectedColor = colorSelect.value;

  // Sort messages based on roundSent in descending order
  gameState.messages.sort((a, b) => b.roundSent - a.roundSent);

  // Find the message sent by the selected color during the current turn
  const messageIndex = gameState.messages.findIndex(msg => msg.gameState.playerColor === selectedColor);
  if (messageIndex !== -1) {
  //const message = messages.find(msg => msg.gameState.playerColor === selectedColor);
  const message = gameState.messages[messageIndex].message;

  
    // Scramble the message
    //const scrambledMessage = scrambleText(message.message);
    console.log(gameState.messages[messageIndex].message)
    const scrambledMessage = scrambleText(message);
    gameState.messages[messageIndex].message = scrambledMessage;
    console.log(gameState.messages[messageIndex].message)
    console.log(gameState.messages)
    //TODO: For some reason it seems to correctly replace the index, but for whatever reason it doesn't appear to work in displaying that message.
    //It's probably because the game is unsure about at what round the message was "resent", aside from gameState.playerColor, message and revievingcolor I'll probably also will need to add "roundSent" so the game is sure of at what round a message was sent, that would make it easier for me to use less hacky approaches.

    // Display the scrambled message
    alert(`Scrambled Message from ${selectedColor}: ${scrambledMessage}`);
    //TODO: Find a way to replace the real message with the scrambled one.
  } else {
    alert('No message found from the selected color.');
  }
}

function scrambleText(text) {
  // Split the text into an array of characters
  const characters = text.split('');

  // Shuffle the characters randomly
  for (let i = characters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }

  // Join the characters back into a string
  return characters.join('');
}

function displayMessagesSentByColor(color) {
  const messagesDiv = document.getElementById('messagesSentByColor');
  messagesDiv.innerHTML = ''; // Clear previous gameState.messages before appending new ones

  // Find all messages sent by the specified color during the current turn
  const colorMessages = gameState.messages.filter(msg => msg.playerColor === color);

  // Display each message sent by the color
  colorMessages.forEach(msg => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${msg.gameState.playerColor}: ${msg.message}`;
    messagesDiv.appendChild(messageDiv);
  });
}

function updateColorOptions() {
  const colorSelect = document.getElementById('scramble-color');
  colorSelect.innerHTML = ''; // Clear previous options

  // Get the colors that sent messages during the current turn
  //const colorsWithMessages = [...new Set(gameState.messages.map(msg => msg.gameState.playerColor))];
  const colorsWithMessages = [...new Set(gameState.messages.filter(msg => msg.roundSent === gameState.roundCount).map(msg => msg.gameState.playerColor))];
  console.log("colorsWithMessages:")
  console.log(colorsWithMessages)


  // Populate the color select dropdown with the colors that sent gameState.messages
  colorsWithMessages.forEach(color => {
    const option = document.createElement('option');
    option.value = color;
    option.textContent = color.charAt(0).toUpperCase() + color.slice(1); // Capitalize first letter
    colorSelect.appendChild(option);
  });
}

function updateVoteOptions() {
  //TODO: This is the cause of why the game gives too many vote options. Make it so that it doesn't update the things the player already voted.
  const voteColorSelect = document.getElementById('vote-color');
  const voteNameSelect = document.getElementById('vote-name');
  
  // Clear the current options
  voteColorSelect.innerHTML = '';
  voteNameSelect.innerHTML = '';
  //if (gameState.playerTurnCounts[gameState.currentPlayerName] === 0) {
  //TODO: The code to re-add specific buttons that haven't been voted on yet or have been revoked needs to be re-implemented. (Maybe save them in an object?)
    

  // Get the colors and names previously voted on by the current player
  const colorsVotedByPlayer = gameState.colorVotes.filter(vote => vote.gameState.voter === gameState.currentPlayerColor).map(vote => vote.voteColor);
  const namesVotedByPlayer = gameState.colorVotes.filter(vote => vote.gameState.voter === gameState.currentPlayerColor).map(vote => vote.voteName);
  // Repopulate the options for the new current player
  // Repopulate the options for the new current player
  gameState.playerColors.forEach(color => {
    if (!colorsVotedByPlayer.includes(color)) {
      const optionColor = document.createElement('option');
      optionColor.value = color;
      optionColor.textContent = color.charAt(0).toUpperCase() + color.slice(1);
      voteColorSelect.appendChild(optionColor);
    }
  });

  gameState.playerNamesVoteOption.forEach(name => {
    if (!namesVotedByPlayer.includes(name)) {
      const optionName = document.createElement('option');
      optionName.value = name;
      optionName.textContent = name;
      voteNameSelect.appendChild(optionName);
    }
  });
  }
//}
function awardPoints(playerName, points) {
  console.log("Attempted to give points to:")
  console.log(playerName)
  gameState.playerPoints[playerName] += points;
}

function deductPoints(playerName, points) {
  gameState.playerPoints[playerName] -= points;
}

function displayPlayerPoints() {
  //TODO: This now displays the names and the point, but it also shows the gameState.currentPlayerColor with: "NaN" next to it. try to fix that.
  const pointsDiv = document.getElementById('playerPoints');

  // Clear previous points display
  pointsDiv.innerHTML = '';
  // Get the current player's name
  gameState.currentPlayerName = gameState.playerNames[gameState.currentPlayerIndex];

  // Iterate over each player and display their points
  console.log(gameState.playerPoints)
  Object.entries(gameState.playerPoints).forEach(([name, points]) => {
    if (!isNaN(points)) {
      if (name === gameState.currentPlayerName) {
        const playerPointsDiv = document.createElement('div');
        playerPointsDiv.textContent = `Your name: ${name}\nYour color: ${gameState.currentPlayerColor}\nYour points: ${points}`;
        playerPointsDiv.style.display = "block";
        pointsDiv.appendChild(playerPointsDiv);
      }
    }
  });
}

function endGame() {
  document.getElementById('causeOfGameEnd').style.display = 'inline';
  const endGameDiv = document.getElementById('endGame');
  endGameDiv.innerHTML = '<h2>End of Game</h2>';

  // Extract points of each player
  const playerPointsArray = gameState.playerNames.map(name => ({ name, points: gameState.playerPoints[name], color: gameState.playerColors[gameState.playerNames.indexOf(name)] }));

  // Sort players by points in descending order
  playerPointsArray.sort((a, b) => b.points - a.points);

  let rank = 1; // Start with rank 1
  let prevPoints = playerPointsArray[0].points;

  // Display players
  playerPointsArray.forEach((player, index) => {
    const { name, color, points } = player;
    const playerInfoDiv = document.createElement('div');
    let playerRank = rank; // Store the current rank before adjustment
    console.log(color)
    if (gameState.fadedColors.hasOwnProperty(color) && points === prevPoints && gameState.fadedColorRank === false ) {
      console.log("fadedcolor has same amount of points.")
      playerRank++; 
      if (gameState.fadedColors.hasOwnProperty(color)) {
        console.log("fadedcolor detected.")
        if (gameState.fadedColorRank === false) { 
          const fadedText = document.createElement('div');
          fadedText.textContent = 'Faded colors:';
          endGameDiv.appendChild(fadedText);
          gameState.fadedColorRank = true
        }
        prevPoints = points; // Update previous points for faded players
      }
    }

    // Adjust rank based on points change
    if (points !== prevPoints) {
      playerRank = index + 1; // Update rank if points change
    }

    playerInfoDiv.textContent = `Rank: ${playerRank}, Color: ${color}, Name: ${name}, Points: ${points}`;
    endGameDiv.appendChild(playerInfoDiv);
  });
}

function actionButtons() {
  document.getElementById('sendMessageAction').style.display = 'none';
  document.getElementById('spyAction').style.display = 'none';
  document.getElementById('fakeAction').style.display = 'none';
  document.getElementById('fakeBtnDiv').style.display = 'inline';
  document.getElementById('messageBtnDiv').style.display = 'inline';
  document.getElementById('spyBtnDiv').style.display = 'inline';
  //TODO make this show the variety of buttons you can press, make it be divided in fake message, spy, send message.
  if (gameState.actionCount === gameState.actionLimit) {
    console.log(gameState.actionCount)
    alert('You have already taken all your actions.');
    return;
  }
  gameState.actionCount += 1
}

function spyButton() {
  //TODO: Make this show the options for spying etc.
  document.getElementById('sendMessageAction').style.display = 'none';
  document.getElementById('spyAction').style.display = 'inline';
  document.getElementById('fakeAction').style.display = 'none';
  document.getElementById('fakeBtnDiv').style.display = 'none';
  document.getElementById('messageBtnDiv').style.display = 'none';
  document.getElementById('spyBtnDiv').style.display = 'none';
  

}

function fakeButton() {
  //TODO: Make this show the options for faking etc.
  document.getElementById('fakeAction').style.display = 'inline';
  document.getElementById('sendMessageAction').style.display = 'none';
  document.getElementById('spyAction').style.display = 'none';
  document.getElementById('spyBtnDiv').style.display = 'none';
  document.getElementById('messageBtnDiv').style.display = 'none';
  document.getElementById('fakeBtnDiv').style.display = 'none';
}

function messageButton() {
  //TODO: Make this show the options for messaging etc.
  document.getElementById('spyAction').style.display = 'none';
  document.getElementById('sendMessageAction').style.display = 'inline';
  document.getElementById('fakeAction').style.display = 'none';
  document.getElementById('spyBtnDiv').style.display = 'none';
  document.getElementById('fakeBtnDiv').style.display = 'none';
  document.getElementById('messageBtnDiv').style.display = 'none';
}

function fadedButton() {
  //TODO: Make this show the options Faded colors have.
}

function undoChoice() {
  gameState.actionCount -= 1
  actionButtons()

}

function displayMessagesByRound(round) {
  const messagesDiv = document.getElementById('messages');
  //TODO: Now use the other variable, roundSent that is pushed in the message to be able to properly check when somethign was sent, first filter out of those and then do the additional filtering.
  messagesDiv.innerHTML = ''; // Clear previous messages

  // Display messages for the specified round. Make it use the roundSent instead.
  if (round > 0 && round <= gameState.messagesByRound.length) {
    //gameState.messagesByRound[round - 1].forEach(msg => {
    // Filter messages for the specified round
    const messagesForRound = gameState.messages.filter(msg => msg.roundSent < round);

    // Display filtered gameState.messages
    messagesForRound.forEach(msg => {
        console.log(msg.receivingColor + "Receiver");
        console.log(gameState.currentPlayerColor);
        if (msg.receivingColor === gameState.currentPlayerColor) {
          const messageDiv = document.createElement('div');
          messageDiv.style.color = msg.gameState.playerColor; // Set color of the sender
          messageDiv.textContent = `${msg.gameState.playerColor}: ${msg.message}`;
          messagesDiv.appendChild(messageDiv);
        }
      });
  } else {
    console.log("Invalid round number.");
  }
}

function storeMessagesForRound() {
  gameState.messagesByRound.push([...gameState.messages]); // Clone the gameState.messages array for the current round
  if (eraseMessages === true) {
    gameState.messages.length = 0; // Clear the gameState.messages array for the next round TODO: Make a setting for either enabling or diabling this. Enabling would make it harder to remember text and disabling would make it eassier.
  }
}

function saveSettings() {
  eraseMessages = document.getElementById('eraseMessages').checked;
  devTestSetting = document.getElementById('devTestSetting').checked;
  gameState.fadedColorStartEnabled = document.getElementById('fadedColorStart').checked; //TODO: Make this also activate the gamemode, give extra points if they get a guess wrong.
  numStartFadedColors = document.getElementById('numStartFadedColors').value;
  gameState.fadedColorPassivePoints = document.getElementById('gameState.fadedColorPassivePoints').value;
  gameState.maxTurnTime = document.getElementById('maxTurnTime').checked;
  gameState.numMaxTurnTime = document.getElementById('numMaxTurnTime').value;
  gameState.timeLeft = gameState.numMaxTurnTime;
  gameState.timeAttackEnabled = document.getElementById('timeAttackMode').checked;
  gameState.revealRandomNamesEnabled = document.getElementById('revealRandomNames').checked;
  gameState.revealRandomNamesRandomSettings = document.getElementById('revealRandomNamesRandomSettings').checked;
  gameState.revealIdentityAmountOfReveals = document.getElementById('revealRandomNamesNamesRevealed').value;
  gameState.revealIdentityRevealToAmount = document.getElementById('revealRandomNamesRevealedTo').value;
  gameState.revealIdentityRoundInterval = document.getElementById('revealRandomNamesRoundInterval').value;
  
  
  // You can perform further actions here, like saving to localStorage or sending to server
  // For now, let's just log the settings
  console.log("eraseMessages:", eraseMessages);
}

function fadedColorChat () {
  console.log(gameState.playerColor)
  const fadedColorMessage = document.getElementById('fadedColorMessage').value;
  if (fadedColorMessage.trim() === '') {
    alert('Please enter text to send a message.');
    return; // Exit the function early
  }
  const roundSent = gameState.roundCount
  gameState.fadedColorMessages.push({ playerColor, fadedColorMessage, roundSent });
    console.log("Fadedcolormessages:" + gameState.fadedColorMessages);
    displayFadedColorChat();
    actionButtons();
    document.getElementById('fadedColorMessage').value = "";
}

function displayFadedColorChat () {
  gameState.currentPlayerIsFaded = gameState.fadedColors.hasOwnProperty(gameState.currentPlayerColor);
  if (gameState.currentPlayerIsFaded) {
    //TODO: Filter based on roundsent. Only show the gameState.messages from exactly roundsent = roundcount - 1 or roundsent < roundcount based on wheter or not the game was set to remove gameState.messages or not.
    const fadedMessages = document.getElementById('fadedMessages'); //TODO: Change the name of this container and make it a real thing.
    fadedMessages.innerHTML = ""; // Clear previous gameState.messages
    gameState.fadedColorMessages.forEach(message => {
      const messageElement = document.createElement('div');
      //TODO: Probably add a way to display wheter or not you sent a message yourself.
      messageElement.textContent = `Faded Color: ${message.fadedColorMessage}`;
      fadedMessages.appendChild(messageElement);
    });
  }
    
}


function showGuide() {
  var guideDiv = document.getElementById('guideForNewPlayers');
  //TODO: Display this text better, make it all start at the same point. (Cenetered but all starting from the same cenetered point)
  var guideText = "<div style='text-align: center; width: 100%;'>" +
                  "<div style='display: inline-block; text-align: left;'>" +
                  "<br>Welcome to Color_code!<br>" +
                  "This game is a sort of social deduction game. The goal in this game is to find out what color the other players are without them finding out what color you are.<br>" +
                  "Every time someone combines the wrong name and color for a vote both that name and color gain extra points. So lying about who you are or pretending to be a fake color will give you extra points but might also benefit others. Try to keep a decent balance between truth and lies all the while trying to figure out what the others are doing.<br>" +
                  "When enough players figure out the correct name assigned to a color that person becomes a faded-color. The players won't be notified if their vote was correct or not. A faded-color wants to make others faded as well so they can steal their points, they also can revive themselves if they have enough points. They passively gain points each round, this can be combatted by the regular players correctly voting on the player's true color and their name. If other players vote wrong, just like normal this assigns extra points to the faded-colors.<br>" +
                  "The game ends after X amount of rounds. At the end your scoring will be calculated by the amount of points you have and whether or not you are a faded color (faded colors are always scored lower than regular ones)." +
                  "</div></div>";
  if (guideDiv.innerHTML.trim() === "") {
    guideDiv.innerHTML = guideText; // Fill guideDiv if it's empty
  } else {
    guideDiv.innerHTML = ""; // Clear guideDiv if it's already filled
  }
}

function assignFadedColors(numFadedColors) {
  const players = Object.keys(gameState.playerPoints);
  const shuffledPlayers = players.sort(() => Math.random() - 0.5); // Shuffle player order

  // Assign faded colors to the first numFadedColors players after shuffling
  const fadedColorsAssigned = shuffledPlayers.slice(0, numFadedColors);
  gameState.fadedColorStolenPoints = gameState.playerPoints[gameState.currentPlayerName]/ ( Object.keys(gameState.fadedColors).length - 1)

  fadedColorsAssigned.forEach(playerName => {
    const playerColor = gameState.playerColors[gameState.playerNames.indexOf(playerName)];
    gameState.fadedColors[playerColor] = true;
    gameState.fadedColorCount++;
    Object.keys(gameState.fadedColors).forEach(color => {
      if (color !== gameState.playerColor) {
        awardPoints(color, gameState.fadedColorStolenPoints);
      }
    });

    deductPoints(playerName, gameState.playerPoints[playerName]); // Remove all points from the faded player
  });

  return fadedColorsAssigned;
}

function startTimer() {
  gameState.turnTimer = setInterval(() => {
    gameState.timeLeft--;
    if (gameState.timeLeft <= 0) {
      clearInterval(gameState.turnTimer);
      gameState.timeLeft = gameState.numMaxTurnTime;
      endTurn(); // Trigger end of turn when time runs out
      alert("Time's up! Turn ended.");
      console.log('timer just ran out.')
    } else {
      console.log("timer is working" + gameState.timeLeft + " time left.")
    }
  }, 1000); // Update timer every second
}

function showGameModes() {
  toggleDisplay('gameSettingsModes');
}

function showBalancing() {
  toggleDisplay('gameSettingsBalancing');
}

function toggleDisplay(elementId) {
  const element = document.getElementById(elementId);
  const button = document.getElementById(elementId + 'Button');
  if (element.style.display === 'inline') {
    element.style.display = 'none';
    if (button) {
      button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
  } else {
    element.style.display = 'inline';
    if (button) {
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = 'Go back';
    }
  }
}

function RevealRandomIdentities(numIdentities, numPlayers, roundInterval) {
  // Ensure there are players in the arrays
  if (gameState.playerNames.length === 0 || gameState.playerColors.length === 0) {
    console.log("No players available");
    return;
  }

  // Ensure revealidentity array exists
  if (!gameState.revealIdentity) {
    gameState.revealIdentity = [];
  }

  // Check if it's the correct round to reveal identities
  console.log("roundCount " + gameState.roundCount)
  console.log(gameState.roundCount % roundInterval)
  if (gameState.roundCount % roundInterval !== 0 ) {
    console.log(`Round ${gameState.roundCount}: Not the right round to reveal identities.`);
    gameState.revealIdentity = [];
    return;
  }
  console.log("AYO")
  for (let i = 0; i < numPlayers; i++) {
    // Generate the first random index
    const randomIndex1 = Math.floor(Math.random() * gameState.playerNames.length);

    for (let j = 0; j < numIdentities; j++) {
      // Generate the second random index, ensuring it is different from the first
      let randomIndex2;
      do {
        randomIndex2 = Math.floor(Math.random() * gameState.playerNames.length);
      } while (randomIndex2 === randomIndex1);

      // Get the player names and colors at the random indices
      const playerName1 = gameState.playerNames[randomIndex1];
      const playerColor1 = gameState.playerColors[randomIndex1];
      const playerColor2 = gameState.playerColors[randomIndex2];

      // Output the player names and colors
      console.log(`Player ${i + 1}: Name: ${playerName1}, Color: ${playerColor1} Reveal to ${playerColor2}`);

      // Add the player info to the revealidentity array
      gameState.revealIdentity.push({
        playerName: playerName1,
        playerColor: playerColor1,
        revealToColor: playerColor2
      });
      console.log("Pushed color") //For some reason ending  aturn on the first round trigges this already when it shouldn't. Is it because it technically can't divide by zero? Look into it tomorow.
    }
  }

  console.log(gameState.revealIdentity);
  //TODO: If the randomise option that will be added is enabled set different rules for the next reveal to players.
  //Generate a random option that makes sense, choose like max half of all players, and for the revealidentityperroundinterval choose at most 3 turns
  //RevealRandomIdentities(gameState.revealIdentityAmountOfReveals, gameState.revealIdentityRevealToAmount, gameState.revealIdentityRoundInterval)
}

function revealIdentityCheck() {
  const revealInfoDiv = document.getElementById('revealInfo');
  revealInfoDiv.innerHTML = '';
  // Collect all entries with a matching revealToColor
  const matchingEntries = gameState.revealIdentity.filter(entry => entry.revealToColor === gameState.currentPlayerColor);
  console.log(matchingEntries + " Matching Entries");

  if (matchingEntries.length > 0) {
    // Use a Set to track unique player names and colors
    const uniqueEntries = new Set();
    let revealInfoHTML = '';

    matchingEntries.forEach(entry => {
      const entryKey = `${entry.playerName}:${entry.playerColor}`;
      if (!uniqueEntries.has(entryKey)) {
        uniqueEntries.add(entryKey);
        revealInfoHTML += `${entry.playerName} = ${entry.playerColor}<br>`;
      }
    });
    revealInfoDiv.innerHTML = revealInfoHTML;

    // Remove all matching entries from the array
    gameState.revealIdentity = gameState.revealIdentity.filter(entry => entry.revealToColor !== gameState.currentPlayerColor);
    console.log("Removed all matching colors");
  } else {
    // If no matching entries are found
    console.log("No matching player gets revealed so far.");
  }
}