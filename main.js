let currentPlayerIndex = 0;
let currentPlayerColor = ''; // Variable to store the current player's color
let playerColors = [];
let playerNames = [];
let playerNamesVoteOption = [];
let colorVotes = [];
let messages = [];
let voter = currentPlayerColor
let votes = [];
let numPlayers = 0;
let currentPlayerIsFaded = [];
let fadedColors = {}; // Object to track faded colors and their energy points
let playerColor = currentPlayerColor;
let playerPoints = {}; // Object to store player points
let currentPlayerName = ""
let turnCount = 0; // Variable to track the current turn count
let roundLimit = 0; // Variable to store the turn limit
let roundCount = 0; // Variable to track the current round
let actionCount = 0;
let fadedColorStolenPoints = 0;
let messagesByRound = [];
let spyMessagesForNextRound = [];
let revivePointCost = {};
let revivePointCostIncreaseMultiplier = 1;
let fadedColorRank = false;
let fadedColorCount = 0;
let actionLimit = 1;
let playerTurnCounts = {}//Object to track how many turns each player has had.
let roundVoted = roundCount;
let fadedColorMessages = [];
let spyMessages = [];
let fadedColorStartEnabled = false;
let fadedColorPassivePoints = 1;
let numMaxTurnTime = 60;
let maxTurnTime = false;
let turnTimer; // Variable to hold the timer
let timeLeft = numMaxTurnTime; // Initial time left for the turn //TODO: Check if this still works and if it now adapts properly based on how much you change numMaxTurntime in the settings.
let timeAttackEnabled = false;
let causeOfGameEnd = document.getElementById('causeOfGameEnd')

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
  roundLimit = parseInt(prompt("Enter the round limit:"));
  document.getElementById('playerNames').style.display = 'inline';
  const nameInputs = document.querySelectorAll('#nameInputs input');
  for (const input of nameInputs) {
    if (input.value.trim() === '') {
      alert('Please enter names for all players.');
      return;
    } 
        playerNames.push(input.value);
      
  
  }
  //TODO: Add a check here to see if timeAttackMode has been activated and if the kind of time decrease and the stating time and the amout that gets subtracted or divided by is set, set whichever one of them is not set.
  // Assign random colors to players
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'magenta', 'cyan', 'black', 'maroon', 'teal'];
  playerColors = [];
  for (let i = 0; i < numPlayers; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      playerColors.push(colors[randomIndex]);
      // Remove the assigned color to avoid duplicate assignment
      colors.splice(randomIndex, 1);
      console.log("test")
  }
  // Initialize player points based on player names
  playerNames.forEach(name => {
    playerPoints[name] = 0; // Start each player with 0 points
    revivePointCost[name] = document.getElementById("revCost").value;
    playerTurnCounts[name] = 0;
  });
  console.log(playerTurnCounts)
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
  playerNamesVoteOption = playerNames.slice();
  console.log("playerNames")
  console.log(playerNames)
  shuffleArray(playerNamesVoteOption);
  console.log(playerNames)
  playerNamesVoteOption.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    voteNameSelect.appendChild(option);
  });
  const uniquePlayerColors = [...new Set(playerColors)];
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

  console.log(playerColors)
  document.getElementById('gameSettings').style.display = 'none';
  // Hide start screen
  document.getElementById('startScreen').style.display = 'none';
  // Show game screen
  document.getElementById('gameScreen').style.display = 'block';
  if (devTestSetting === true) {
    displayAssignedColors(playerColors);
  }
  currentPlayerIndex = 0;
  // Set the current player's color to the first player's color
  currentPlayerColor = playerColors[0];
  document.getElementById('beginTurnBtn').style.display = 'inline'; // Show begin turn button
  if (fadedColorStartEnabled === true) {
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
  for (let i = 0; i < numPlayers; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    playerColors.push(colors[randomIndex]);
    // Remove the assigned color to avoid duplicate assignment
    colors.splice(randomIndex, 1);
  }
  const uniquePlayerColors = [...new Set(playerColors)];
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
  numPlayers = parseInt(document.getElementById('numPlayers').value);
  console.log(numPlayers)
  if (isNaN(numPlayers) || numPlayers < 3 || numPlayers > 12) {
      alert("Please enter a number between 3 and 12 for the number of players.");
      return;
  }

  
  // Show player name input fields
  document.getElementById('playerNames').style.display = 'block';
  document.getElementById('nameInputs').innerHTML = '';
  for (let i = 0; i < numPlayers; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter Player ' + (i + 1) + ' Name';
    document.getElementById('nameInputs').appendChild(input);
  }
  displayColorVotes()
  const fadedColor = playerColors[currentPlayerIndex - 1]; // Assuming currentPlayerIndex was already incremented
  if (fadedColors.hasOwnProperty(fadedColor)) {
    fadedColors[fadedColor]++; // Increment energy points for the faded color
  }
}

function endTurn() {
  actionCount = 0
  if (turnCount % numPlayers === 0) {
    roundCount++; // Increase roundCounter when turnCount is divisible by numPlayers
  } //POT ERROR: this used to be at the start of beginturn
  
  console.log(messages)
  document.getElementById('beginTurnBtn').style.display = 'inline'; // Show begin turn button
  document.getElementById('endTurnBtn').style.display = 'none';
  document.getElementById('playerOptions').style.display = 'none';
  document.getElementById('fadedOptions').style.display = 'none';
  document.getElementById('messageDisplay').style.display = 'none';
  document.getElementById('fadedMessageDisplay').style.display = 'none';
  
  
  currentPlayerIndex++;
  numPlayers = parseInt(document.getElementById('numPlayers').value);
  if (currentPlayerIndex >= numPlayers) {
      currentPlayerIndex = 0; // Reset to the first player if all players have finished their turns
  }
  if (roundCount >= roundLimit) {
    // End the game
    alert("The game has ended.");
    document.getElementById('playerOptions').style.display = 'none';
    document.getElementById('fadedOptions').style.display = 'none';

    endGame() 


    // You can add further logic here to display the final scores or perform any other end-game actions.
  }
  if (maxTurnTime) {
    clearInterval(turnTimer); // Stop the timer
    if (timeAttackEnabled) {
      timeLeft = numMaxTurnTime - (playerTurnCounts[playerNames[currentPlayerIndex]] * 5) //Check if this actually sets timeleft based on the next player's amount of turns.
    } else {
      timeLeft = numMaxTurnTime;
    } // Reset time left TODO: Check if timeattack is set and if it is calculate it based based on what turn it is for the next player, so the player after the currrentplayer.
  }
  currentPlayerColor = playerColors[currentPlayerIndex];
}


function beginTurn() {
  playerTurnCounts[currentPlayerName] += 1;
  console.log(playerTurnCounts)
  turnCount++; // Increase the turn count at the beginning of each turn
  

  console.log(messages)
  votesDiv.innerHTML = '';
  if (maxTurnTime) {
    startTimer();
  }
  if (devTestSetting === true) {
    displayAssignedColors(playerColors);
  }
  
  displayVoteCounts();
  checkVotes(currentPlayerColor);
  //displayMessages()
  // Check if the current player is a faded color
  currentPlayerIsFaded = fadedColors.hasOwnProperty(currentPlayerColor);
   // Display faded options if the current player is faded
  if (currentPlayerIsFaded) {
    document.getElementById('fadedOptions').style.display = 'block'; //TODO: If a new player becomes faded then take all their points and divide them between all the other faded people, except for the new one. This should give an incentive for the other faded colors to help others find out the truth more.But also the player has to balance giving themselves away and giving the other on eaway.
    document.getElementById('sendAs').style.display = 'inline';
    document.getElementById('sendAsDiv').style.display = 'inline';
    document.getElementById('fadedMessageDisplay').style.display = 'inline';
    
  } else {
    document.getElementById('fadedOptions').style.display = 'none';
    document.getElementById('sendAs').style.display = 'none';
    document.getElementById('sendAsDiv').style.display = 'none';
    document.getElementById('fadedMessageDisplay').style.display = 'none';
    console.log(currentPlayerIsFaded)
  }
  // Show game elements and hide begin turn button
  document.getElementById('beginTurnBtn').style.display = 'none';
  document.getElementById('endTurnBtn').style.display = 'inline';
  document.getElementById('playerOptions').style.display = 'inline';
  document.getElementById('messageDisplay').style.display = 'inline';
  updateVoteOptions();
  displayPlayerPoints()
  displayMessages();
  displayColorVotes();
  displayFadedColorChat ();
  updateColorOptions();
  processSpyRequests()
  currentPlayerName = playerNames[currentPlayerIndex];
}






    function sendMessage() {
      if (actionCount === actionLimit) {
        alert('You have already taken an action this turn.');
        return;
      }
      //TODO: Make it impossible to send a message without anything in it.
      //const playerColor = playerColors[currentPlayerIndex]; //TODO: For some reason playerColor is undefined here. It shows up in my messages undefined anyway.
      console.log(currentPlayerColor)
      currentPlayerIsFaded = fadedColors.hasOwnProperty(currentPlayerColor);
 
      
      const sendAs = document.getElementById('sendAs').value;
      
      if (currentPlayerIsFaded) {
        if (sendAs === 'faded') {
          playerColor = "Faded Color"
        } else {
          playerColor = currentPlayerColor; 
        }
      } else {
        playerColor = currentPlayerColor; 
      }

      const receivingColor = document.getElementById('colorSend').value;
      console.log(playerColor)
      const message = document.getElementById('message').value;
      if (message.trim() === '') {
        alert('Please enter text to send a message.');
        return; // Exit the function early
      }
      const roundSent = roundCount
      const faked = false
        messages.push({ playerColor, message, receivingColor, roundSent, faked });
        console.log("Player color after assignment:" + playerColor);
        displayMessages();
        actionButtons();
        document.getElementById('message').value = "";
    }

  function spyColor() {
    if (actionCount === actionLimit) {
      alert('You have already taken an action this turn.');
      return;
    }
    const spiedColor = document.getElementById('spy').value;
    const spyColor = currentPlayerColor
    if ( spiedColor === spyColor) {
      alert('You cannot spy on yourself.')
      return;
    }
      

    // Filter messages where either the sender or the receiver matches the spy color
    console.log("Messages")
    console.log(messages)
    spyMessages = messages.filter(msg => (msg.playerColor === spiedColor || msg.receivingColor === spiedColor) && msg.roundSent === roundCount);
    console.log("spyMessages")
    console.log(spyMessages)
    // Store the spy request for the next round
    spyMessagesForNextRound.push({ spyColor, spiedColor, spyMessages });
    
    console.log(spyMessagesForNextRound)
    // Display the messages
    actionButtons();
  }

  function processSpyRequests() {
    console.log("pushed spy message")
    console.log(spyMessagesForNextRound)
    if (spyMessagesForNextRound.length === 0) return;
    console.log("there are spy requests")
    console.log(spyMessagesForNextRound[0].spyColor)
    console.log(currentPlayerColor)
    if (spyMessagesForNextRound[0].spyColor !== currentPlayerColor) return; //TODO: This should make sure that if the spyColor is not the one who is currently playing they see the requests.
    console.log("The current player is the spy")
    const spyRequest = spyMessagesForNextRound.shift(); // Get the first spy request
    const spiedColor = spyRequest.spiedColor;
    const messagesReceivedBySpy = messages.filter((msg) => msg.receivingColor === spiedColor && msg.roundSent === (roundCount - 1));
    console.log("recieved" + messagesReceivedBySpy)
    
    // Filter messages sent by the spy color
    const messagesSentBySpy = messages.filter((msg) => msg.playerColor === spiedColor && msg.roundSent === (roundCount - 1));
    console.log("sent" + messagesSentBySpy)
    console.log(spyMessages)
    const indexFakeCheck = messages.findIndex(msg => msg.faked === true);
    if (indexFakeCheck !== -1 && messages[indexFakeCheck].roundSent === roundCount - 1) {
      console.log("fake message spotted");
      console.log(fakedMessageSpotted);
      alert('One of these messages is faked.');
    }
    
  
    // Prepare the message for display
    let messageText = `Messages for ${spiedColor}:\n`;
    console.log("recieved spy messages")
    console.log(messagesReceivedBySpy)
    messagesReceivedBySpy.forEach((msg) => {
      messageText += `${msg.playerColor}: ${msg.message}\n`;
    });

    // Add messages sent by the spy color to the display
    messageText += `\nMessages sent by ${spiedColor}:\n`;
    console.log("sent spy messages")
    console.log(messagesSentBySpy)
    messagesSentBySpy.forEach((msg) => {
      messageText += `${msg.playerColor}: ${msg.message}\n`;
    });
  
    // Display the messages
    alert(messageText);
    
  }
    
  
  function fakeMessage() {
    if (actionCount === actionLimit) {
      alert('You have already taken an action this turn.');
      return;
    }
      const playerColor = document.getElementById('fake-color').value;
      const receivingColor = document.getElementById('colorSendFake').value;
      if ( playerColor === receivingColor) {
        alert('You cannot make one color both the sender and reciever.')
        return;
      }
      //if (playerColor === fakeColor) {
          //alert("You cannot fake your own messages!");
         // return;
      //}
      const message = document.getElementById('fake-message').value;
      if (message.trim() === '') {
        alert('Please enter text to send a message.');
        return; // Exit the function early
      }
      const roundSent = roundCount
      const faked = true
      messages.push({ playerColor, message, receivingColor, roundSent, faked });
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
        messageDiv.textContent = `Player ${playerNumber}: ${color} (${playerNames[index]})`;
        if (playerNumber === currentPlayerIndex + 1) {
            messageDiv.textContent += ' (You)';
        }
        messagesDiv.appendChild(messageDiv);
    });
  }

  function displayMessages() {
      storeMessagesForRound();
    
    console.log(messages)
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Clear previous messages before appending new ones
    //messagesDiv.innerHTML = '';
    messages.forEach(msg => {
      console.log(msg.receivingColor + "Reciever")
      console.log(currentPlayerColor)
      if (msg.receivingColor === currentPlayerColor) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${msg.playerColor}: ${msg.message}`; 
        messagesDiv.appendChild(messageDiv);
      }
    });
    displayMessagesByRound(roundCount)
  
}

function colorVote() {
  if (roundCount < 1) {
    alert('Please refrain from voting until round 2 starts.')
    return;
  }
  const voteColorSelect = document.getElementById('vote-color');
  const voteNameSelect = document.getElementById('vote-name');
  const voteColor = document.getElementById('vote-color').value;
  const voteName = document.getElementById('vote-name').value;

  
  
  voter = currentPlayerColor
  console.log("colorVoteCheck")
  console.log(currentPlayerColor)
  console.log(currentPlayerName)
  if (voteColor === currentPlayerColor || voteName === currentPlayerName) {
    //TODO: For some reason this doesn't properly trigger.
    alert('You cannot vote on yourself. You cannot use your own name or color in a vote.')
    return;
  }
  roundVoted = roundCount
  if (voteColor.trim() === '' || voteName.trim() === '') {
    alert('There are no vote options left. Revoke a vote if you want to change it.');
    return; // Exit the function early
  }
  

  // Remove the selected color and name from the dropdown menus
  removeOptionFromSelect(voteColorSelect, voteColor, voter, roundVoted);
  removeOptionFromSelect(voteNameSelect, voteName, voter, roundVoted);
  //TODO: For some reason the code doesn't trigger.
  if (voteColor.trim() === '' || voteName.trim() === '') {
    alert('Please select both a color and a name to vote.'); //TODO: Use this code to make the option dissapear.
    return; // Exit the function early
  }

  colorVotes.push({ voteColor, voteName, voter, roundVoted });
  console.log(colorVotes); // Optionally, you can log the array to verify it's working
  displayColorVotes();
}

function removeOptionFromSelect(selectElement, value, voter) {
  const options = voter === currentPlayerColor ? selectElement.querySelectorAll('option') : selectElement.querySelectorAll(`option[value='${voter}']`);
  //const options = selectElement.querySelectorAll('option');
  options.forEach(option => {
    if (option.value === value) {
      option.remove();
    }
  });
    
}

function displayColorVotes() {

  
  //TODO: The vote cache only gets properly cleared each turn, when the player comes back for some reason all options are put back. (Try to fix that)
  votesDiv.innerHTML = ''; // Clear previous messages before appending new ones
  //messagesDiv.innerHTML = '';
  colorVotes.forEach((clrVt, index) => {
    console.log(currentPlayerColor)
    if (clrVt.voter === currentPlayerColor) {
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
  const revokedVote = colorVotes.splice(index, 1)[0]; // Remove the vote from colorVotes array
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
  playerColors.forEach(color => {
    voteCounts[color] = 0;
  });

  // Count the votes
  colorVotes.forEach(vote => {
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

  playerColors.forEach(color => {
    const voteCount = voteCounts[color];
    const voteCountDiv = document.createElement('div');
    voteCountDiv.textContent = `${color}: ${voteCount}`;
    voteCountsDiv.appendChild(voteCountDiv);
  });
}

function checkVotes() {
  currentPlayerName = playerNames[currentPlayerIndex];

  // Array to store unique votes
  const uniqueColorVotes = [];

  // Iterate through colorVotes array
  colorVotes.forEach(vote => {
    const existingIndex = uniqueColorVotes.findIndex(uniqueVote =>
      uniqueVote.voteColor === vote.voteColor &&
      uniqueVote.voteName === vote.voteName &&
      uniqueVote.roundVoted < vote.roundVoted
    );

    // If no existing vote or current vote has higher roundVoted, add it to uniqueColorVotes
    if (existingIndex === -1) {
      uniqueColorVotes.push(vote);
    } else {
      // Replace existing vote with the current one
      uniqueColorVotes[existingIndex] = vote;
    }
  });
  console.log("Uniquevotes")
  console.log(uniqueColorVotes)
  console.log(colorVotes)

  const correctVotes = uniqueColorVotes.filter(vote => vote.voteColor === currentPlayerColor && vote.voteName === currentPlayerName && vote.roundVoted < roundCount);
  const numCorrectVotes = correctVotes.length;
  // Filter votes where color is correct but name is wrong
  const wrongNameVotes = uniqueColorVotes.filter(vote => vote.voteColor === currentPlayerColor && vote.voteName !== currentPlayerName && vote.roundVoted < roundCount);
  console.log(wrongNameVotes)
  const numWrongNameVotes = wrongNameVotes.length
  console.log("numWrongNameVotes")
  console.log(numWrongNameVotes)

  // Filter votes where name is correct but color is wrong
  const wrongColorVotes = uniqueColorVotes.filter(vote => vote.voteColor !== currentPlayerColor && vote.voteName === currentPlayerName && vote.roundVoted < roundCount);
  const numWrongColorVotes = wrongColorVotes.length
  console.log("numWrongColorVotes")
  console.log(numWrongColorVotes)
  // Combine both types of wrong votes
  const numWrongVotesTotal = (numWrongNameVotes + numWrongColorVotes)
  const totalVotesForPlayer = (numCorrectVotes + numWrongVotesTotal)
  if (playerTurnCounts[currentPlayerName] > 1) {
    alert(`You received ${numCorrectVotes} correct votes out of ${totalVotesForPlayer} total votes. That means you Received ${numWrongVotesTotal} wrong votes.`);
    if (fadedColorStartEnabled) {
      if (currentPlayerIsFaded) {
        awardPoints(currentPlayerName, (10*numWrongVotesTotal)) //TODO: Set how many times the player's points get boosted per wrong answer with the start fadedcolorgamemode.
      } else {
        awardPoints(currentPlayerName, (1*numWrongVotesTotal))
      }
    } else {
      awardPoints(currentPlayerName, (1*numWrongVotesTotal))
    }
    deductPoints(currentPlayerName, (2*numCorrectVotes))
  } else {
    return;
  }
  
  currentPlayerIsFaded = fadedColors.hasOwnProperty(currentPlayerColor);
    //TODO: Check if this triggers or not it should only trigger if the curentplayer is not a fadedcolor.
    console.log("numCorrectVotes")
    console.log(numCorrectVotes)
    console.log("Vote requirement")
    console.log(((numPlayers - (1 + fadedColorCount)) / 2))
    if (numCorrectVotes > ((numPlayers - (1 + fadedColorCount)) / 2)) { 
      //TODO: For some reason the faded color math doesn't seem to work anymore. Check this out
      console.log((numPlayers - (1 + fadedColorCount) / 2)) //TODO: Check if theis part of the gamemath seems to work, I added the fadedcolorcount to what should be subtracted.
      //TODO: Check if this code is still corect or not.
      if (!currentPlayerIsFaded) {
        alert(`You got found out. You are now a faded color.`);
        fadedColorCount += 1
        fadedColors[currentPlayerColor] = true;
        if ((Object.keys(fadedColors).length - 1) !== 0) {
          //The above line is to make sure you don't divide by zero
          fadedColorStolenPoints = playerPoints[currentPlayerName]/ ( Object.keys(fadedColors).length - 1)
          console.log("fadedColorStolenPoints" + fadedColorStolenPoints)
          console.log( Object.keys(fadedColors).length)
          playerColors.forEach(playerColor => {
            if (fadedColors.hasOwnProperty(playerColor)){
              awardPoints(playerColor, fadedColorStolenPoints) //TODO: Find a way to check the name based on the color. And then replace playercolor here by that.
            }
            console.log(fadedColorStolenPoints) //TODO: For some reason there is an error right next to it
            //TODO: Test out this experimental code, check out to see if this works or not. Alos, I want it to not trigger for each playerName but for each playername in fadedcolor
          });
        }
        deductPoints(currentPlayerName, playerPoints[currentPlayerName])
      } else {
      alert(`The majority still thinks it was you.`)
      awardPoints(currentPlayerName, (fadedColorPassivePoints)) //TODO: Make a setting for how much points each faded color gains per turn.
      }
    } else {
      alert(`You are currently not found out.`)
      
    }
    displayPlayerPoints()
  }

function specialMove() {
  const fadedColor = currentPlayerColor;
  const energyPoints = fadedColors[fadedColor]; //TODO: Convert the energypoint to the regular point vaibale to make sure that it properly works.
  
  // Check if enough energy points are available for the special move
  if (energyPoints >= requiredEnergyPoints) {
    deductPoints(currentPlayerName, requiredEnergyPoints)
    // Implement the special move logic here
    // For example, coming back to life or scrambling messages
  } else {
    alert("Not enough energy points for this special move.");
  }
}

function reviveFadedColor() {
  //TODO: Check if the revcostincreases properly function.
  console.log(revivePointCost[currentPlayerName] + " revpointcost")
  const revRules = document.getElementById('reviveRulesApplication').value;
  const revCostIncRule = document.getElementById('revCostIncreaseRule').value;
  revivePointCostIncreaseMultiplier = document.getElementById('revCostIncrease').value;
  if (playerPoints[currentPlayerName] >= revivePointCost[currentPlayerName]) {
    deductPoints(currentPlayerName, revivePointCost[currentPlayerName])
    delete fadedColors[currentPlayerColor];
    console.log(currentPlayerColor + " just revived.")
    document.getElementById('fadedOptions').style.display = 'none';
    document.getElementById('sendAs').style.display = 'none';
    //TODO: Give an in game prompt that is not a pop-up to tell the player that they got revived
    alert("You just revived.");
    if (fadedColorStartEnabled) {
      alert("Game over, a faded color just revived.") //TODO: Make this visually update the endgame part. To properly display the cause of the endgame function being called. (Maybe add a div that is called "cause of endgame")
      causeOfGameEnd.innerHTML = "Cause of ended game: A faded color revived.";
      
      endGame()
    }
    fadedColorCount -= 1
    if (revCostIncRule === "noIncrease") {

    } else {
      if (revRules === "shared") {
        if (revCostIncRule === "multiIncrease") {
          playerNames.forEach(name => {
            revivePointCost[name] *= revivePointCostIncreaseMultiplier;
          });
        console.log("shared cost of revive option just increased.")
        } else if (revCostIncRule === "expoIncrease") {
            playerNames.forEach(name => {
              revivePointCost[name] **= revivePointCostIncreaseMultiplier;
            });
          console.log("shared cost of revive option just increased.")
        }
      } else if (revRules === "separate") {
          if (revCostIncRule === "multiIncrease") {
            revivePointCost[currentPlayerName] *= revivePointCostIncreaseMultiplier;
            console.log("Revive cost for " + currentPlayerName + " just increased.")
          } else if (revCostIncRule === "expoIncrease") {
            revivePointCost[currentPlayerName] **= revivePointCostIncreaseMultiplier;
            console.log("Revive cost for " + currentPlayerName + " just increased.")
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
  messages.sort((a, b) => b.roundSent - a.roundSent);

  // Find the message sent by the selected color during the current turn
  const messageIndex = messages.findIndex(msg => msg.playerColor === selectedColor);
  if (messageIndex !== -1) {
  //const message = messages.find(msg => msg.playerColor === selectedColor);
  const message = messages[messageIndex].message;

  
    // Scramble the message
    //const scrambledMessage = scrambleText(message.message);
    console.log(messages[messageIndex].message)
    const scrambledMessage = scrambleText(message);
    messages[messageIndex].message = scrambledMessage;
    console.log(messages[messageIndex].message)
    console.log(messages)
    //TODO: For some reason it seems to correctly replace the index, but for whatever reason it doesn't appear to work in displaying that message.
    //It's probably because the game is unsure about at what round the message was "resent", aside from playerColor, message and revievingcolor I'll probably also will need to add "roundSent" so the game is sure of at what round a message was sent, that would make it easier for me to use less hacky approaches.

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
  messagesDiv.innerHTML = ''; // Clear previous messages before appending new ones

  // Find all messages sent by the specified color during the current turn
  const colorMessages = messages.filter(msg => msg.playerColor === color);

  // Display each message sent by the color
  colorMessages.forEach(msg => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${msg.playerColor}: ${msg.message}`;
    messagesDiv.appendChild(messageDiv);
  });
}

function updateColorOptions() {
  const colorSelect = document.getElementById('scramble-color');
  colorSelect.innerHTML = ''; // Clear previous options

  // Get the colors that sent messages during the current turn
  //const colorsWithMessages = [...new Set(messages.map(msg => msg.playerColor))];
  const colorsWithMessages = [...new Set(messages.filter(msg => msg.roundSent === roundCount).map(msg => msg.playerColor))];
  console.log("colorsWithMessages:")
  console.log(colorsWithMessages)


  // Populate the color select dropdown with the colors that sent messages
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
  //if (playerTurnCounts[currentPlayerName] === 0) {
  //TODO: The code to re-add specific buttons that haven't been voted on yet or have been revoked needs to be re-implemented. (Maybe save them in an object?)
    

  // Get the colors and names previously voted on by the current player
  const colorsVotedByPlayer = colorVotes.filter(vote => vote.voter === currentPlayerColor).map(vote => vote.voteColor);
  const namesVotedByPlayer = colorVotes.filter(vote => vote.voter === currentPlayerColor).map(vote => vote.voteName);
  // Repopulate the options for the new current player
  // Repopulate the options for the new current player
  playerColors.forEach(color => {
    if (!colorsVotedByPlayer.includes(color)) {
      const optionColor = document.createElement('option');
      optionColor.value = color;
      optionColor.textContent = color.charAt(0).toUpperCase() + color.slice(1);
      voteColorSelect.appendChild(optionColor);
    }
  });

  playerNamesVoteOption.forEach(name => {
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
  playerPoints[playerName] += points;
}

function deductPoints(playerName, points) {
  playerPoints[playerName] -= points;
}

function displayPlayerPoints() {
  //TODO: This now displays the names and the point, but it also shows the currentplayercolor with: "NaN" next to it. try to fix that.
  const pointsDiv = document.getElementById('playerPoints');

  // Clear previous points display
  pointsDiv.innerHTML = '';
  // Get the current player's name
  currentPlayerName = playerNames[currentPlayerIndex];

  // Iterate over each player and display their points
  console.log(playerPoints)
  Object.entries(playerPoints).forEach(([name, points]) => {
    if (!isNaN(points)) {
      if (name === currentPlayerName) {
        const playerPointsDiv = document.createElement('div');
        playerPointsDiv.textContent = `Your name: ${name}\nYour color: ${currentPlayerColor}\nYour points: ${points}`;
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
  const playerPointsArray = playerNames.map(name => ({ name, points: playerPoints[name], color: playerColors[playerNames.indexOf(name)] }));

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
    if (fadedColors.hasOwnProperty(color) && points === prevPoints && fadedColorRank === false ) {
      console.log("fadedcolor has same amount of points.")
      playerRank++; 
      if (fadedColors.hasOwnProperty(color)) {
        console.log("fadedcolor detected.")
        if (fadedColorRank === false) { 
          const fadedText = document.createElement('div');
          fadedText.textContent = 'Faded colors:';
          endGameDiv.appendChild(fadedText);
          fadedColorRank = true
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
  if (actionCount === actionLimit) {
    console.log(actionCount)
    alert('You have already taken all your actions.');
    return;
  }
  actionCount += 1
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
  actionCount -= 1
  actionButtons()

}

function displayMessagesByRound(round) {
  const messagesDiv = document.getElementById('messages');
  //TODO: Now use the other variable, roundSent that is pushed in the message to be able to properly check when somethign was sent, first filter out of those and then do the additional filtering.
  messagesDiv.innerHTML = ''; // Clear previous messages

  // Display messages for the specified round. Make it use the roundSent instead.
  if (round > 0 && round <= messagesByRound.length) {
    //messagesByRound[round - 1].forEach(msg => {
       // Filter messages for the specified round
  const messagesForRound = messages.filter(msg => msg.roundSent < round);

  // Display filtered messages
  messagesForRound.forEach(msg => {
      console.log(msg.receivingColor + "Receiver");
      console.log(currentPlayerColor);
      if (msg.receivingColor === currentPlayerColor) {
        const messageDiv = document.createElement('div');
        messageDiv.style.color = msg.playerColor; // Set color of the sender
        messageDiv.textContent = `${msg.playerColor}: ${msg.message}`;
        messagesDiv.appendChild(messageDiv);
      }
    });
  } else {
    console.log("Invalid round number.");
  }
}

function storeMessagesForRound() {
  messagesByRound.push([...messages]); // Clone the messages array for the current round
  if (eraseMessages === true) {
    messages.length = 0; // Clear the messages array for the next round TODO: Make a setting for either enabling or diabling this. Enabling would make it harder to remember text and disabling would make it eassier.
  }
}

function saveSettings() {
  eraseMessages = document.getElementById('eraseMessages').checked;
  devTestSetting = document.getElementById('devTestSetting').checked;
  fadedColorStartEnabled = document.getElementById('fadedColorStart').checked; //TODO: Make this also activate the gamemode, give extra points if they get a guess wrong.
  numStartFadedColors = document.getElementById('numStartFadedColors').value;
  fadedColorPassivePoints = document.getElementById('fadedColorPassivePoints').value;
  maxTurnTime = document.getElementById('maxTurnTime').checked;
  numMaxTurnTime = document.getElementById('numMaxTurnTime').value;
  timeLeft = numMaxTurnTime;
  timeAttackEnabled = document.getElementById('timeAttackMode').checked;
  
  
  // You can perform further actions here, like saving to localStorage or sending to server
  // For now, let's just log the settings
  console.log("eraseMessages:", eraseMessages);
}

function fadedColorChat () {
  console.log(playerColor)
  const fadedColorMessage = document.getElementById('fadedColorMessage').value;
  if (fadedColorMessage.trim() === '') {
    alert('Please enter text to send a message.');
    return; // Exit the function early
  }
  const roundSent = roundCount
  fadedColorMessages.push({ playerColor, fadedColorMessage, roundSent });
    console.log("Fadedcolormessages:" + fadedColorMessages);
    displayFadedColorChat();
    actionButtons();
    document.getElementById('fadedColorMessage').value = "";
}

function displayFadedColorChat () {
  currentPlayerIsFaded = fadedColors.hasOwnProperty(currentPlayerColor);
  if (currentPlayerIsFaded) {
    //TODO: Filter based on roundsent. Only show the messages from exactly roundsent = roundcount - 1 or roundsent < roundcount based on wheter or not the game was set to remove messages or not.
    const fadedMessages = document.getElementById('fadedMessages'); //TODO: Change the name of this container and make it a real thing.
    fadedMessages.innerHTML = ""; // Clear previous messages
    fadedColorMessages.forEach(message => {
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
  const players = Object.keys(playerPoints);
  const shuffledPlayers = players.sort(() => Math.random() - 0.5); // Shuffle player order

  // Assign faded colors to the first numFadedColors players after shuffling
  const fadedColorsAssigned = shuffledPlayers.slice(0, numFadedColors);
  fadedColorStolenPoints = playerPoints[currentPlayerName]/ ( Object.keys(fadedColors).length - 1)

  fadedColorsAssigned.forEach(playerName => {
    const playerColor = playerColors[playerNames.indexOf(playerName)];
    fadedColors[playerColor] = true;
    fadedColorCount++;
    Object.keys(fadedColors).forEach(color => {
      if (color !== playerColor) {
        awardPoints(color, fadedColorStolenPoints);
      }
    });

    deductPoints(playerName, playerPoints[playerName]); // Remove all points from the faded player
  });

  return fadedColorsAssigned;
}

function startTimer() {
  turnTimer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(turnTimer);
      timeLeft = numMaxTurnTime;
      endTurn(); // Trigger end of turn when time runs out
      alert("Time's up! Turn ended.");
      console.log('timer just ran out.')
    } else {
      console.log("timer is working" + timeLeft + " time left.")
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