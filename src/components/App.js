import React from 'react';
import SudokuBoard from './SudokuBoard';
import './App.css';


function App() {
  return (
    <div className="app">
      <h1>Sudoku brute-force solver</h1>
      <SudokuBoard />
    </div>
  );
}

export default App;
