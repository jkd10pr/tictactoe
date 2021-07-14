const Player = (sign, isAI, difficulty) => {
    let _isAI = isAI;
    let _sign = sign;
    let _difficulty = difficulty;

    const getAI = () => {
        return _isAI;
    }

    const setAI = (i) => {
        if (i === true) _isAI = true;
        else _isAI = false;
    }

    const getSign = () => {
        return _sign;
    }

    const setSign = (sign) => {
        _sign = sign;
    }

    const getDIff = ()=>{
        return _difficulty;
    }

    const setDiff = (difficulty)=>{
        _difficulty=difficulty;
    }

    return {
        setAI,
        getAI,
        getSign,
        setSign,
        getDIff,
        setDiff,
    }
}

const gameBoard = (() => {
    let _gameArray = ["", "", "", "", "", "", "", "", ""];
    let _winningCombinations = [
        //horizontal lines
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        //vertical lines
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        //cross axises
        [0, 4, 8], [2, 4, 6]
    ]

    const getEmptyFields = () => {
        let emptyFields = [];
        _gameArray.forEach((field, i) => {
            if (field === "") emptyFields.push(i)
        });
        return emptyFields;
    }

    const _getPlayerFields = (sign) => {
        let signFields = [];
        _gameArray.forEach((field, i) => {
            if (field === sign) signFields.push(i);
        });
        return signFields;
    }

    const updateBoard = (i, playerSign) => {
        if (getEmptyFields().includes(Number(i))) {
            _gameArray.splice(i, 1, playerSign);
            return true;
        } else {
            //return false if picked index is taken or out of bounds
            return false;
        }
    }

    const deleteFromBoard = (i) => {
        _gameArray.splice(i,1,'');
    }

    const checkIfWon = (sign) => {
        let playerFields = _getPlayerFields(sign);
        let result = false;
        _winningCombinations.forEach((winComb) => {
            let check = winComb.every(i => playerFields.includes(i));
            if (check === true) {
                result = true;
            }
        })

        return result;
    }

    const clearBoard =() =>{
        _gameArray = ["", "", "", "", "", "", "", "", ""];
    }

    return {
        getEmptyFields,
        updateBoard,
        deleteFromBoard,
        checkIfWon,
        clearBoard,
    }
})();

const gameController = (() => {
    let _gameBoard = gameBoard;
    let _playerOne = Player('x',false,-1);
    let _playerTwo = Player('o',true,'1');
    let _currentPlayerIndex = 1;

    const getCurrentPlayer = ()=>{
        return _currentPlayerIndex;
    }
    const _changePlayer = () =>{
        if(_currentPlayerIndex === 1) _currentPlayerIndex=2;
        else _currentPlayerIndex = 1;
    }

    const _makeMove = (index,player) => {

        //choosing the move for human
        if (player.getAI() === false) {
            
            //terminate the round if clicked cell is already taken
            if(_gameBoard.updateBoard(index, player.getSign()) === false) return false;
            return index;
        }
        //choosing the move for AI - will implement minmax Later
        else {
            i = _bestMoveAI(player.getDIff(),player.getSign());
            _gameBoard.updateBoard(i, player.getSign());
            return i;
        }
    }

    const _bestMoveAI = (difficulty,sign) =>{

        let availableMoves = _gameBoard.getEmptyFields();
        let bestScore = -Infinity;
        let pickedMove;
        let otherSign;

        if (_currentPlayerIndex === 1) otherSign = _playerTwo.getSign();
        else otherSign = _playerOne.getSign();

        if(difficulty==='1'){
        let index = Math.floor(Math.random()*availableMoves.length);
        pickedMove = availableMoves[index];
        }else if(difficulty === '2'){
            // alert('wow wow much difikulti')
             availableMoves.forEach((move)=>{
                _gameBoard.updateBoard(move,sign);
                 let score = minimax(0,false,sign,otherSign);
                _gameBoard.deleteFromBoard(move);
                 if(score>bestScore) {
                     bestScore=score;
                     pickedMove = move;
                    }
             })
        }

        return pickedMove;
    }

    const minimax = (depth, isMaximizing, sign, otherSign) => {

        //result checks
        let MyResult = _gameBoard.checkIfWon(sign);
        if (MyResult === true) return 1;
        else {
            let enemyResult = _gameBoard.checkIfWon(otherSign);
            if (enemyResult === true) return -1;
            else if (_gameBoard.getEmptyFields().length === 0) return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            let emptyFields = _gameBoard.getEmptyFields();
            emptyFields.forEach(((move) => {
                _gameBoard.updateBoard(move, sign);
                let score = minimax(depth + 1, false, sign,otherSign);
                _gameBoard.deleteFromBoard(move);
                bestScore = Math.max(score,bestScore);
            }))
            return bestScore;
        } else {
            let bestScore = Infinity;
            let emptyFields = _gameBoard.getEmptyFields();
            emptyFields.forEach(((move) => {
                _gameBoard.updateBoard(move, otherSign);
                let score = minimax(depth + 1, true, sign,otherSign);
                _gameBoard.deleteFromBoard(move);
                bestScore = Math.min(score,bestScore);
            }))
            return bestScore;
        }

    }

    const setPlayers = (playerOneSign,p1AI,p2AI,p1AIDiff,p2AIDIff) => {
        if(playerOneSign==='x'){
            _playerOne.setSign('x');
            _playerTwo.setSign('o');
        } else if (playerOneSign==='o'){
            _playerOne.setSign('o');
            _playerTwo.setSign('x');
        }
        _playerOne.setDiff(p1AIDiff);
        _playerTwo.setDiff(p2AIDIff);

        _playerOne.setAI(p1AI);
        _playerTwo.setAI(p2AI);
        
        _currentPlayerIndex = 1;
    }

    const isCurrentPlayerAI = ()=>{
        if(_currentPlayerIndex===1) return _playerOne.getAI();
        else return _playerTwo.getAI();
    }

    const playRoundPlayer = (index) => {
        let roundPlayer;
        let cellToChange;
        let sign;
        let roundResult;
        let isWon=false;

        if(_currentPlayerIndex === 1) roundPlayer = _playerOne;
        else roundPlayer = _playerTwo;

        cellToChange = _makeMove(index,roundPlayer);
        if (cellToChange===false) return false;
        sign = roundPlayer.getSign();
        isWon=_gameBoard.checkIfWon(sign);
        if(isWon) roundResult=_currentPlayerIndex;
        else roundResult='continue';
        if(_gameBoard.getEmptyFields().length===0 && isWon===false) roundResult='tie';
        _changePlayer();
        return [cellToChange,sign,roundResult];

    }

    const playRoundAI = () => {
        let roundPlayer;
        let cellToChange;
        let sign;
        let roundResult;
        let isWon=false;

        //pick player for the round
        if(_currentPlayerIndex === 1) roundPlayer = _playerOne;
        else roundPlayer = _playerTwo;

        cellToChange = _makeMove(-1,roundPlayer);
        sign = roundPlayer.getSign();
        isWon=_gameBoard.checkIfWon(sign);
        if(isWon) roundResult=_currentPlayerIndex;
        else roundResult='continue';
        if(_gameBoard.getEmptyFields().length===0 && isWon===false) roundResult='tie';
        _changePlayer();
        return [cellToChange,sign,roundResult];

    }

    const resetGame = () =>{
        _gameBoard.clearBoard();
    }

    return {
        getCurrentPlayer,
        setPlayers,
        isCurrentPlayerAI,
        playRoundPlayer,
        playRoundAI,
        resetGame,
    }
})();

const displayGameController = (()=>{

    const changeAI = (e)=>{
        let player = e.target.dataset.player;
        let difficultyPicker=document.querySelector(`#ai-difficulty-picker-${player}`);

        //display difficulty picker if player is an AI
        if(e.target.value==='0') {
            difficultyPicker.classList.add('hidden');
        } else {
            difficultyPicker.classList.remove("hidden");
        }
    }

    const changeSign = (e) =>{
        let setOtherSign=e.target.value==='x'?'o':'x';
        if(e.target.dataset.player==='1'){
            _p2signPicker.value=setOtherSign;
        } else {
            _p1signPicker.value=setOtherSign;
        }
    }
    const endGame = (winner)=>{
        let result
        if(winner!=='tie')
        result=`Player ${winner} won the game!`;
        else result="It's a tie!";
        clearTimeout(nextTurnTimeout);
        _resultsDisplay.innerText=result;
        _resultsDisplay.classList.remove('red');
        _resultsDisplay.classList.remove('blue');
        _resultsDisplay.classList.add('white');

        _boardWrapper.classList.remove('red');
        _boardWrapper.classList.remove('blue');
        _boardWrapper.classList.add('white');   
    
    }

    const restartGame = () =>{
        _boardCells.forEach((element)=>{
            element.classList.remove('red');
            element.classList.remove('blue');
            element.querySelector('.sign').innerText='';
        })
        _resultsDisplay.innerText='Press play to start';
        _resultsDisplay.classList.add('white');
        _resultsDisplay.classList.remove('red');
        _resultsDisplay.classList.remove('blue');
        _boardWrapper.classList.add('white');
        _boardWrapper.classList.remove('red');
        _boardWrapper.classList.remove('blue');


        clearInterval(repeatInterval);
        _gameController.resetGame();
        _startButton.addEventListener('click',startGame);
    }

    //process AI turn
    const moveAI = ()=>{
        let playerColor = _gameController.getCurrentPlayer()===1?'red-sign':'blue-sign';
        let boardColor = _gameController.getCurrentPlayer()===1?'blue':'red';
        let boardColorToDelete = _gameController.getCurrentPlayer()===1?'red':'blue';

        let roundResult = _gameController.playRoundAI();
        let elementToChange = document.querySelector(`.board-cell[data-index="${roundResult[0]}"]`);

        _boardWrapper.classList.remove('white');
        
        // nextTurnTimeout = setTimeout(()=>{

        // },800)

        nextTurnTimeout = setTimeout(()=>{
            elementToChange.classList.add(playerColor);
            _resultsDisplay.classList.remove('white');
            _resultsDisplay.classList.remove(boardColorToDelete);
            _resultsDisplay.classList.add(boardColor);
            _resultsDisplay.innerText=`Player ${_gameController.getCurrentPlayer()}'s turn`;
            _boardWrapper.classList.remove(boardColorToDelete);
            _boardWrapper.classList.add(boardColor);
        },800);
        elementToChange.querySelector('.sign').innerText=roundResult[1];
        if(roundResult[2]!=='continue'){
            elementToChange.classList.add(playerColor);
            clearInterval(repeatInterval);
            endGame(roundResult[2])
            return true;
        }
    }

    //process clicking a cell by user
    const move = (e) => {
        _boardCells.forEach((element)=>{
            element.removeEventListener('click',move);
        });
        let playerColor = _gameController.getCurrentPlayer()===1?'red-sign':'blue-sign';
        let boardColor = _gameController.getCurrentPlayer()===1?'blue':'red';
        let boardColorToDelete = _gameController.getCurrentPlayer()===1?'red':'blue';

        let index = e.target.dataset.index;
        let roundResult = _gameController.playRoundPlayer(index);
  
        //clicked cell was already taken
        if (roundResult === false) return;
        e.target.classList.add(playerColor);
        e.target.querySelector(".sign").innerText = roundResult[1];
        if (roundResult[2]!=='continue') {
            endGame(roundResult[2])
            return;
        }

        _resultsDisplay.classList.remove('white');
        _resultsDisplay.classList.remove(boardColorToDelete);
        _resultsDisplay.classList.add(boardColor);
        _resultsDisplay.innerText=`Player ${_gameController.getCurrentPlayer()}'s turn`;
        _boardWrapper.classList.remove('white');
        _boardWrapper.classList.remove(boardColorToDelete);
        _boardWrapper.classList.add(boardColor);

        //run if next round is for AI
        if (_gameController.isCurrentPlayerAI() === true) {
            moveAI();
        }

        _boardCells.forEach((element)=>{
            element.addEventListener('click',move);
        });
    }

    const simulateTwoAI = ()=>{
        if(repeatInterval) clearInterval(repeatInterval);
        repeatInterval = setInterval(()=>{moveAI()}, 1000); 
    }

    
    const startGame = ()=>{
        let p1Sign = _p1signPicker.value;
        let isP1AI = false;
        let isP2AI = false;

        let p1AIDiff = _p1AIDiffPicker.value;
        let p2AIDIff = _p2AIDiffPicker.value;
        //reset the board to play the round and disable the start button until the game ends
        restartGame();
        _startButton.removeEventListener('click',startGame);

        //set the player parameters for game controller
        if(_p1AIPicker.value==='1') isP1AI=true;
        if(_p2AIPicker.value==='1') isP2AI=true;
        _gameController.setPlayers(p1Sign,isP1AI,isP2AI,p1AIDiff,p2AIDIff );
        

        _resultsDisplay.innerText="Player 1's turn";
        _resultsDisplay.classList.add('red');
        _boardWrapper.classList.add('red');

        //simulate two AI's playing against each other
        if(isP1AI===true && isP2AI===true) {
            simulateTwoAI();
            return;
        }

        //make the first move automatically if player 1 is AI
        if(isP1AI===true) 
        moveAI();

        
        _boardCells.forEach((element)=>{
            element.addEventListener('click',move);
            element.classList.remove('red-sign');
            element.classList.remove('red-sign')
        });
    }

    let _gameController = gameController;
    let _boardCells = document.querySelectorAll('.board-cell');
    let _startButton = document.querySelector('#start-button');
    let _resetButton = document.querySelector('#reset-button');

    let _p1signPicker = document.querySelector('#signs-1');
    let _p2signPicker = document.querySelector('#signs-2');

    let _p1AIPicker = document.querySelector('#ai-picker-player-1');
    let _p2AIPicker = document.querySelector('#ai-picker-player-2');

    let _p1AIDiffPicker = document.querySelector('#ai-difficilty-picker-player-1');
    let _p2AIDiffPicker = document.querySelector('#ai-difficilty-picker-player-2');

    let _boardWrapper  = document.querySelector('#board-wrapper');
    let _resultsDisplay = document.querySelector('#results-display');

    let repeatInterval;
    let nextTurnTimeout;

    _p1signPicker.addEventListener('change',changeSign);
    _p2signPicker.addEventListener('change',changeSign);

    _p1AIPicker.addEventListener('change', changeAI);
    _p2AIPicker.addEventListener('change', changeAI);

    _startButton.addEventListener('click',startGame);
    _resetButton.addEventListener('click',restartGame)


    return{
        startGame,
    }

})();