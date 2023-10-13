import { useState } from 'react';

function Square({ value, onSquareClick,isWinnerSquare}) {
  return (
    <button className={`square ${isWinnerSquare ? 'winner' : ''}`} onClick={onSquareClick} >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i,row,col) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares,row,col);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner.player;
  }else if(squares.every((square)=>square)){
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardRows = [];
  for(let row =0;row <3;row++){
    const rowSquares = [];
    for(let col =0;col <3;col++){
      let squareIndex = 3 *row + col;
      let isWinnerSquare = false;
      if(winner){
        if(winner.winnerSquares.includes(squareIndex)){
          isWinnerSquare = true;
        }
      }
      rowSquares.push(
        <Square key={squareIndex} value={squares[squareIndex]} onSquareClick={() => handleClick(squareIndex,row,col)} isWinnerSquare={isWinnerSquare} />
      )
    }
    boardRows.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    )
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
      
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const [symbolsOrderText,setMoveOrderText] = useState("↓");
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares,row,col) {
    const nextHistory = [...history.slice(0, currentMove + 1), {squares:nextSquares,step: {row,col}}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if(move == currentMove ){
      description = 'You are at move #' + move;
      return (
        <li key ={move}>
          <>{description} {squares.step && <span>{' ('+ squares.step.row+', '+squares.step.col +')'}</span>}</>
           
        </li>
      )
    }
    else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description} {squares.step && <span>{' ('+ squares.step.row+', '+squares.step.col +')'}</span>}</button>
         
      </li>
    );
  });

  if(!ascending){
    moves.reverse();
  }

  function sortToggleClick(){
    setAscending(ascending=>!ascending);
    if(ascending){
      setMoveOrderText('↑');
    }else{
      setMoveOrderText('↓');
    }
     
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div style={{ marginLeft: '30px' }}>
          <button onClick={sortToggleClick}>
            Sort {symbolsOrderText}
          </button>
          
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player : squares[a],
        winnerSquares: [a,b,c],
      };
    }
  }
  return null;
}
