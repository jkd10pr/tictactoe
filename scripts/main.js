const Player = (sign, isAI) => {
    let _isAI = isAI;
    let _sign = sign;
    let prototype;

    if (isAI) {
        //inherit Computer methods
    } else {
        //inherit Human Methods
    }
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

    const setSign = () => {
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
    let _playerTwo = Player('y',true);

    const _makeMove = (player) => {

        //choosing the move for human
        if (player.checkAI() === false) {
            let i = prompt('Chose the index');
            while (_gameBoard.updateBoard(i, player.getSign()) === false) {
                i = prompt('You cant choose this! Chose the index again');
            }
            _gameBoard.displayBoard();
        }
        //choosing the move for AI - will implement minmax Later
        else {
            i = _bestMoveAI();
            _gameBoard.updateBoard(i, player.getSign());
        }
    }

    const _bestMoveAI = () =>{

        availableMoves = _gameBoard.getEmptyFields();
        index = Math.floor(Math.random()*availableMoves.length);
        pickedMove = availableMoves[index];

        console.log(`computer picked ${pickedMove}`)
        return pickedMove;
    }

    const _playRound = (player) => {
        let playerSign = player.getSign();
        _makeMove(player);
        _gameBoard.displayBoard();
        return _gameBoard.checkIfWon(playerSign);
    }

    const playGame = () => {
        result = '';
        while (result === '' || _gameBoard.getEmptyFields().length === 0) {
            if (_playRound(_playerOne)) {
                result = '1';
                break;
            }
            if (_gameBoard.getEmptyFields().length === 0) break;
            if (_playRound(_playerTwo)) {
                result = '2';
                break;
            }
        }
        if (result === '') result = 'tie';
        console.log(`Player ${result} wins!`)
        _gameBoard.clearBoard();

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
        setPlayers,
        playGame,
    }
})();

const displayGameController = (()=>{
    // let _gameController = gameController;

    // gameController.playGame();
})();