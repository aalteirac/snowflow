function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
  }
  return result;
}
window.addEventListener('DOMContentLoaded', () => {
  const tiles = Array.from(document.querySelectorAll('.tile'));
  const playerDisplay = document.querySelector('.display-player');
  const resetButton = document.querySelector('#reset');
  const announcer = document.querySelector('.announcer');

  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let isGameActive = true;
  let gameID=makeid(10);
  const PLAYERX_WON = 'PLAYERX_WON';
  const PLAYERO_WON = 'PLAYERO_WON';
  const TIE = 'TIE';


  /*
      Indexes within the board
      [0] [1] [2]
      [3] [4] [5]
      [6] [7] [8]
  */

  const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
  ];

  function handleResultValidation() {
      let roundWon = false;
      for (let i = 0; i <= 7; i++) {
          const winCondition = winningConditions[i];
          const a = board[winCondition[0]];
          const b = board[winCondition[1]];
          const c = board[winCondition[2]];
          if (a === '' || b === '' || c === '') {
              continue;
          }
          if (a === b && b === c) {
              roundWon = true;
              break;
          }
      }

  if (roundWon) {
          announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
          isGameActive = false;
          return;
      }

  if (!board.includes(''))
      announce(TIE);
  }

  const announce = async (type) => {
      var player="" 
      switch(type){
          case PLAYERO_WON:
              announcer.innerHTML = 'Player <span class="playerO">'+getPlayerText("0")+'</span> Won';
              player="Salesforce";
              break;
          case PLAYERX_WON:
              announcer.innerHTML = 'Player <span class="playerX">'+getPlayerText("X")+'</span> Won';
              player="Snowflake";
              break;
          case TIE:
              player="None"
              announcer.innerText = 'Tie';
      }
      await sendIt("Result",type,player,gameID);
      console.log("WON TRIGGERED !",type,player,gameID)
      announcer.classList.remove('hide');
  };

  const isValidAction = (tile) => {
      if (tile.innerHTML != '' || tile.innerHTML != ''){
          return false;
      }

      return true;
  };

  const updateBoard =  (index) => {
      board[index] = currentPlayer;
  }

  const getPlayerText=(cp)=>{
    if(cp === 'X') 
      return '<span><i class="fa fa-snowflake"></i></span>' 
    return '<span><i class="fab fa-salesforce"></i></span>';
  }

  const getPlayerName=(cp)=>{
    if(cp === 'X') 
      return 'Snowflake' 
    return 'Salesforce';
  }

  const changePlayer = () => {
      playerDisplay.classList.remove(`player${currentPlayer}`);
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      playerDisplay.innerHTML = getPlayerText(currentPlayer);
      playerDisplay.classList.add(`player${currentPlayer}`);
  }

  const userAction = async (tile, index) => {
      if(isValidAction(tile) && isGameActive) {
          await sendIt("Select", index+"",getPlayerName(currentPlayer),gameID);
          tile.innerHTML = getPlayerText(currentPlayer);
          tile.classList.add(`player${currentPlayer}`);
          updateBoard(index);
          handleResultValidation();
          changePlayer();
      }
  }
  
  const resetBoard = async () => {
      await sendIt("Reset","None","None",gameID);
      board = ['', '', '', '', '', '', '', '', ''];
      gameID=makeid(10);
      isGameActive = true;
      announcer.classList.add('hide');

      if (currentPlayer === 'O') {
          changePlayer();
      }

      tiles.forEach(tile => {
          tile.innerText = '';
          tile.classList.remove('playerX');
          tile.classList.remove('playerO');
      });
  }

  tiles.forEach( (tile, index) => {
      tile.addEventListener('click', () => userAction(tile, index));
  });

  resetButton.addEventListener('click', resetBoard);
});