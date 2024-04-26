let currentPlayerIndex = 0;
let currentPlayerColor = ''; // Variable to store the current player's color
let playerColors = [];
let playerNames = [];
let playerNamesVoteOption = [];
let colorVotes = [];
const messages = [];
let voter = currentPlayerColor
let votes = [];
let numPlayers = 0
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


const votesDiv = document.getElementById('colorVotesTable');
document.getElementById('playerNames').style.display = 'none';
document.getElementById('fadedOptions').style.display = 'none';
document.getElementById('sendAs').style.display = 'none';
document.getElementById('sendMessageAction').style.display = 'none';
document.getElementById('spyAction').style.display = 'none';
document.getElementById('fakeAction').style.display = 'none';





function startGame() {
  //TODO: Make sure the names you can vote on are in a random order.
  roundLimit = parseInt(prompt("Enter the round limit:"));
  document.getElementById('playerNames').style.display = 'inline';
  const nameInputs = document.querySelectorAll('#nameInputs input');
  console.log("nameInputs:")
  console.log(nameInputs)
  for (const input of nameInputs) {
    if (input.value.trim() === '') {
      alert('Please enter names for all players.');
      return;
    } 
        playerNames.push(input.value);
      
  
  }
  
  // Assign random colors to players
  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
  playerColors = [];
  console.log(playerColors)
  console.log("playernames:")
  console.log(playerNames)
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
  });
  
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
  displayAssignedColors(playerColors);
  currentPlayerIndex = 0;
  // Set the current player's color to the first player's color
  currentPlayerColor = playerColors[0];
  console.log(playerColors)
  console.log(currentPlayerColor)
  document.getElementById('beginTurnBtn').style.display = 'inline'; // Show begin turn button
  

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
  if (isNaN(numPlayers) || numPlayers < 3 || numPlayers > 10) {
      alert("Please enter a number between 3 and 10 for the number of players.");
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
  console.log("fadedColor")
  console.log(fadedColor)
  console.log(fadedColors)
  if (fadedColors.hasOwnProperty(fadedColor)) {
    fadedColors[fadedColor]++; // Increment energy points for the faded color
  }
}

function endTurn() {
  actionCount = 0
  console.log(messages)
  //document.getElementById('messages').innerHTML = 'none';
  document.getElementById('beginTurnBtn').style.display = 'inline'; // Show begin turn button
  document.getElementById('endTurnBtn').style.display = 'none';
  document.getElementById('playerOptions').style.display = 'none';
  
  console.log(currentPlayerIndex)
  currentPlayerIndex++;
  console.log("Player " + currentPlayerIndex)
  const numPlayers = parseInt(document.getElementById('numPlayers').value);
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
  currentPlayerColor = playerColors[currentPlayerIndex];
  console.log("Current player color: " + currentPlayerColor)
  console.log("Previous player color: " + playerColors[currentPlayerIndex-1]);
}


function beginTurn() {
  turnCount++; // Increase the turn count at the beginning of each turn
  if (turnCount % numPlayers === 0) {
    roundCount++; // Increase roundCounter when turnCount is divisible by numPlayers
  }

  console.log(messages)
  votesDiv.innerHTML = '';
  displayAssignedColors(playerColors);
  displayVoteCounts();
  checkVotes(currentPlayerColor);
  //displayMessages()
  // Check if the current player is a faded color
  currentPlayerIsFaded = fadedColors.hasOwnProperty(currentPlayerColor);
   // Display faded options if the current player is faded
  if (currentPlayerIsFaded) {
    document.getElementById('fadedOptions').style.display = 'block'; //TODO: If a new player becomes faded then take all their points and divide them between all the other faded people, except for the new one. This should give an incentive for the other faded colors to help others find out the truth more.But also the player has to balance giving themselves away and giving the other on eaway.
    document.getElementById('sendAs').style.display = 'inline';
    console.log("The player is correctly seen as a faded color. TEST. ")
  } else {
    document.getElementById('fadedOptions').style.display = 'none';
    document.getElementById('sendAs').style.display = 'none';
    console.log("The player is not seen as a faded color. TEST. ") //TODO: The player is wrongfully seen as not faded when they are faded.
    console.log(currentPlayerIsFaded)
  }
  // Show game elements and hide begin turn button
  document.getElementById('beginTurnBtn').style.display = 'none';
  //document.getElementById('messages').innerHTML = ''; // Clear previous messages
  //document.getElementById('gameScreen').style.display = 'block';
  document.getElementById('endTurnBtn').style.display = 'inline';
  document.getElementById('playerOptions').style.display = 'inline';
  updateVoteOptions();
  displayMessages()
  displayColorVotes()
  updateColorOptions()
  currentPlayerName = playerNames[currentPlayerIndex];
}






    function sendMessage() {
      if (actionCount === 1) {
        alert('You have already taken an action this turn.');
        return;
      }
      //TODO: Make it impossible to send a message without anything in it.
      //I should probably have third thing that gets pushed in the messages, namely the color of the person you send the message to.
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
        messages.push({ playerColor, message, receivingColor });
        console.log("Player color after assignment:", playerColor);
        displayMessages();
        actionButtons();
    }

    function spyColor() {
      if (actionCount === 1) {
        alert('You have already taken an action this turn.');
        return;
      }
      const spyColor = document.getElementById('spy').value;

      // Filter messages where either the sender or the receiver matches the spy color
      const spyMessages = messages.filter(msg => msg.playerColor === spyColor || msg.receivingColor === spyColor);

    // Prepare the message for display
    let messageText = `Messages for ${spyColor}:\n`;
    spyMessages.forEach(msg => {
      messageText += `${msg.playerColor}: ${msg.message}\n`;
    });

    // Display the messages
    alert(messageText);
    actionButtons();
    }
    
  
  function fakeMessage() {
    if (actionCount === 1) {
      alert('You have already taken an action this turn.');
      return;
    }
      const playerColor = document.getElementById('fake-color').value;
      const receivingColor = document.getElementById('colorSendFake').value;
      //if (playerColor === fakeColor) {
          //alert("You cannot fake your own messages!");
         // return;
      //}
      const message = document.getElementById('fake-message').value;
      messages.push({ playerColor, message, receivingColor });
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
      console.log(msg.receivingColor + "Receciever")
      console.log(currentPlayerColor)
      if (msg.receivingColor === currentPlayerColor) {
        //TODO: You need to make each message only append if the color of the eciever equals the current playercolor.
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${msg.playerColor}: ${msg.message}`; 
        messagesDiv.appendChild(messageDiv);
      }
    });
    displayMessagesByRound(roundCount)
  
}

function colorVote() {
  const voteColorSelect = document.getElementById('vote-color');
  const voteNameSelect = document.getElementById('vote-name');
  const voteColor = document.getElementById('vote-color').value;
  const voteName = document.getElementById('vote-name').value;
  voter = currentPlayerColor
  if (voteColor.trim() === '' || voteName.trim() === '') {
    alert('There are no vote options left. Revoke a vote if you want to change it.');
    return; // Exit the function early
  }
  

  // Remove the selected color and name from the dropdown menus
  removeOptionFromSelect(voteColorSelect, voteColor, voter);
  removeOptionFromSelect(voteNameSelect, voteName, voter);
  //TODO: For some reason the code doesn't trigger.
  if (voteColor.trim() === '' || voteName.trim() === '') {
    alert('Please select both a color and a name to vote.'); //TODO: Use this code to make the option dissapear.
    return; // Exit the function early
  }

  colorVotes.push({ voteColor, voteName, voter });
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

  
  
  votesDiv.innerHTML = ''; // Clear previous messages before appending new ones
  //messagesDiv.innerHTML = '';
  colorVotes.forEach((clrVt, index) => {
    console.log(currentPlayerColor)
    if (clrVt.voter === currentPlayerColor) {
      //TODO: You need to make each message only append if the color of the eciever equals the current playercolor.
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
  //colorOption.textContent = revokedVote.voteColor;
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
  const correctVotes = colorVotes.filter(vote => vote.voteColor === currentPlayerColor && vote.voteName === currentPlayerName);
  const numCorrectVotes = correctVotes.length;
  // Filter votes where color is correct but name is wrong
  const wrongNameVotes = colorVotes.filter(vote => vote.voteColor === currentPlayerColor && vote.voteName !== currentPlayerName);
  console.log(wrongNameVotes)
  const numWrongNameVotes = wrongNameVotes.length
  console.log("numWrongNameVotes")
  console.log(numWrongNameVotes)

  // Filter votes where name is correct but color is wrong
  const wrongColorVotes = colorVotes.filter(vote => vote.voteColor !== currentPlayerColor && vote.voteName === currentPlayerName);
  const numWrongColorVotes = wrongColorVotes.length
  console.log("numWrongColorVotes")
  console.log(numWrongColorVotes)
  // Combine both types of wrong votes
  const numWrongVotesTotal = (numWrongNameVotes + numWrongColorVotes)
  const totalVotesForPlayer = (numCorrectVotes + numWrongVotesTotal)
  alert(`You received ${numCorrectVotes} correct votes out of ${totalVotesForPlayer} total votes. That means you recieved ${numWrongVotesTotal} wrong votes.`);
  awardPoints(currentPlayerName, (1*numWrongVotesTotal))
  deductPoints(currentPlayerName, (2*numCorrectVotes))
  
  //TODO: Give the player extra points for every wrong answer they recieved and detract a few for every correct vote they recieved.
  // Check if the player received more than half of the total votes and if the number of correct votes is greater than half
  currentPlayerIsFaded = fadedColors.hasOwnProperty(currentPlayerColor);
  if (!currentPlayerIsFaded) {
    //TODO: Check if this triggers or not it should only trigger if the curentplayer is not a fadedcolor.
    if (numCorrectVotes > ((numPlayers - 1) / 2)) {
      alert(`You got found out. You are now a faded color.`);
      fadedColors[currentPlayerColor] = true;
      if ((Object.keys(fadedColors).length - 1) !== 0) {
        //The above line is to make sure you don't divide by zero
        fadedColorStolenPoints = playerPoints[currentPlayerName]/ ( Object.keys(fadedColors).length - 1)
        console.log("fadedColorStolenPoints" + fadedColorStolenPoints)
        console.log( Object.keys(fadedColors).length)
        playerColors.forEach(playerColor => {
          if (fadedColors.hasOwnProperty(playerColor)){
          awardPoints(playerColor, fadedColorStolenPoints) //TODO: Find a way to check the name based on the color. And htne replace playercolor here by that.
          }
          console.log(fadedColorStolenPoints) //TODO: For some reason there is an error right next to it
          //TODO: Test out this experimental code, check out to see if this works or not. Alos, I want it to not trigger for each playerName but for each playername in fadedcolor
        });
      }
      
      deductPoints(currentPlayerName, playerPoints[currentPlayerName])
      //TODO: Give the points you deducted to all fadedColors that already exist. So divide the amount of points you just detracted by the amount of fadedcolors, asign that number to each faded color.
      
    }
  } else {
    alert(`the majority still thinks it was you.`)
  }
  displayPlayerPoints()
}

function specialMove() {
  const fadedColor = currentPlayerColor;
  const energyPoints = fadedColors[fadedColor]; //TODO: Convert the energypoint to the regular point vaibale to make sure that it properly works.
  
  // Check if enough energy points are available for the special move
  if (energyPoints >= requiredEnergyPoints) {
    fadedColors[fadedColor] -= requiredEnergyPoints;
    // Implement the special move logic here
    // For example, coming back to life or scrambling messages
  } else {
    alert("Not enough energy points for this special move.");
  }
}

function reviveFadedColor() {
  const fadedColor = currentPlayerColor;
  const energyPoints = fadedColors[fadedColor];
  console.log(energyPoints)
  
  if (energyPoints >= reviveThreshold) {
    // Logic to revive the faded color
    // For example, reset their energy points and bring them back into the game
  } else {
    alert("Not enough energy points to revive.");
  }
}

function scrambleMessage() {
  // Get the color whose message to scramble
  const colorSelect = document.getElementById('scramble-color');
  const selectedColor = colorSelect.value;

  // Find the message sent by the selected color during the current turn
  const message = messages.find(msg => msg.playerColor === selectedColor);

  if (message) {
    // Scramble the message
    const scrambledMessage = scrambleText(message.message);

    // Display the scrambled message
    alert(`Scrambled Message from ${selectedColor}: ${scrambledMessage}`);
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
  const colorsWithMessages = [...new Set(messages.map(msg => msg.playerColor))];

  // Populate the color select dropdown with the colors that sent messages
  colorsWithMessages.forEach(color => {
    const option = document.createElement('option');
    option.value = color;
    option.textContent = color.charAt(0).toUpperCase() + color.slice(1); // Capitalize first letter
    colorSelect.appendChild(option);
  });
}

function updateVoteOptions() {
  const voteColorSelect = document.getElementById('vote-color');
  const voteNameSelect = document.getElementById('vote-name');
  
  // Clear the current options
  voteColorSelect.innerHTML = '';
  voteNameSelect.innerHTML = '';

  // Repopulate the options for the new current player
  playerColors.forEach((color, index) => {
    
    const optionColor = document.createElement('option');
    optionColor.value = color;
    //optionColor.textContent = color;
    optionColor.textContent = color.charAt(0).toUpperCase() + color.slice(1);
    voteColorSelect.appendChild(optionColor);

    const optionName = document.createElement('option');
    optionName.value = playerNamesVoteOption[index]; 
    optionName.textContent = playerNamesVoteOption[index];
    voteNameSelect.appendChild(optionName);
  });
}
function awardPoints(playerName, points) {
  console.log("Attempted to give points to:")
  console.log(playerName)
  //TODO: I doubt that this works entirely right, so so try to fix it a bit.
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
        playerPointsDiv.textContent = `${name}: ${points}`;
        pointsDiv.appendChild(playerPointsDiv);
      }
    }
  });
}

function endGame() {
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

    if (fadedColors.hasOwnProperty(color) && points === prevPoints) {
      rank--; // Decrement the rank for faded colors with the same points
      if (fadedColors.hasOwnProperty(color)) {
        if (rank === 1) { // Add "Faded colors:" text before the first faded player
          const fadedText = document.createElement('div');
          fadedText.textContent = 'Faded colors:';
          endGameDiv.appendChild(fadedText);
        }
        rank++; // Increment the rank for other faded players
        prevPoints = points; // Update previous points for faded players
      }
    }

    // Adjust rank based on points change
    if (points !== prevPoints) {
      rank = index + 1; // Update rank if points change
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
  if (actionCount === 1) {
    console.log(actionCount)
    alert('You have already taken an action this turn.'); //TODO: Actually make this clear the gamescreen there is a bug right now where the system basically tells you this but still lets you take other actions, this could be fixed by just making those options dissapear. A bit unintuitive maybe but good enough for now.
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
  messagesDiv.innerHTML = ''; // Clear previous messages

  // Display messages for the specified round
  if (round > 0 && round <= messagesByRound.length) {
    messagesByRound[round - 1].forEach(msg => {
      console.log(msg.receivingColor + "Receiver");
      console.log(currentPlayerColor);
      if (msg.receivingColor === currentPlayerColor) {
        const messageDiv = document.createElement('div');
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
  
  
  // You can perform further actions here, like saving to localStorage or sending to server
  // For now, let's just log the settings
  console.log("eraseMessages:", eraseMessages);
}
