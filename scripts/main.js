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

    }

    const playRoundAI = () => {
        let roundPlayer;
        let cellToChange;
        let sign;
        let isWon=false;

        //pick player for the round
        if(_currentPlayerIndex === 1) roundPlayer = _playerOne;
        else roundPlayer = _playerTwo;

        cellToChange = _makeMove(-1,roundPlayer);
        sign = roundPlayer.getSign();
        isWon=_gameBoard.checkIfWon(sign);

        //change player after the round
        changePlayer();

        //pass the informations to use in DOM
        return [cellToChange,sign,isWon];

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
        _currentPlayerIndex = 1;
    }

    const resetGame = () =>{
        _gameBoard.clearBoard();
    }

    return {
        isCurrentPlayerAI,
        playRoundPlayer,
        playRoundAI,
        setPlayers,
        resetGame,
    }
})();


const displayGameController = (()=>{
    let _gameController = gameController;
    let _boardCells = document.querySelectorAll('.board-cell');
    let _startButton = document.querySelector('#start-button');

    let _p1signPicker = document.querySelector('#signs-1');
    let _p2signPicker = document.querySelector('#signs-2');

    let _p1AIPicker = document.querySelector('#ai-picker-player-1');
    let _p2AIPicker = document.querySelector('#ai-picker-player-2');
    let repeatInterval;

    const changeAI = (e)=>{
        let player = e.target.dataset.player;
        let difficultyPicker=document.querySelector(`#ai-difficulty-picker-${player}`);
        if(e.target.value==='0') {
            difficultyPicker.classList.add('hidden');
        } else {
            difficultyPicker.classList.remove("hidden");
            console.log(difficultyPicker.classList)
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
    _p1signPicker.addEventListener('change',changeSign);
    _p2signPicker.addEventListener('change',changeSign);

    _p1AIPicker.addEventListener('change', changeAI);
    _p2AIPicker.addEventListener('change', changeAI);

    const startGame = (e) =>{
        //read the choices of sign and AI
        initializeGame();
    }

    const restartGame = () =>{
        _boardCells.forEach((element)=>{
            element.classList.remove('clicked')
            element.querySelector('.sign').innerText='';
        })
        _gameController.resetGame();
    }

    _startButton.addEventListener('click',startGame);

    const moveAI = ()=>{
        let roundResult = _gameController.playRoundAI();
        let elementToChange = document.querySelector(`.board-cell[data-index="${roundResult[0]}"]`);
        elementToChange.classList.add('clicked');
        elementToChange.querySelector('.sign').innerText=roundResult[1];
        if(roundResult[2]===true){
            clearInterval(repeatInterval);
            alert("PC WON");
            return true;
            restartGame();
        }
    }
    const move = (e) => {
        //process clicking a cell by user
        let index = e.target.dataset.index;
        let roundResult = _gameController.playRoundPlayer(index);
        //clicked cell was already taken
        if (roundResult === false) return;
        e.target.classList.add('clicked');
        e.target.querySelector(".sign").innerText = roundResult[1];
        if (roundResult[2] === true) {
            alert("Player WON");
            restartGame();
            return;
        }
        if (_gameController.isCurrentPlayerAI() === true) {
            moveAI();
        }
    }

    const simulateTwoAI = ()=>{
        // let timeoutValue=2000;
        // for(let i=1;i<=9;i++){
        //     setTimeout(moveAI,timeoutValue);
        //     timeoutValue+=2000;
        // }
        if(repeatInterval) clearInterval(repeatInterval);
        repeatInterval = setInterval(()=>{moveAI()}, 2000);
        // console.log('This RUN');

        // setTimeout(moveAI,1000);
        // setTimeout(moveAI,2000);
        // setTimeout(moveAI,3000);
        // setTimeout(moveAI,4000);
        // setTimeout(moveAI,5000);
        // setTimeout(moveAI,6000);
        // setTimeout(moveAI,7000);
        // setTimeout(moveAI,8000);
        // setTimeout(moveAI,9000);
        
    }

    
    const initializeGame = ()=>{
        let AICounter=0;
        let p1Sign = _p1signPicker.value;
    
        if(_p1AIPicker.value==='1') AICounter++;
        if(_p2AIPicker.value==='1') AICounter++;

        _gameController.setPlayers(p1Sign,Number(AICounter));
        
        if(AICounter===2) simulateTwoAI();

        // if(_p1AIPicker.value==='1') moveAI();

        // _boardCells.forEach((element)=>{
        //     element.addEventListener('click',move);
        // });
    }


    return{
        initializeGame,
    }

})();