const Player = (sign, isAI) => {
    let _isAI = isAI;
    let _sign = sign;
    let prototype;

    const checkAI = () => {
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

    return {
        setAI,
        checkAI,
        getSign,
        setSign
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

    // const _getFieldValue = (i)=>{
    //     return _gameArray[i];
    // }

    const updateBoard = (i, playerSign) => {
        availableCells = getEmptyFields();
        if (availableCells.includes(Number(i))) {
            _gameArray.splice(i, 1, playerSign);
            return true;
        } else {
            return false;
        }
    }

    const displayBoard = () => {
        let prettyResult='';
        // console.table(_gameArray);
        _gameArray.forEach((element,i)=>{
            if(element==='') prettyResult+='#';
            prettyResult+=element;
            if((i+1)%3===0) prettyResult+='\n';
        })
        console.log(prettyResult);
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
        displayBoard,
        checkIfWon,
        clearBoard,
    }
})();

const gameController = (() => {
    let _gameBoard = gameBoard;
    let _playerOne = Player('x',false);
    let _playerTwo = Player('o',true);
    let _currentPlayerIndex = 1;

    const changePlayer = () =>{
        if(_currentPlayerIndex === 1) _currentPlayerIndex=2;
        else _currentPlayerIndex = 1;
    }

    const isCurrentPlayerAI = ()=>{
        if(_currentPlayerIndex===1) return _playerOne.checkAI();
        else return _playerTwo.checkAI();
    }

    const _makeMove = (index,player) => {

        //choosing the move for human
        if (player.checkAI() === false) {
            
            //terminate the round if clicked cell is already taken
            if(_gameBoard.updateBoard(index, player.getSign()) === false) return false;

            return index;
        }
        //choosing the move for AI - will implement minmax Later
        else {
            i = _bestMoveAI();
            _gameBoard.updateBoard(i, player.getSign());
            return i;
        }
    }

    const _bestMoveAI = () =>{

        availableMoves = _gameBoard.getEmptyFields();
        index = Math.floor(Math.random()*availableMoves.length);
        pickedMove = availableMoves[index];

        console.log(`computer picked ${pickedMove}`)
        return pickedMove;
    }

    const playRoundPlayer = (index) => {
        let roundPlayer;
        let cellToChange;
        let sign;
        let isWon=false;

        if(_currentPlayerIndex === 1) roundPlayer = _playerOne;
        else roundPlayer = _playerTwo;

        cellToChange = _makeMove(index,roundPlayer);
        if (cellToChange===false) return false;
        sign = roundPlayer.getSign();
        isWon=_gameBoard.checkIfWon(sign);
        changePlayer();
        return [cellToChange,sign,isWon];

        // let playerSign = player.getSign();
        // _makeMove(player);
        // _gameBoard.displayBoard();
        // if()
        // return index;

    }

    const playRoundAI = () => {
        let roundPlayer;
        let cellToChange;
        let sign;
        let isWon=false;

        if(_currentPlayerIndex === 1) roundPlayer = _playerOne;
        else roundPlayer = _playerTwo;

        cellToChange = _makeMove(-1,roundPlayer);
        sign = roundPlayer.getSign();
        isWon=_gameBoard.checkIfWon(sign);
        changePlayer();
        return [cellToChange,sign,isWon];

    }

    const playGame = () => {
        // result = '';
        // if(result !== '' || _gameBoard.getEmptyFields().length !== 0) {
        //     if (_playRound(_playerOne)) {
        //         result = '1';
        //         break;
        //     }
        //     if (_gameBoard.getEmptyFields().length === 0) break;
        //     if (_playRound(_playerTwo)) {
        //         result = '2';
        //         break;
        //     }
        // }
        // if (result === '') result = 'tie';
        // console.log(`Player ${result} wins!`)
        // _gameBoard.clearBoard();

    }

    const setPlayers = (playerOneSign,aiCount) => {
        if(playerOneSign==='x'){
            _playerOne.setSign('x');
            _playerTwo.setSign('o');
        } else if (playerOneSign==='o'){
            _playerOne.setSign('o');
            _playerTwo.setSign('x');
        }

        switch(aiCount){
            case 0:
                _playerOne.setAI(false);
                _playerTwo.setAI(false);
                break;
            case 1:
                _playerOne.setAI(false);
                _playerTwo.setAI(true);
                break;
            case 2:
                _playerOne.setAI(true);
                _playerTwo.setAI(true);
                break;
            default:
                _playerOne.setAI(false);
                _playerTwo.setAI(true);
                break;
        }
    }

    return {
        isCurrentPlayerAI,
        playRoundPlayer,
        playRoundAI,
        setPlayers,
        playGame,
    }
})();


const displayGameController = (()=>{
    let _gameController = gameController;
    let _boardCells = document.querySelectorAll('.board-cell');
    let _startButton = document.querySelector('#start-button');

    

    const startGame = (e) =>{
        //read the choices of sign and AI
        initializeGame();
    }

    _startButton.addEventListener('click',startGame);

    const processCell = (e)=>{

        //process clicking a cell by user
        let index = e.target.dataset.index;
        let roundResult = _gameController.playRoundPlayer(index);
        if(roundResult===false) return;
        e.target.classList.add('clicked');
        e.target.innerText=roundResult[1];
        if(roundResult[2]===true) alert("Player WON");

        //process 
        if(_gameController.isCurrentPlayerAI()===true){
            let roundResult = _gameController.playRoundAI();
            let elementToChange = document.querySelector(`.board-cell[data-index="${roundResult[0]}"]`);
            setTimeout(()=>elementToChange.classList.add('clicked'),500);
            elementToChange.innerText=roundResult[1];
            if(roundResult[2]===true) alert("PC WON");
        }

    }

    const initializeGame = ()=>{
        chosenSign = document.querySelector('#signs').value;
        chosenAI = document.querySelector('#ai-picker').value;

        _boardCells.forEach((element)=>{
            element.addEventListener('click',processCell);
        });

        _gameController.setPlayers(chosenSign,Number(chosenAI));
    }





    // gameController.playGame();
})();