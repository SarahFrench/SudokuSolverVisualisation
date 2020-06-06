import React from 'react';

import './SudokuBoard.css';

class SudokuBoard extends React.Component {

    compose(){
        super(props);
        this.state = {
            board : []
        }
    }

    render(){
        return (
            <div className="sudoku-board">
            </div>
        );
    }
}

export default SudokuBoard;