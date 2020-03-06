// this function will get fired once the DOM is loaded
// disa le the stop button since it is noot needed until game start

window.onload = function () { watch() };
function watch() {
    var btn = document.getElementById('btnStop');
    btnDisabled(btn); // disable the stop button since the game has not started
}

// this funtion will roll for random number twice, one for
// each player and determine which player won the roll
function rollForTurn() {
    var xArray = [];
    var ranNum = '';
    var minimum = 1;
    var maximum = 11;
    var first = "";
    var txt1 = "";
    for (var i = 0; i < 2; i++) {
        // random whole number between 1 and 10
        ranNum = Math.floor(Math.random() * (maximum - minimum) + minimum);
        xArray.push(ranNum);
    }
    diceRoll(); // play dice sounds during the game roll for turn
    // build the string to show which player rolled what die roll
    for (i = 0; i < xArray.length; i++) {
        var result = i + 1;
        var pOne = xArray[0];
        var pTwo = xArray[1];
        if (pOne == pTwo) { // rigging roll on tie to avoid bug in code. need to address this later...
            pOne = 1;
            pTwo = 2;
        }
        txt1 = "Player one rolled (" + pOne + ")<br>";
        writeMsg(txt1);
        txt1 = txt1 + "Player 2 rolled (" + pTwo + ")<br><br>";
        setTimeout(function () { writeMsg(txt1); }, 1000); // time delay for dramatic effect
    }
    // determine and concatenate string showing which player won the roll
    if (pOne > pTwo) {
        first = "Player 1";
        setTimeout(function () { txt1 = txt1 + "Player one wins, please choose a square."; }, 2000);
        setTimeout(function () { writeMsg(txt1); }, 2000);
    } else if (pOne < pTwo) {
        first = "Player 2";
        setTimeout(function () { txt1 = txt1 + "Player 2 wins, please choose a square."; }, 2000);
        setTimeout(function () { writeMsg(txt1); }, 2000);
    }
    // pass which player won the roll
    return first;
}

//------------------------------------------------------------------
// initiate the game, roll for turn and determine the active player
//------------------------------------------------------------------

function startGame() {
    var xTurn = 0;
    activePlayer = rollForTurn();
    if (activePlayer == "") { // if it was a tie, then reroll
        activePlayer = rollForTurn();
    }
    setTimeout(function () { hideGameMsg(); }, 4000);

    // assign proper state of the control buttons
    var btn = document.getElementById('btnStart');
    btnDisabled(btn); // disable the staart button since the game is not afoot
    var btn = document.getElementById('btnStop');
    stopEnabled(btn); // enabe the stop button since the game is now afoot

    // Assign theActive Player to the console
    var showPlayer = document.getElementById('showPlayer');
    showPlayer.innerHTML = activePlayer;
    showPlayer.style.color = "green";
}

// this function styles the game buttons while they are disabled
function btnDisabled(btn) {
    btn.style.color = "#fff";
    btn.style.border = "2px solid rgb(153,153,102)";
    btn.style.backgroundColor = "rgb(214,214,194)";
    btn.disabled = true;
}

// this function styles the game buttons while they are disabled
function stopEnable(btn) {
    btn.style.color = "#fff";
    btn.style.border = "2px solid rgb(204,0,0)";
    btn.style.backgroundColor = "rgb(255,51,51)";
    btn.disabled = false;
}

// this function styles the game buttons while they are disabled
function startEnabled(btn) {
    btn.style.color = "#fff";
    btn.style.border = "2px solid rgb(0, 153, 0)";
    btn.style.backgroundColor = "rgb(57, 230, 0)";
    btn.disabled = false;
}

// when the user indicates, stop the current game and reset game
function stopGame() {
    hideGameMsg(); // clear the text and hide message box
    var btn = document.getElementsById('btnStart');
    startEnabled(btn); //enable the start button since the game is now stopped
    var btn = document.getElementById('btnStop');
    btnDisabled(btn); // diable the stop button since the game is now stopped
    var showPlayer = document.getElementById('showPlayer');
    showPlayer.innerHTML = "Game Stopped";
    showPlayer.style.color = 'red';

    // reset all squares to their starting empty state
    var arrayO = document.getElementsByClassName("O");
    var arrayX = document.getElementsByClassName("X");
    for (var i = 0; i < arrayO.length; i++) {
        arrayO[i].style.transform = "translateY(-100%)";
    }
    for (var i = 0; i < arrayX.length; i++) {
        arrayX[i].style.transform = "translateY(100%)";
    }
    // this clears the running log of all game moves
    document.getElementById('boardState').innerHTML = "";
}

// this function will show the message console and any text it may have
function showGameMsg() {
    document.getElementById('gameMsgBox').style.display = 'block';
}

// this function will conceal the message console from view
function hideGameMsg() {
    clearMsg(); // clear the text from the message console
    document.getElementById('gameMsgBox').style.display = 'none'; //hide the div
}

// this function will write text to the game message console
function writeMsg(txt) {
    showGameMsg();
    document.getElementById('gameMsg').innerHTML = txt;
}

// this function will clear the text from the message console
function clearMsg() {
    document.getElementById('gameMsg').innerHTML = "";
}

// this function is for the player config panel and checks the
// proposed avatar assignments and prevents them from being the same
function saveSettings() {
    var p1Index = document.getElementById('player1').selectedIndex;
    var p1Selected = document.getElementById('player1').options;
    var p2Index = document.getElementById('player2').selectedIndex;
    var p2Selected = document.getElementById('player2').options;
    if (p1Selected[p1Index].text == p2Selected[p2Index].text) {
        alert("Error - Player 1 and 2 cannot both be assigned as: " + p1Selected[p1Index].text)
    } else {
        document.getElementById('p1Display').innerHTML = p1Selected[p1Index].text;
        document.getElementById('p2Display').innerHTML = p2Selected[p2Index].text;
    }
}

// this function returns the currently assigned avatar for each player
function getAvatars() {
    var p1Avatar = document.getElementById('p1Display').innerHTML;
    var p2Avatar = document.getElementById('p2Display').innerHTML;
    var avatarArray = [p1Avatar, p2Avatar];
    return avatarArray;
}

// this function will return the active players avatar
function determineAvatar() {
    //determine the correcct avatar to paint for the active player
    var avatarArray = getAvatars(); // returns an array of both player's assigned avatars
    var active = document.getElementById('showPlayer').innerHTML; // get active player
    p1Avatar = avatarArray[0];
    p2Avatar = avatarArray[1];
    if (active == "Player 1") {// check which player is actie and their corresponding avatar
        var paintAvatar = p1Avatar;
    } else if (active == "Player 2") {
        var paintAvatar = p2Avatar;
    }
    return paintAvatar; // returned back the correct avatar
}

// this function will get the array of the current board
// and check the proposed move for a validity
function check(info, square) {
    for (var i in info) {
        var tempInfo = info[1].charAt(0); // comparing index of square
        if (tempInfo == square) {
            return tempInfo;
        }
    }
}

// as squares are selected they check in with this function to see if that particular
// square has already been assigned and if it has not, record new square with the assigned avatar.
function recordMoves(square) {
    var proposedMove = square;
    var boardState = document.getElementsById('boardState').innerHTML; // retrieve board state array
    var info = boardState.split(','); // separate the string by commas to create an array
    verdict = check(info, square); // call functoin to check if proposed square is already occupied
    return verdict;
}

//-----------------------------------------------------------------------------------------
// These block of functions are for each clikc event of their corresponding square element
//-----------------------------------------------------------------------------------------
function square1Animate() {
    var activePlayer = document.getElementById('showPlayer').innerHTML;
    if (activePlayer != "Game Stopped") { // if game has not yet started prevent avatar placement
        var square = "0"; // identify the square selected
        //check if the proposed square is valid
        var verdict = recordMoves(square);
        if (vardict == undefined) { //if verdict is empty then the square is unoccupied.
            var paintAvatar = determineAvatar(); // get the correct avatar to paint for the active player
            var selected = document.getElementsByClassName(paintAvatar)[0]; //paint avatar
            if (paintAvatar == "O") { // change these all to ternary statements instead
                animateO(selected); //call function to animate O
            } else if (paintAvatar == "X") {
                animateX(selected); //call functoin to animate X
            }
            // build new array adding the newly selected square and the assigned avatar
            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon(); // call function to check if current move completes a winning condition
            avatarPlaced(square, paintAvatar); // end current turn and ppass the turn to the other player
            squareSound(); // play a game sound when the avatar is placed
        }
    }
}

function square2Animate() {
    var activePlayer = document.getElementById('showPlayer').innerHTML;
    if (activePlayer != "Game Stopped") { // if game has not yet started prevent avatar placement
        var square = "1"; // identify the square selected
        //check if the proposed square is valid
        var verdict = recordMoves(square);
        if (vardict == undefined) { //if verdict is empty then the square is unoccupied.
            var paintAvatar = determineAvatar(); // get the correct avatar to paint for the active player
            var selected = document.getElementsByClassName(paintAvatar)[1]; //paint avatar
            if (paintAvatar == "O") { // change these all to ternary statements instead
                animateO(selected); //call function to animate O
            } else if (paintAvatar == "X") {
                animateX(selected); //call functoin to animate X
            }
            // build new array adding the newly selected square and the assigned avatar
            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon(); // call function to check if current move completes a winning condition
            avatarPlaced(square, paintAvatar); // end current turn and ppass the turn to the other player
            squareSound(); // play a game sound when the avatar is placed
        }
    }
}

function square3Animate() {
    var activePlayer = document.getElementById('showPlayer').innerHTML;
    if (activePlayer != "Game Stopped") { // if game has not yet started prevent avatar placement
        var square = "2"; // identify the square selected
        //check if the proposed square is valid
        var verdict = recordMoves(square);
        if (vardict == undefined) { //if verdict is empty then the square is unoccupied.
            var paintAvatar = determineAvatar(); // get the correct avatar to paint for the active player
            var selected = document.getElementsByClassName(paintAvatar)[2]; //paint avatar
            if (paintAvatar == "O") { // change these all to ternary statements instead
                animateO(selected); //call function to animate O
            } else if (paintAvatar == "X") {
                animateX(selected); //call functoin to animate X
            }
            // build new array adding the newly selected square and the assigned avatar
            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon(); // call function to check if current move completes a winning condition
            avatarPlaced(square, paintAvatar); // end current turn and ppass the turn to the other player
            squareSound(); // play a game sound when the avatar is placed
        }
    }
}

function square4Animate() {
    var activePlayer = document.getElementById('showPlayer').innerHTML;
    if (activePlayer != "Game Stopped") { // if game has not yet started prevent avatar placement
        var square = "3"; // identify the square selected
        //check if the proposed square is valid
        var verdict = recordMoves(square);
        if (vardict == undefined) { //if verdict is empty then the square is unoccupied.
            var paintAvatar = determineAvatar(); // get the correct avatar to paint for the active player
            var selected = document.getElementsByClassName(paintAvatar)[3]; //paint avatar
            if (paintAvatar == "O") { // change these all to ternary statements instead
                animateO(selected); //call function to animate O
            } else if (paintAvatar == "X") {
                animateX(selected); //call functoin to animate X
            }
            // build new array adding the newly selected square and the assigned avatar
            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon(); // call function to check if current move completes a winning condition
            avatarPlaced(square, paintAvatar); // end current turn and ppass the turn to the other player
            squareSound(); // play a game sound when the avatar is placed
        }
    }
}

function square5Animate() {
    var activePlayer = document.getElementById('showPlayer').innerHTML;
    if (activePlayer != "Game Stopped") { // if game has not yet started prevent avatar placement
        var square = "4"; // identify the square selected
        //check if the proposed square is valid
        var verdict = recordMoves(square);
        if (vardict == undefined) { //if verdict is empty then the square is unoccupied.
            var paintAvatar = determineAvatar(); // get the correct avatar to paint for the active player
            var selected = document.getElementsByClassName(paintAvatar)[4]; //paint avatar
            if (paintAvatar == "O") { // change these all to ternary statements instead
                animateO(selected); //call function to animate O
            } else if (paintAvatar == "X") {
                animateX(selected); //call functoin to animate X
            }
            // build new array adding the newly selected square and the assigned avatar
            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon(); // call function to check if current move completes a winning condition
            avatarPlaced(square, paintAvatar); // end current turn and ppass the turn to the other player
            squareSound(); // play a game sound when the avatar is placed
        }
    }
}

function square6Animate() {
    var activePlayer = document.getElementById('showPlayer').innerHTML;
    if (activePlayer != "Game Stopped") { // if game has not yet started prevent avatar placement
        var square = "5"; // identify the square selected
        //check if the proposed square is valid
        var verdict = recordMoves(square);
        if (vardict == undefined) { //if verdict is empty then the square is unoccupied.
            var paintAvatar = determineAvatar(); // get the correct avatar to paint for the active player
            var selected = document.getElementsByClassName(paintAvatar)[5]; //paint avatar
            if (paintAvatar == "O") { // change these all to ternary statements instead
                animateO(selected); //call function to animate O
            } else if (paintAvatar == "X") {
                animateX(selected); //call functoin to animate X
            }
            // build new array adding the newly selected square and the assigned avatar
            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon(); // call function to check if current move completes a winning condition
            avatarPlaced(square, paintAvatar); // end current turn and ppass the turn to the other player
            squareSound(); // play a game sound when the avatar is placed
        }
    }
}

function square7Animate() {
    var activePlayer = document.getElementById('showPlayer').innerHTML;
    if (activePlayer != "Game Stopped") { // if game has not yet started prevent avatar placement
        var square = "6"; // identify the square selected
        //check if the proposed square is valid
        var verdict = recordMoves(square);
        if (vardict == undefined) { //if verdict is empty then the square is unoccupied.
            var paintAvatar = determineAvatar(); // get the correct avatar to paint for the active player
            var selected = document.getElementsByClassName(paintAvatar)[6]; //paint avatar
            if (paintAvatar == "O") { // change these all to ternary statements instead
                animateO(selected); //call function to animate O
            } else if (paintAvatar == "X") {
                animateX(selected); //call functoin to animate X
            }
            // build new array adding the newly selected square and the assigned avatar
            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon(); // call function to check if current move completes a winning condition
            avatarPlaced(square, paintAvatar); // end current turn and ppass the turn to the other player
            squareSound(); // play a game sound when the avatar is placed
        }
    }
}

function square8Animate() {
    var activePlayer = document.getElementById('showPlayer').innerHTML;
    if (activePlayer != "Game Stopped") { // if game has not yet started prevent avatar placement
        var square = "7"; // identify the square selected
        //check if the proposed square is valid
        var verdict = recordMoves(square);
        if (vardict == undefined) { //if verdict is empty then the square is unoccupied.
            var paintAvatar = determineAvatar(); // get the correct avatar to paint for the active player
            var selected = document.getElementsByClassName(paintAvatar)[7]; //paint avatar
            if (paintAvatar == "O") { // change these all to ternary statements instead
                animateO(selected); //call function to animate O
            } else if (paintAvatar == "X") {
                animateX(selected); //call functoin to animate X
            }
            // build new array adding the newly selected square and the assigned avatar
            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon(); // call function to check if current move completes a winning condition
            avatarPlaced(square, paintAvatar); // end current turn and ppass the turn to the other player
            squareSound(); // play a game sound when the avatar is placed
        }
    }
}

function square9Animate() {
    var activePlayer = document.getElementById('showPlayer').innerHTML;
    if (activePlayer != "Game Stopped") { // if game has not yet started prevent avatar placement
        var square = "8"; // identify the square selected
        //check if the proposed square is valid
        var verdict = recordMoves(square);
        if (vardict == undefined) { //if verdict is empty then the square is unoccupied.
            var paintAvatar = determineAvatar(); // get the correct avatar to paint for the active player
            var selected = document.getElementsByClassName(paintAvatar)[8]; //paint avatar
            if (paintAvatar == "O") { // change these all to ternary statements instead
                animateO(selected); //call function to animate O
            } else if (paintAvatar == "X") {
                animateX(selected); //call functoin to animate X
            }
            // build new array adding the newly selected square and the assigned avatar
            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon(); // call function to check if current move completes a winning condition
            avatarPlaced(square, paintAvatar); // end current turn and ppass the turn to the other player
            squareSound(); // play a game sound when the avatar is placed
        }
    }
}