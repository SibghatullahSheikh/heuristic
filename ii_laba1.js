'use strict';
(function(window){
	var td = window.document.querySelectorAll('table#sudoku > tbody > tr > td');
	for(var i=0; i<td.length; i++){
		if(td[i].textContent != '')
			td[i].classList.add('assigned');
	}
	var rows = window.document.querySelectorAll('table#sudoku > tbody > tr');
	var matrixOfLeadership = new Array(rows.length);
	for(i=0; i<rows.length; i++){
		matrixOfLeadership[i] = new Array(rows.length);
		var cols = window.document.querySelectorAll('table#sudoku > tbody > tr:nth-of-type('+(i+1)+') > td');
		for(var j=0; j<cols.length; j++){
			matrixOfLeadership[i][j] = cols[j].textContent;
		}
	}		
	var matrixOfHits = new Array(rows.length);
	for(i=0; i<rows.length; i++){
		matrixOfHits[i] = new Array(rows.length);
		for(j=0; j<rows.length; j++){
			matrixOfHits[i][j] = new Array(rows.length);
		}
	}
	function getHits(){
		for(var i=0; i<rows.length; i++){
			for(var j=0; j<rows.length; j++){
				for(var k=0; k<rows.length; k++){
					dance:
					do{
						if(matrixOfLeadership[j][k] != ''){
							matrixOfHits[i][j][k] = false;
							break;
						}
						var desiredNumber = i+1;
						for(var q=0; q<rows.length; q++){
							if(matrixOfLeadership[j][q] == desiredNumber){
								matrixOfHits[i][j][k] = false;
								break dance;
							}
						}
						for(q=0; q<rows.length; q++){
							if(matrixOfLeadership[q][k] == desiredNumber){
								matrixOfHits[i][j][k] = false;
								break dance;
							}
						}
						if ((k+1) % 3 == 0)
							var desiredK = (k+1)/3 - 1;
						else if((k+1)/3 > Math.floor((k+1)/3))
							desiredK = Math.floor((k+1)/3);
						else
							desiredK = Math.floor((k+1)/3);
						
						if((j+1) % 3 == 0)
							var desiredJ = (j+1)/3 - 1;
						else if((j+1)/3 > Math.floor((j+1)/3))
							desiredJ = Math.floor((j+1)/3);
						else
							desiredJ = Math.floor((j+1)/3);
						
						for(var initialNumberLine=desiredJ*3, finiteNumberLine=initialNumberLine+3; initialNumberLine<finiteNumberLine; initialNumberLine++){
							for(var initialNumberColumn=desiredK*3, finiteNumberColumn=initialNumberColumn+3; initialNumberColumn<finiteNumberColumn; initialNumberColumn++){
								if((i+1) == matrixOfLeadership[initialNumberLine][initialNumberColumn]){
									matrixOfHits[i][j][k] = false;
									break dance;
								}
							}
						}
						
						matrixOfHits[i][j][k] = true;
					}while(0)
				}
			}
		}
	}
	var numberOfHits;
	function zeroingOfNumberOfHits(){
		numberOfHits = new Array(rows.length);
		for(i=0; i<rows.length; i++){
			numberOfHits[i] = new Array(rows.length);
			for(j=0; j<rows.length; j++)
				numberOfHits[i][j] = 0;
		}
	}
	function getNumberOfHits(){
		for(var i=0; i<rows.length; i++){
			for(var j=0; j<rows.length; j++){
				for(var k=0; k<rows.length; k++){
					if(matrixOfHits[i][j][k])
						numberOfHits[j][k]++;
						window.document.querySelector('table#hits > tbody > tr:nth-of-type('+(j+1)+') td:nth-of-type('+(k+1)+')').textContent = numberOfHits[j][k];
				}
			}
		}
	}
	function searchMinimumHit(){
		var minHit = Math.max.apply(null, numberOfHits[0].filter(function(element, index, array){
			return (element != 0);
		}));
		var indexHit = false;
		for(var i=0; i<rows.length; i++){
			for(var j=0; j<rows.length; j++){
				if(numberOfHits[i][j] <= minHit && numberOfHits[i][j] != 0){
					minHit = numberOfHits[i][j];
					indexHit = [i, j];
				}
			}
		}
		tdHits = window.document.querySelector('table#hits > tbody > tr:nth-of-type('+(indexHit[0]+1)+') td:nth-of-type('+(indexHit[1]+1)+')');
		tdHits.classList.add('hit');
		return indexHit;
	}
	function insertNumber(indexHit){
		if(indexHit){
			for(var i=0; i<rows.length; i++){
				if(matrixOfHits[i][indexHit[0]][indexHit[1]]){
					matrixOfLeadership[indexHit[0]][indexHit[1]] = (i+1);
					tdSudoku = window.document.querySelector('table#sudoku > tbody > tr:nth-of-type('+(indexHit[0]+1)+') > td:nth-of-type('+(indexHit[1]+1)+')');
					tdSudoku.textContent = (i+1);
					tdSudoku.classList.add('hit');
					return true;
				}
			}
		}
		else
			return false;
	}	
	
	var tdSudoku, tdHits;
	
	function run(){
		if(typeof tdHits !='undefined'){
			tdHits.classList.remove('hit');
			tdSudoku.classList.remove('hit');
		}
		getHits();
		zeroingOfNumberOfHits();
		getNumberOfHits();
		searchMinimumHit();
		if(insertNumber(searchMinimumHit()))
			setTimeout(run, 1000);
		
	}
	run();
})(window);
