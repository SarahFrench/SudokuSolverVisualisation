import React from 'react';

import './SudokuBoard.css';

class SudokuBoard extends React.Component {

    constructor(props){
        super(props);

        this.state ={
            board: [
                [8, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 3, 6, 0, 0, 0, 0, 0],
                [0, 7, 0, 0, 9, 0, 2, 0, 0],
                [0, 5, 0, 0, 0, 7, 0, 0, 0],
                [0, 0, 0, 0, 4, 5, 7, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 3, 0],
                [0, 0, 1, 0, 0, 0, 0, 6, 8],
                [0, 0, 8, 5, 0, 0, 0, 1, 0],
                [0, 9, 0, 0, 0, 0, 4, 0, 0]
            ],
            attempts: {},
            unsolved: []
        }
    }

    componentDidMount = () =>{
        let unsolved = this.findUnsolvedSpaces();

        let attempts = {};
        unsolved.forEach(coords => {
            attempts[`${coords.row}-${coords.column}`] = [];
        })

        this.setState({
            unsolved : unsolved,
            attempts : attempts
        })
    }

    componentDidUpdate(){
        console.log("updated");
    }

    findUnsolvedSpaces = () => {
        let unsolved = [];
        this.state.board.forEach((row, y) => {
            row.forEach((space, x) => {
                if (space === 0) {
                    unsolved.push({ row: y, column: x });
                }
            });
        });
        return unsolved;
    }

    // updateSolvedStatus = () => {
    //     let boardNumbers = this.state.board.flat();
    //     let numberSet = new Set(boardNumbers);
    //     this.solved = !(numberSet.has(0)); //cannot be solved if a square has 0
    // }

    getNumberAtPosition = (coords) => {
        // x = column, y = row
        return this.state.board[coords.row][coords.column];
    }

    setNumberAtPosition = (coords, value) => {
        // x = column, y = row
        let board = this.state.board;
        board[coords.row][coords.column] = value;
        this.setState({ board: board })
    }

    identifySubSquare = (coords) => {
        //returns coordinate of top left cell of subsquare
        let rowOffset = coords.row % 3;
        let colOffset = coords.column % 3;
        return {
            row: coords.row - rowOffset,
            column: coords.column - colOffset
        }
    }

    numbersInRow = (coords) => {
        let row = coords.row;
        let setNumbers = new Set(this.state.board[row]);
        setNumbers.delete(0);
        return [...setNumbers];
    }

    numbersInColumn = (coords) => {
        let column = coords.column;
        let numbers = this.state.board.map(row => {
            return row[column];
        });
        let setNumbers = new Set(numbers);
        setNumbers.delete(0);
        return [...setNumbers];
    }

    numbersInSubSquare = (coords) => {
        let topLeftCoords = this.identifySubSquare(coords);
        let numbersInSubSquare = this.state.board.map((row, rowIndex) => {
            if (rowIndex >= topLeftCoords.row && rowIndex <= topLeftCoords.row + 2) {
                let numbers = [];
                for (let column = topLeftCoords.column; column <= topLeftCoords.column + 2; column++) {
                    numbers.push(row[column]);
                }
                return numbers;
            }
            return undefined;
        })
        numbersInSubSquare = numbersInSubSquare.filter(element => { return element !== undefined });
        numbersInSubSquare = numbersInSubSquare.flat();

        let setNumbers = new Set(numbersInSubSquare);
        setNumbers.delete(0);
        return [...setNumbers];
    }

    numbersAffectingPosition = (coords) => {
        let numbersInRow = this.numbersInRow(coords);

        let numbersInColumn = this.numbersInColumn(coords);

        let numbersInSubSquare = this.numbersInSubSquare(coords);

        let allNumbers = numbersInRow.concat(numbersInColumn, numbersInSubSquare);

        return new Set(allNumbers);
    }

    possibleNumbersForPosition = (coords) => {
        let possibleNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let notPossible = this.numbersAffectingPosition(coords);
        notPossible.forEach(number => {
            possibleNumbers.delete(number);
        });
        return possibleNumbers;
    }

    solveSelf = () => {
        let i = 0;
        for (i = 0; i < this.state.unsolved.length; i++) {
            // console.log(i)
            let possibleNumbers = this.possibleNumbersForPosition(this.state.unsolved[i]); //Set
            let previouslyTried = this.state.attempts[`${this.state.unsolved[i].row}-${this.state.unsolved[i].column}`]; //Array

            previouslyTried.forEach(number => {
                possibleNumbers.delete(number);
            })

            possibleNumbers = [...possibleNumbers]; //convert Set to array

            if (possibleNumbers.length > 0) {
                let choice = possibleNumbers[0];

                let newAttempts = this.state.attempts;
                newAttempts[`${this.state.unsolved[i].row}-${this.state.unsolved[i].column}`].push(choice);
                this.setState({ attempts : newAttempts});
                this.setNumberAtPosition(this.state.unsolved[i], choice);
                if (i === this.state.unsolved.length - 1 && (this.findUnsolvedSpaces().length === 0)) {
                    console.log("\n\tSudoku solved!");
                    // this.solved = true;
                }
            } else {
                this.setNumberAtPosition(this.state.unsolved[i], 0);
                let newAttempts = this.state.attempts;
                newAttempts[`${this.state.unsolved[i].row}-${this.state.unsolved[i].column}`] = [];
                this.setState({attempts: newAttempts});
                i--;
                this.setNumberAtPosition(this.state.unsolved[i], 0);
                i--;
                if (i >= 0) {

                } else {
                    throw new Error("Unable to solve Sudoku - make sure the board is valid")
                }

            }
        }
    }

    renderNumbers(){
        let cells = this.state.board.flat();
        return cells.map( (cell, index) => {
            return (
                <div key={`cell-${index}`}>
                    {cell}
                </div>
            );
        })
    }

    render(){
        return (
            <div>
                <div className="sudoku-board">
                    {this.renderNumbers()}
                </div>
                <input type="button" onClick={this.solveSelf} value="Solve"/>
            </div>
        );
    }
}

export default SudokuBoard;