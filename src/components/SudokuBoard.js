import React from 'react';

import './SudokuBoard.css';

class SudokuBoard extends React.Component {

    constructor(props){
        super(props);

        this.state ={
            i: 0,
            board: [
                [8, undefined, undefined, 7, undefined, 3, undefined, undefined, undefined],
                [undefined, undefined, 3, 6, undefined, undefined, undefined, undefined, undefined],
                [undefined, 7, undefined, undefined, 9, undefined, 2, undefined, undefined],
                [undefined, 5, undefined, undefined, undefined, 7, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, 4, 5, 7, undefined, undefined],
                [undefined, undefined, undefined, 1, undefined, undefined, undefined, 3, undefined],
                [5, undefined, 1, undefined, undefined, undefined, undefined, 6, 8],
                [undefined, undefined, 8, 5, undefined, undefined, undefined, 1, undefined],
                [undefined, 9, undefined, undefined, undefined, undefined, 4, 5, undefined]
            ],
            attempts: {},
            unsolved: [],
            isSolving: false,
            solver: undefined,
            solved: false
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

    findUnsolvedSpaces = () => {
        let unsolved = [];
        this.state.board.forEach((row, y) => {
            row.forEach((space, x) => {
                if (space === undefined) {
                    unsolved.push({ row: y, column: x });
                }
            });
        });
        return unsolved;
    }

    getNumberAtPosition = (coords) => {
        // x = column, y = row
        return this.state.board[coords.row][coords.column];
    }

    updatedBoard = (coords, value, board = this.state.board) => {
        // x = column, y = row
        let newBoard = board;
        newBoard[coords.row][coords.column] = value;
        return newBoard;
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
        setNumbers.delete(undefined);
        return [...setNumbers];
    }

    numbersInColumn = (coords) => {
        let column = coords.column;
        let numbers = this.state.board.map(row => {
            return row[column];
        });
        let setNumbers = new Set(numbers);
        setNumbers.delete(undefined);
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
        setNumbers.delete(undefined);
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

    nextStepIfHaveNumberChoices = (possibleNumbers) => {
        let choice = possibleNumbers[0];

        let newAttempts = this.state.attempts;
        newAttempts[`${this.state.unsolved[this.state.i].row}-${this.state.unsolved[this.state.i].column}`].push(choice);
        let newBoard = this.state.board;
        let position = this.state.unsolved[this.state.i]
        newBoard[position.row][position.column] = choice;
        this.setState({
            attempts: newAttempts,
            i: this.state.i + 1,
            board: newBoard
        });
    }

    nextStepIfNoNumbersLeft = () => {
        let newBoard = this.updatedBoard(this.state.unsolved[this.state.i], undefined)

        let newAttempts = this.state.attempts;
        newAttempts[`${this.state.unsolved[this.state.i].row}-${this.state.unsolved[this.state.i].column}`] = [];
        // i--;
        newBoard = this.updatedBoard(this.state.unsolved[this.state.i -1 ], undefined, newBoard);
        // i--;
        if ( (this.state.i - 2) < 0) {
            throw new Error("Unable to solve Sudoku - make sure the board is valid")
        }

        this.setState({
            board: newBoard,
            attempts: newAttempts,
            i: this.state.i - 1
        });
    }

    solveNextStep = () => {
        if(this.state.i === this.state.unsolved.length){
            console.log("Sudoku solved!");
            this.stopSolving();
            this.setState({solved: true});
            return;
        }

        let possibleNumbers = this.possibleNumbersForPosition(this.state.unsolved[this.state.i]); //Set
        let previouslyTried = this.state.attempts[`${this.state.unsolved[this.state.i].row}-${this.state.unsolved[this.state.i].column}`]; //Array

        previouslyTried.forEach(number => {
            possibleNumbers.delete(number);
        })

        possibleNumbers = [...possibleNumbers]; //convert Set to array

        if (possibleNumbers.length > 0) {
            this.nextStepIfHaveNumberChoices(possibleNumbers);
        } else {
            this.nextStepIfNoNumbersLeft();
        }

    }

    startSolving = () => {
        if(!this.state.isSolving){
            this.setState({
                isSolving: true,
                solver: setInterval(this.solveNextStep, 1)
            })
        }
    }

    stopSolving = () => {
        clearInterval(this.state.solver);
        this.setState({
            isSolving: false,
            solver: undefined
        })
    }

    showSolvedMessage = () => {
        return this.state.solved ? "visible" : "hidden";
    }

    getCellClass(index) {
        if(index >= 27 && index < 36){
            return "cell-border-top";
        } else if (index >= 54 && index < 63){
            return "cell-border-top";
        } else {
            return "";
        }
    }

    renderNumbers(){
        let cells = this.state.board.flat();
        return cells.map( (cell, index) => {
            return (
                <div className={`cell ${this.getCellClass(index)}`} key={`cell-${index}`}>
                    {cell}
                </div>
            );
        })
    }

    render(){
        return (
            <div className="sudoku-board-container">
                <div className={"sudoku-board " + (this.state.solved ? "completed" : "")}>
                    {this.renderNumbers()}
                </div>
                <p>Use the buttons below to start/stop the brute force Sudoku solving process</p>
                <div>
                    <input type="button" className="ui button" disabled={this.state.isSolving} onClick={this.startSolving} value="Solve" />
                    <input type="button" className="ui button" disabled={!this.state.isSolving} onClick={this.stopSolving} value="Pause" />
                </div>
                <p className={this.showSolvedMessage()}>Solved!</p>
            </div>
        );
    }
}

export default SudokuBoard;