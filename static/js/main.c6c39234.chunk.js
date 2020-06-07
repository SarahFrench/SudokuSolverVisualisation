(this["webpackJsonpsudoku-solver"]=this["webpackJsonpsudoku-solver"]||[]).push([[0],[,,,,,,,,function(t,e,o){t.exports=o(16)},,,,,function(t,e,o){},function(t,e,o){},function(t,e,o){},function(t,e,o){"use strict";o.r(e);var n=o(0),a=o.n(n),i=o(3),s=o.n(i),r=(o(13),o(1)),u=o(4),d=o(5),v=o(7),l=o(6),c=(o(14),function(t){Object(v.a)(o,t);var e=Object(l.a)(o);function o(t){var n;return Object(u.a)(this,o),(n=e.call(this,t)).componentDidMount=function(){var t=n.findUnsolvedSpaces(),e={};t.forEach((function(t){e["".concat(t.row,"-").concat(t.column)]=[]})),n.setState({unsolved:t,attempts:e})},n.findUnsolvedSpaces=function(){var t=[];return n.state.board.forEach((function(e,o){e.forEach((function(e,n){void 0===e&&t.push({row:o,column:n})}))})),t},n.getNumberAtPosition=function(t){return n.state.board[t.row][t.column]},n.updatedBoard=function(t,e){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:n.state.board,a=o;return a[t.row][t.column]=e,a},n.identifySubSquare=function(t){var e=t.row%3,o=t.column%3;return{row:t.row-e,column:t.column-o}},n.numbersInRow=function(t){var e=t.row,o=new Set(n.state.board[e]);return o.delete(void 0),Object(r.a)(o)},n.numbersInColumn=function(t){var e=t.column,o=n.state.board.map((function(t){return t[e]})),a=new Set(o);return a.delete(void 0),Object(r.a)(a)},n.numbersInSubSquare=function(t){var e=n.identifySubSquare(t),o=n.state.board.map((function(t,o){if(o>=e.row&&o<=e.row+2){for(var n=[],a=e.column;a<=e.column+2;a++)n.push(t[a]);return n}}));o=(o=o.filter((function(t){return void 0!==t}))).flat();var a=new Set(o);return a.delete(void 0),Object(r.a)(a)},n.numbersAffectingPosition=function(t){var e=n.numbersInRow(t),o=n.numbersInColumn(t),a=n.numbersInSubSquare(t),i=e.concat(o,a);return new Set(i)},n.possibleNumbersForPosition=function(t){var e=new Set([1,2,3,4,5,6,7,8,9]);return n.numbersAffectingPosition(t).forEach((function(t){e.delete(t)})),e},n.nextStepIfHaveNumberChoices=function(t){var e=t[0],o=n.state.attempts;o["".concat(n.state.unsolved[n.state.i].row,"-").concat(n.state.unsolved[n.state.i].column)].push(e);var a=n.state.board,i=n.state.unsolved[n.state.i];a[i.row][i.column]=e,n.setState({attempts:o,i:n.state.i+1,board:a})},n.nextStepIfNoNumbersLeft=function(){var t=n.updatedBoard(n.state.unsolved[n.state.i],void 0),e=n.state.attempts;if(e["".concat(n.state.unsolved[n.state.i].row,"-").concat(n.state.unsolved[n.state.i].column)]=[],t=n.updatedBoard(n.state.unsolved[n.state.i-1],void 0,t),n.state.i-2<0)throw new Error("Unable to solve Sudoku - make sure the board is valid");n.setState({board:t,attempts:e,i:n.state.i-1})},n.solveNextStep=function(){if(n.state.i===n.state.unsolved.length)return console.log("Sudoku solved!"),n.stopSolving(),void n.setState({solved:!0});var t=n.possibleNumbersForPosition(n.state.unsolved[n.state.i]);n.state.attempts["".concat(n.state.unsolved[n.state.i].row,"-").concat(n.state.unsolved[n.state.i].column)].forEach((function(e){t.delete(e)})),(t=Object(r.a)(t)).length>0?n.nextStepIfHaveNumberChoices(t):n.nextStepIfNoNumbersLeft()},n.startSolving=function(){n.state.isSolving||n.setState({isSolving:!0,solver:setInterval(n.solveNextStep,1)})},n.stopSolving=function(){clearInterval(n.state.solver),n.setState({isSolving:!1,solver:void 0})},n.showSolvedMessage=function(){return n.state.solved?"visible":"hidden"},n.state={i:0,board:[[8,void 0,void 0,7,void 0,3,void 0,void 0,void 0],[void 0,void 0,3,6,void 0,void 0,void 0,void 0,void 0],[void 0,7,void 0,void 0,9,void 0,2,void 0,void 0],[void 0,5,void 0,void 0,void 0,7,void 0,void 0,void 0],[void 0,void 0,void 0,void 0,4,5,7,void 0,void 0],[void 0,void 0,void 0,1,void 0,void 0,void 0,3,void 0],[5,void 0,1,void 0,void 0,void 0,void 0,6,8],[void 0,void 0,8,5,void 0,void 0,void 0,1,void 0],[void 0,9,void 0,void 0,void 0,void 0,4,5,void 0]],attempts:{},unsolved:[],isSolving:!1,solver:void 0,solved:!1},n}return Object(d.a)(o,[{key:"getCellClass",value:function(t){return t>=27&&t<36||t>=54&&t<63?"cell-border-top":""}},{key:"renderNumbers",value:function(){var t=this;return this.state.board.flat().map((function(e,o){return a.a.createElement("div",{className:"cell ".concat(t.getCellClass(o)),key:"cell-".concat(o)},e)}))}},{key:"render",value:function(){return a.a.createElement("div",{className:"sudoku-board-container"},a.a.createElement("div",{className:"sudoku-board "+(this.state.solved?"completed":"")},this.renderNumbers()),a.a.createElement("p",null,"Use the buttons below to start/stop the brute force Sudoku solving process"),a.a.createElement("div",null,a.a.createElement("input",{type:"button",className:"ui button",disabled:this.state.isSolving,onClick:this.startSolving,value:"Solve"}),a.a.createElement("input",{type:"button",className:"ui button",disabled:!this.state.isSolving,onClick:this.stopSolving,value:"Pause"})),a.a.createElement("p",{className:this.showSolvedMessage()},"Solved!"))}}]),o}(a.a.Component));o(15);var m=function(){return a.a.createElement("div",{className:"app"},a.a.createElement("h1",null,"Sudoku brute-force solver"),a.a.createElement(c,null))};s.a.render(a.a.createElement(m,null),document.getElementById("root"))}],[[8,1,2]]]);
//# sourceMappingURL=main.c6c39234.chunk.js.map