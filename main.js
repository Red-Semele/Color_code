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
let fadedColors = {}; // Object to track faded colors and their energy points
const votesDiv = document.getElementById('colorVotesTable');
document.getElementById('playerNames').style.display = 'none';
document.getElementById('FadedOptions').style.display = 'none';



function startGame() {
  //TODO: Make sure the names you can vote on are in a random order.
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
  currentPlayerColor = playerColors[currentPlayerIndex];
  console.log("Current player color: " + currentPlayerColor)
  console.log("Previous player color: " + playerColors[currentPlayerIndex-1]);
}


function beginTurn() {
  console.log(messages)
  votesDiv.innerHTML = '';
  displayAssignedColors(playerColors);
  displayVoteCounts();
  checkVotes(currentPlayerColor);
  //displayMessages()
  // Check if the current player is a faded color
  const currentPlayerIsFaded = fadedColors.hasOwnProperty(currentPlayerColor);
   // Display faded options if the current player is faded
  if (currentPlayerIsFaded) {
    document.getElementById('FadedOptions').style.display = 'block';
  } else {
    document.getElementById('FadedOptions').style.display = 'none';
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
}






    function sendMessage() {
      //TODO: Add the ability to send messages to certain colors, now it just sends the message to everyone.
      //I should probably have third thing that gets pushed in the messages, namely the color of the person you send the message to.
      //const playerColor = playerColors[currentPlayerIndex]; //TODO: For some reason playerColor is undefined here. It shows up in my messages undefined anyway.
      console.log(currentPlayerColor)
      const playerColor = currentPlayerColor; 
      const receivingColor = document.getElementById('colorSend').value;
      console.log(playerColor)
      const message = document.getElementById('message').value;
        messages.push({ playerColor, message, receivingColor });
        console.log("Player color after assignment:", playerColor);
        displayMessages();
    }

    function spyColor() {
      const playerColor = playerColors[currentPlayerIndex];
      const spyColor = document.getElementById('spy').value;
      if (playerColor === spyColor) {
          alert("You cannot spy on your own messages!");
          return;
      }
      const spyMessages = messages.filter(msg => msg.playerColor === spyColor);
      alert("Messages for " + spyColor + ": \n" + spyMessages.map(msg => msg.message).join("\n"));
    }
  
  function fakeMessage() {
      const playerColor = document.getElementById('fake-color').value;
      const receivingColor = document.getElementById('colorSendFake').value;
      //if (playerColor === fakeColor) {
          //alert("You cannot fake your own messages!");
         // return;
      //}
      const message = document.getElementById('fake-message').value;
      messages.push({ playerColor, message, receivingColor });
      displayMessages();
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
  const correctVotes = colorVotes.filter(vote => vote.voteColor === currentPlayerColor && vote.voteName === playerNames[currentPlayerIndex]);
  const numCorrectVotes = correctVotes.length;
  const totalVotesForPlayer = countVotes()[currentPlayerColor];
  alert(`You received ${numCorrectVotes} correct votes out of ${totalVotesForPlayer} total votes.`);
  // Check if the player received more than half of the total votes and if the number of correct votes is greater than half
  if (numCorrectVotes > ((numPlayers - 1) / 2)) {
    alert(`You got found out. You are now a faded color.`);
  }
}

function specialMove() {
  const fadedColor = currentPlayerColor;
  const energyPoints = fadedColors[fadedColor];
  
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
  
  if (energyPoints >= reviveThreshold) {
    // Logic to revive the faded color
    // For example, reset their energy points and bring them back into the game
  } else {
    alert("Not enough energy points to revive.");
  }
}

function scrambleMessage(message) {
  // Logic to scramble the message
  // For example, shuffle the characters randomly
  const scrambledMessage = message.split('').sort(() => Math.random() - 0.5).join('');
  return scrambledMessage;
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