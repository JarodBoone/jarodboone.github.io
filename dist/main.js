(function () {

    // cell object 
    function Cell(x,y){
        this.isAlive = false; // boolean stating if cell is alive or dead
        this.graphic = null; // the svg associated with a cell, null if dead 

        // coordinates of the cell on grid 
        this.x = x; 
        this.y = y; 
        this.neighboors = 0; 
    }

    // game of life object
    var gol = {

        //dimensions of the game board 
        width: 0, 
        height: 0,

        // height percentage for resizing (will probably be 0.90)
        hRatio: 0,

        // the number of blocks in each column or row 
        numberOfBlocks: 100,

        // calculated from dimension and number of blocks 
        blockHeight: 0,
        blockWidth: 0,

        // Matrix of all the cells in the game board
        cellMatrix: null, 

        // the svg element acting as the board d
        board: null,    

        // list of alive cells in the state of the game
        state: null, 

        // console log 
        console: $('.golConsole p'), 
        consoleLength: 0,
        useConsole: true, 

        // are we ticking? 
        running: false, 

        // reference cell for printing 
        ref: null,
        setRef: false,

        // Print to console
        printA: function (text) { 
            var pt = $('#pt').val(); // get pretext 
            this.console.append(pt + text +'<br>'); 
            // if (this.consoleLength >= 500) { 
            //     this.console.children('p').pop(); 
            // }

        },

        // Print to console without carrots
        printZ: function (text) {
            this.console.append('p').text(text);
        },

        // **** Kill Function ****
        // remove the graphic of the cell at (x,y) and delete cell 
        // from the state list if the cell is alive
        kill: function(x,y) {

            if (!this.cellMatrix[x][y].isAlive) {
                return; 
            }

            this.cellMatrix[x][y].graphic.remove();
            this.cellMatrix[x][y].graphic = null; 
            this.cellMatrix[x][y].isAlive = false; 

            var index = this.state.indexOf(this.cellMatrix[x][y]); 

            if (index > -1) { 
                this.state.splice(index,1);
            }

            return;
            
        }, 

        // **** Populate Function ****
        // add a graphic to the cell and set alive if the cell
        // is dead printFlag boolean value tellign whether or not to print to the console 
        populate: function (x,y,printFlag) { 

            if (this.cellMatrix[x][y].isAlive){
                return; 
            }  

            this.cellMatrix[x][y].isAlive = true; 
            this.cellMatrix[x][y].graphic = this.board.append('rect')
                .attr('x',x * this.blockWidth)
                .attr('y',y * this.blockHeight)
                .attr('width',this.blockWidth)
                .attr('height',this.blockHeight)
                .attr('fill','rgb(0,204,102)');     
            
            // push onto array of live cells 
            this.state.push(this.cellMatrix[x][y]); 
            
            if (this.useConsole) { 
                var cellStr;
                if (this.ref) {
                    var xOff = this.cellMatrix[x][y].x - this.ref.x;
                    var yOff = this.cellMatrix[x][y].y - this.ref.y;
                    var xSign = xOff < 0 ? '-' : '+';
                    var ySign = yOff < 0 ? '-' : '+';

                    var xAddStr = xOff == 0 ? '' : (' ' + xSign + ' ' + Math.abs(xOff));
                    var yAddStr = yOff == 0 ? '' : (' ' + ySign + ' ' + Math.abs(yOff));

                    cellStr = '(mx' + xAddStr + ',' + 'my' + yAddStr + ')';

                } else {
                    cellStr = '(' + this.cellMatrix[x][y].x + ',' + this.cellMatrix[x][y].y + ')';
                }
                this.printA(cellStr);
                this.consoleLength++;
            }
             

            return; 
        }, 


        // **** Set Reference Function ****
        // add a graphic to the cell and set alive if the cell
        // is dead 
        setReference: function (x, y) {

            if (this.cellMatrix[x][y].isAlive) {
                this.kill(this.cellMatrix[x][y].x,this.cellMatrix[x][y].y);
            }

            this.cellMatrix[x][y].isAlive = true;
            this.cellMatrix[x][y].graphic = this.board.append('rect')
                .attr('x', x * this.blockWidth)
                .attr('y', y * this.blockHeight)
                .attr('width', this.blockWidth)
                .attr('height', this.blockHeight)
                .attr('fill', 'rgb(122,30,102)');

            // push onto array of live cells 
            this.state.push(this.cellMatrix[x][y]);
            this.ref = this.cellMatrix[x][y]; 
            this.setRef = false; 

            $('#refSet').css({ 'color': 'black' }).attr({ 'data-on': 0 });
            $('#refVal').val(this.ref.x + ',' + this.ref.y); 

            var cellStr = '(' + this.cellMatrix[x][y].x + ',' + this.cellMatrix[x][y].y + ')';
            this.printA(cellStr);
            this.consoleLength++;

            return;
        }, 

        // **** Load Function ****
        // loads a specific initial state onto the gol's board
        loadState: function (state) { 

            var sx = Math.ceil(this.numberOfBlocks / 2);
            var sy = Math.ceil(this.numberOfBlocks / 2); 

            // default state
            if (!state) { 

                this.populate(sx,sy); 
                this.populate(sx + 1,sy + 1); 
                this.populate(sx - 1,sy + 1); 
                this.populate(sx, sy + 4); 
                this.populate(sx + 4, sy); 

            } else if (state == 1) { 

                this.populate(sx,sy); 
                this.populate(sx - 1,sy); 
                this.populate(sx - 2,sy); 

                this.populate(sx + 1, sy + 1); 
                this.populate(sx + 1, sy + 2); 
                this.populate(sx + 1, sy + 3); 

                this.populate(sx,sy + 5); 
                this.populate(sx - 1,sy + 5); 
                this.populate(sx - 2,sy + 5); 

                this.populate(sx - 4,sy + 5); 

            }
            
            return; 
        },

        // **** Tick Function **** 
        // apply the rules of game of life to every cell on the game board
        tick : function () { 

            // array of cells that could potentially be brought to life 
            var watch = new Array(); 
            
            // determine neighboors 
            for (var i = 0; i < this.state.length; i++){ 
                var cell = this.state[i];

                var right = cell.x + 1;
                var left = cell.x - 1; 
                var up = cell.y + 1; 
                var down = cell.y - 1; 

                // determine number of live neighboors 
                if (up >= 0  && up < this.numberOfBlocks) {
                    var north = this.cellMatrix[cell.x][up]; 

                    if (watch.includes(north) || this.state.includes(north)) {
                        north.neighboors++; 
                    } else { 
                        north.neighboors = 1; 
                        watch.push(north); 
                    }

                    if (left >= 0  && left < this.numberOfBlocks) { 
                        var west = this.cellMatrix[left][cell.y]; 
                        var northwest = this.cellMatrix[left][up]; 
    
                        if (watch.includes(west) || this.state.includes(west)) { 
                            west.neighboors++; 
                        } else { 
                            west.neighboors = 1; 
                            watch.push(west); 
                        }

                        if (watch.includes(northwest) || this.state.includes(northwest)) { 
                            northwest.neighboors++; 
                        } else { 
                            northwest.neighboors = 1; 
                            watch.push(northwest); 
                        }
                    }

                    if (right >= 0  && right < this.numberOfBlocks) { 
                        var east = this.cellMatrix[right][cell.y]; 
                        var northeast = this.cellMatrix[right][up]; 
    
                        if (watch.includes(east) || this.state.includes(east)) { 
                            east.neighboors++; 
                        } else { 
                            east.neighboors = 1; 
                            watch.push(east); 
                        }

                        if (watch.includes(northeast) || this.state.includes(northeast)) { 
                            northeast.neighboors++; 
                        } else { 
                            northeast.neighboors = 1; 
                            watch.push(northeast); 
                        }
                    }
                }

                if (down >= 0  && down < this.numberOfBlocks) { 
                    var south = this.cellMatrix[cell.x][down]; 

                    if (watch.includes(south) || this.state.includes(south)) {
                        south.neighboors++;
                    } else { 
                        south.neighboors = 1; 
                        watch.push(south); 
                    }

                    if (left >= 0  && left < this.numberOfBlocks) { 
                        var southwest = this.cellMatrix[left][down]; 
    
                        if (watch.includes(southwest) || this.state.includes(southwest)) { 
                            southwest.neighboors++; 
                        } else { 
                            southwest.neighboors = 1; 
                            watch.push(southwest); 
                        }
                    }
    
                    if (right >= 0  && right < this.numberOfBlocks) { 
                        var southeast = this.cellMatrix[right][down]; 
    
                        if (watch.includes(southeast) || this.state.includes(southeast)) { 
                            southeast.neighboors++; 
                        } else { 
                            southeast.neighboors = 1; 
                            watch.push(southeast); 
                        }
                    }
                }               
            }

            // can't kill in the loop that checks to see if we need to kill because killing
            // modifies the state array, so loop through the state and figure out which ones 
            // we need to kill and THEN kill them
            var killMe = new Array(); 

            for (var i = 0; i < this.state.length; i++) { 
                if (this.state[i].neighboors < 2 || this.state[i].neighboors > 3) {
                    killMe.push(this.state[i]); 
                }

                this.state[i].neighboors = 0; 
            }

            // can just kill all of these 
            for (var i = 0; i < killMe.length; i++) { 
                this.kill(killMe[i].x,killMe[i].y); 
            }

            this.useConsole = false; 
            for (var i = 0; i < watch.length; i++) { 
                if (watch[i].neighboors == 3) { 
                    this.populate(watch[i].x,watch[i].y); 
                }

                watch[i].neighboors = 0; 
            }
            this.useConsole = true; 

            return; 

        }, 

        // **** Clean Function ****
        // kill all cells on the current game board 
        clean : function () {
            while(this.state.length > 0) {
                this.kill(this.state[0].x,this.state[0].y); 
            }

            this.console.remove(); 
            $('.golConsole').append('<p></p>');
            this.console = $('.gol_console p'); 

            return; 
        },

        // default click handler 
        clickSingle: function() { 
            // reset click handler 
            $('.gameBoard').off("click"); 
            $('.gameBoard').click({gol: this}, function(event) { 
                event.preventDefault();
                var gol = event.data.gol;
                var boardx = $(this).offset().left;
                var boardy = $(this).offset().top;

                var mx = Math.floor((event.pageX - boardx) / gol.blockWidth);
                var my = Math.floor((event.pageY - boardy) / gol.blockHeight);


                if (gol.setRef) {
                    gol.setReference(mx,my); 

                } else {
                    if (gol.cellMatrix[mx][my].isAlive) {
                        gol.kill(mx, my);
                    } else {
                        gol.populate(mx, my);
                    }
                }  
            });
        },

        clickGlider: function () { 

            $('.gameBoard').off("click"); 

            $(".gameBoard").click({gol: this}, function (event) {  
                event.preventDefault(); 
                var gol = event.data.gol; 
                var boardx = $(this).offset().left; 
                var boardy = $(this).offset().top; 

                var mx = Math.floor((event.pageX - boardx)/gol.blockWidth); 
                var my = Math.floor((event.pageY - boardy)/gol.blockHeight);  

                
                gol.populate(mx,my); 
                gol.populate(mx - 1,my); 
                gol.populate(mx + 1,my); 
                gol.populate(mx, my - 2); 
                gol.populate(mx + 1,my - 1); 
               
            });

        }, 

        clickShip: function () { 
            $('.gameBoard').off("click"); 

            $(".gameBoard").click({gol: this}, function (event) {  
                event.preventDefault(); 
                var gol = event.data.gol; 
                var boardx = $(this).offset().left; 
                var boardy = $(this).offset().top; 

                var mx = Math.floor((event.pageX - boardx)/gol.blockWidth); 
                var my = Math.floor((event.pageY - boardy)/gol.blockHeight);  
                
                gol.populate(mx,my); 
                gol.populate(mx - 1,my); 
                gol.populate(mx - 2,my); 
                gol.populate(mx - 3,my - 1);
                gol.populate(mx - 3,my - 3);
                gol.populate(mx + 1,my); 
                gol.populate(mx + 1, my - 1); 
                gol.populate(mx + 1,my - 2); 
                gol.populate(mx,my - 3); 
            });
        },

        clickSpider: function () { 
            $('.gameBoard').off("click"); 

            $(".gameBoard").click({gol: this}, function (event) {  
                event.preventDefault(); 
                var gol = event.data.gol; 
                var boardx = $(this).offset().left; 
                var boardy = $(this).offset().top; 

                var mx = Math.floor((event.pageX - boardx)/gol.blockWidth) - 2; 
                var my = Math.floor((event.pageY - boardy)/gol.blockHeight) - 1;       
                    
                gol.populate(mx,my); 
                gol.populate(mx - 1,my); 
                gol.populate(mx - 2,my);
                gol.populate(mx + 1, my - 1); 
                gol.populate(mx + 1, my - 2); 
                gol.populate(mx + 1, my - 3); 
                gol.populate(mx,my - 5); 
                gol.populate(mx - 1,my - 5); 
                gol.populate(mx - 2,my - 5);
                gol.populate(mx - 4, my - 1); 
                gol.populate(mx - 4, my - 2); 
                gol.populate(mx - 4, my - 3); 
                
                mx = mx + 4; 
                gol.populate(mx,my); 
                gol.populate(mx + 1,my); 
                gol.populate(mx + 2,my);
                gol.populate(mx - 1, my - 1); 
                gol.populate(mx - 1, my - 2); 
                gol.populate(mx - 1, my - 3); 
                gol.populate(mx,my - 5); 
                gol.populate(mx + 1,my - 5); 
                gol.populate(mx + 2,my - 5);
                gol.populate(mx + 4, my - 1); 
                gol.populate(mx + 4, my - 2); 
                gol.populate(mx + 4, my - 3); 

                my = my + 2; 
                gol.populate(mx,my); 
                gol.populate(mx + 1,my); 
                gol.populate(mx + 2,my);
                gol.populate(mx - 1, my + 1); 
                gol.populate(mx - 1, my + 2); 
                gol.populate(mx - 1, my + 3); 
                gol.populate(mx,my + 5); // switch to negative for dance 
                gol.populate(mx + 1,my + 5); 
                gol.populate(mx + 2,my + 5);
                gol.populate(mx + 4, my + 1); 
                gol.populate(mx + 4, my + 2); 
                gol.populate(mx + 4, my + 3); 

                mx = mx - 4; 
                gol.populate(mx,my); 
                gol.populate(mx - 1,my); 
                gol.populate(mx - 2,my);
                gol.populate(mx + 1, my + 1); 
                gol.populate(mx + 1, my + 2); 
                gol.populate(mx + 1, my + 3); 
                gol.populate(mx,my + 5); // switch to negative for dance
                gol.populate(mx - 1,my + 5); 
                gol.populate(mx - 2,my + 5);
                gol.populate(mx - 4, my + 1); 
                gol.populate(mx - 4, my + 2); 
                gol.populate(mx - 4, my + 3); 
            });
        },

        clickBlock: function () { 
            $('.gameBoard').off("click"); 

            $(".gameBoard").click({gol: this}, function (event) {  
                event.preventDefault(); 
                var gol = event.data.gol; 
                var boardx = $(this).offset().left; 
                var boardy = $(this).offset().top; 

                var mx = Math.floor((event.pageX - boardx)/gol.blockWidth); 
                var my = Math.floor((event.pageY - boardy)/gol.blockHeight);  
                
                gol.populate(mx,my); 
                gol.populate(mx,my - 1);
                gol.populate(mx - 1,my); 
                gol.populate(mx - 1,my - 1);
                
            });
        },

        clickDonut: function () { 
            $('.gameBoard').off("click"); 

            $(".gameBoard").click({gol: this}, function (event) {  
                event.preventDefault(); 
                var gol = event.data.gol; 
                var boardx = $(this).offset().left; 
                var boardy = $(this).offset().top; 

                var mx = Math.floor((event.pageX - boardx)/gol.blockWidth); 
                var my = Math.floor((event.pageY - boardy)/gol.blockHeight);  
                
                gol.populate(mx,my); 
                gol.populate(mx - 1,my - 1);
                gol.populate(mx - 1,my - 2); 
                gol.populate(mx,my - 3);
                gol.populate(mx + 1,my - 1);
                gol.populate(mx + 1,my - 2);
                
            });
        },

        clickHandle: function () { 
            $('.gameBoard').off("click"); 

            $(".gameBoard").click({gol: this}, function (event) {  
                event.preventDefault(); 
                var gol = event.data.gol; 
                var boardx = $(this).offset().left; 
                var boardy = $(this).offset().top; 

                var mx = Math.floor((event.pageX - boardx)/gol.blockWidth); 
                var my = Math.floor((event.pageY - boardy)/gol.blockHeight) - 1;  
                
                gol.populate(mx,my); 
                gol.populate(mx - 1,my);
                gol.populate(mx - 2,my + 1); 
                gol.populate(mx - 1,my + 2);
                gol.populate(mx,my + 3);
                gol.populate(mx + 1,my + 2);
                gol.populate(mx + 1,my + 1);
                
            });
        },

        clickGull: function () { 

            $('.gameBoard').off("click"); 

            $(".gameBoard").click({gol: this}, function (event) {  
                event.preventDefault(); 
                var gol = event.data.gol; 
                var boardx = $(this).offset().left; 
                var boardy = $(this).offset().top; 

                var mx = Math.floor((event.pageX - boardx)/gol.blockWidth) - 1; 
                var my = Math.floor((event.pageY - boardy)/gol.blockHeight);  
                
                gol.populate(mx,my); 
                gol.populate(mx,my + 1);
                gol.populate(mx + 1,my + 2); 
                gol.populate(mx + 3,my + 1);
                gol.populate(mx + 3,my);
                gol.populate(mx + 2,my - 1);

            }); 
        },

        clickRocket: function () {

            $('.gameBoard').off("click");

            $(".gameBoard").click({ gol: this }, function (event) {
                event.preventDefault();
                var gol = event.data.gol;
                var boardx = $(this).offset().left;
                var boardy = $(this).offset().top;

                var mx = Math.floor((event.pageX - boardx) / gol.blockWidth) - 1;
                var my = Math.floor((event.pageY - boardy) / gol.blockHeight);

                gol.populate(mx, my);
                gol.populate(mx + 1, my);
                gol.populate(mx + 2, my);
                gol.populate(mx - 1, my);
                gol.populate(mx, my + 1);
                gol.populate(mx + 1, my + 1);
                gol.populate(mx - 1, my - 1);
                gol.populate(mx + 2, my - 1);
                gol.populate(mx - 1, my - 4);
                gol.populate(mx + 2, my - 4);
                gol.populate(mx + 2, my - 5);
                gol.populate(mx - 1, my - 5);
                gol.populate(mx, my - 6);
                gol.populate(mx + 1, my - 6);
                gol.populate(mx - 2, my - 6);
                gol.populate(mx - 2, my - 7);
                gol.populate(mx - 2, my - 8);
                gol.populate(mx + 3, my - 6);
                gol.populate(mx + 3, my - 7);
                gol.populate(mx + 3, my - 8);
                gol.populate(mx - 1, my - 9);
                gol.populate(mx - 1, my - 10);
                gol.populate(mx, my - 10);
                gol.populate(mx + 1, my - 10);
                gol.populate(mx + 2, my - 10);
                gol.populate(mx + 2, my - 9);
                gol.populate(mx + 2, my - 11);
                gol.populate(mx + 2, my - 12);
                gol.populate(mx + 3, my - 12);
                gol.populate(mx + 3, my - 11);
                gol.populate(mx - 1, my - 11);
                gol.populate(mx - 1, my - 12);
                gol.populate(mx - 2, my - 12);
                gol.populate(mx - 2, my - 11);
                gol.populate(mx, my - 14);
                gol.populate(mx, my - 15);
                gol.populate(mx, my - 16);
                gol.populate(mx + 1, my - 16);
                gol.populate(mx + 1, my - 15);
                gol.populate(mx + 1, my - 14);
                gol.populate(mx + 3, my - 16);
                gol.populate(mx + 4, my - 17);
                gol.populate(mx + 5, my - 16);
                gol.populate(mx + 5, my - 15);
                gol.populate(mx + 4, my - 15);
                gol.populate(mx - 2, my - 16);
                gol.populate(mx - 3, my - 17);
                gol.populate(mx - 4, my - 16);
                gol.populate(mx - 4, my - 15);
                gol.populate(mx - 3, my - 15);
                gol.populate(mx, my + 5);
                gol.populate(mx + 1, my + 5);
                gol.populate(mx, my + 6);
                gol.populate(mx + 1, my + 6);
                gol.populate(mx + 2, my + 5);
                gol.populate(mx - 1, my + 5);
                gol.populate(mx + 3, my + 4);
                gol.populate(mx + 4, my + 4);
                gol.populate(mx + 5, my + 4);
                gol.populate(mx + 6, my + 4);
                gol.populate(mx + 7, my + 4);
                gol.populate(mx + 5, my + 5);
                gol.populate(mx + 6, my + 6);
                gol.populate(mx + 6, my + 3);
                gol.populate(mx + 6, my + 2);
                gol.populate(mx + 6, my + 1);
                gol.populate(mx + 7, my + 1);
                gol.populate(mx + 8, my + 3);
                gol.populate(mx + 8, my);
                gol.populate(mx + 8, my - 1);
                gol.populate(mx + 8, my - 2);
                gol.populate(mx + 7, my - 1);
                gol.populate(mx - 2, my + 4);
                gol.populate(mx - 3, my + 4);
                gol.populate(mx - 4, my + 4);
                gol.populate(mx - 5, my + 4);
                gol.populate(mx - 6, my + 4);
                gol.populate(mx - 7, my + 3);
                gol.populate(mx - 5, my + 3);
                gol.populate(mx - 5, my + 2);
                gol.populate(mx - 5, my + 1);
                gol.populate(mx - 6, my + 1);
                gol.populate(mx - 4, my + 5);
                gol.populate(mx - 5, my + 6);
                gol.populate(mx - 7, my);
                gol.populate(mx - 7, my - 1);
                gol.populate(mx - 7, my - 2);
                gol.populate(mx - 6, my - 1);
                gol.populate(mx - 1, my + 7);
                gol.populate(mx + 2, my + 7);
                gol.populate(mx, my + 8);
                gol.populate(mx + 1, my + 8);
                gol.populate(mx, my + 9);
                gol.populate(mx + 1, my + 9);
                gol.populate(mx + 3, my + 9);
                gol.populate(mx + 4, my + 9);
                gol.populate(mx - 2, my + 9);
                gol.populate(mx - 3, my + 9);
                gol.populate(mx - 4, my + 11);
                gol.populate(mx - 4, my + 12);
                gol.populate(mx - 5, my + 12);
                gol.populate(mx - 3, my + 12);
                gol.populate(mx - 2, my + 13);
                gol.populate(mx - 5, my + 13);
                gol.populate(mx - 5, my + 14);
                gol.populate(mx - 6, my + 14);
                gol.populate(mx + 5, my + 11);
                gol.populate(mx + 4, my + 12);
                gol.populate(mx + 5, my + 12);
                gol.populate(mx + 6, my + 12);
                gol.populate(mx + 3, my + 13);
                gol.populate(mx + 6, my + 13);
                gol.populate(mx + 6, my + 14);
                gol.populate(mx + 7, my + 14);

            });
        },

        // function to add mouse handlers to the game board UI 
        mouseHandlers : function () { 
            
            // add click handler 
            this.clickSingle(); 
            
            $('.btn').mouseover(function(event) { 
                $(event.target).css('color','orange'); 
            }); 

            $('.btn').mouseout(function(event) { 
                if ($(event.target).attr("data-on") == 1) { 
                    return; 
                }
                $(event.target).css('color','black'); 
            });

            $('#tick').click({gol: this}, function(event) { 
                event.data.gol.tick(); 
            }); 

            $('#run').click({gol: this}, function(event) {
                //alert("running"); 
                var gol = event.data.gol; 
                $(event.target).css({'color': 'orange'}); 
                
                gol.running = true; 
                $(event.target).attr({"data-on": 1}); 

                (function ticker() {

                    if (!gol.running || !gol.state.length) {
                        $(event.target).css({'color': 'initial'}); 
                        $(event.target).attr({'data-on': 0}); 
                        return; 
                    }

                    gol.tick(); 

                    setTimeout(function() {
                        ticker(); 
                    },100); 
                })(); 
            }); 

            $('#refSet').click({gol: this}, function(event) { 
                // reset pattern buttons
                $('.pattern').css({ 'color': 'black' }).attr({ 'data-on': 0 });
                $('#single').css({ 'color': 'orange' });
                $('#single').attr({ 'data-on': 1 }); 

                $(event.target).css({ 'color': 'orange' });
                $(event.target).attr({ 'data-on': 1 }); 

                event.data.gol.setRef = true; 

                event.data.gol.clickSingle(); 

            });

            $('#refRem').click({gol: this}, function() { 
                event.data.gol.kill(gol.ref.x,gol.ref.y); 
                $('#refVal').val(''); 
                event.data.gol.ref = null; 
            }); 

            $('#stop').click({gol: this}, function(event) { 
                event.data.gol.running = false; 
                $('#run').attr({"data-on": 0}); 
            }); 

            $('#clean').click({gol: this}, function (event) {
                event.data.gol.clean(); 
            }); 

            $('#single').click({gol: this}, function (event) { 
                // reset pattern buttons 
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});    
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                //attach single click 
                event.data.gol.clickSingle(); 
            }); 

            $('#glider').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch glider click
                event.data.gol.clickGlider(); 
            }); 

            $('#ship').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch ship click
                event.data.gol.clickShip(); 
            }); 


            $('#spider').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch spider click
                event.data.gol.clickSpider(); 
            }); 

            $('#block').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch block click
                event.data.gol.clickBlock(); 
            }); 

            $('#donut').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch donut click
                event.data.gol.clickDonut(); 
            }); 

            $('#handle').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch handle click
                event.data.gol.clickHandle(); 
            }); 

            $('#gull').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch gull click
                event.data.gol.clickGull(); 
            });

            $('#rocket').click({ gol: this }, function (event) {
                // reset pattern buttons
                $('.pattern').css({ 'color': 'black' }).attr({ 'data-on': 0 });
                $(event.target).css({ 'color': 'orange' });
                $(event.target).attr({ 'data-on': 1 });

                // attatch gull click
                event.data.gol.clickRocket();
            });

        },

        //fucntion to resize the game board based on the gol_container dimensions 
        resize : function () { 
            // copy the state to reapply 
            var temp = this.state.slice(); 
            this.clean(); 
            this.board.remove(); 

            this.height = Math.floor($('.gol_container').parent().height() * this.hRatio); 
            this.width = this.height;
            this.blockHeight = this.height / this.numberOfBlocks;
            this.blockWidth = this.width / this.numberOfBlocks;

            // have to use jquery to set the game_board elements for some reason because
            // D3 does not want to cooperate 
            $('.gameBoard').css({
                "width": this.width,
                "height": this.height
            });

            this.board = d3.select('.gameBoard').append('svg');

            // size the game board to the given width and height
            this.board.attr('width', this.width)
                .attr('height', this.height);

            // create the grid
            for (var row = 0; row <= this.numberOfBlocks; row++) {

                this.board.append('svg:line')
                    .attr('x1', 0)
                    .attr('y1', row * this.blockHeight)
                    .attr('x2', this.width)
                    .attr('y2', row * this.blockHeight)
                    .style("stroke", "rgba(95, 95, 95, 0.178)")
                    .style("stroke-width", 1);

                this.board.append('svg:line')
                    .attr('x1', row * this.blockWidth)
                    .attr('y1', 0)
                    .attr('x2', row * this.blockWidth)
                    .attr('y2', this.height)
                    .style("stroke", "rgba(95, 95, 95, 0.178)")
                    .style("stroke-width", 1);

            } 

            //alert(temp.length); 

            for (var i = 0; i < temp.length; i++) { 
                this.populate(temp[i].x,temp[i].y); 
            }

        }, 

        // need to call this function before any the board is used 
        init : function () {
            // set dimensions of the game board
            this.hRatio = $('.golContainer').height() / 100; 
            this.height = Math.floor($('.golContainer').parent().height() * this.hRatio); 
            this.width = this.height; 

            // determine the blockHeight and block width
            this.blockHeight = this.height/this.numberOfBlocks; 
            this.blockWidth = this.width/this.numberOfBlocks;

            // initialize live cell list
            this.state = new Array();

            // have to use jquery to set the game_board elements for some reason because
            // D3 does not want to cooperate 
            $('.gameBoard').css({ 
                "width": this.width,
                "height": this.height
            });  

            this.board = d3.select('.gameBoard').append('svg'); 

            // size the game board to the given width and height
            this.board.attr('width', this.width)
                .attr('height', this.height); 

            // initialize cell matrix rows 
            this.cellMatrix = new Array(this.numberOfBlocks); 

            // create the grid
            for (var row = 0; row <= this.numberOfBlocks; row++) {

            
                this.board.append('svg:line')
                .attr('x1',0)
                .attr('y1',row * this.blockHeight)
                .attr('x2', this.width)
                .attr('y2',row * this.blockHeight)
                .style("stroke", "rgba(95, 95, 95, 0.178)")
                .style("stroke-width", 1); 

                this.board.append('svg:line')
                .attr('x1',row * this.blockWidth)
                .attr('y1',0)
                .attr('x2', row * this.blockWidth)
                .attr('y2', this.height)
                .style("stroke", "rgba(95, 95, 95, 0.178)")
                .style("stroke-width", 1); 
            

                // initialize cell Matrix columns 
                this.cellMatrix[row] = new Array(this.numberOfBlocks); 
                for (var col = 0; col < this.numberOfBlocks; col++) {
                    this.cellMatrix[row][col] = new Cell(row,col); 
                }
            } 

            this.mouseHandlers();  
            
            //alert('where'); 
            $('#single').css({'color':'orange'}).attr({'data-on': 1}); 
            this.loadState(null); 

            $(window).resize({gol: this}, function(event) {  
                gol.resize(); 
            });
        }
    };

    var a = gol.init(); 

}());


// function to get url query parameters by query name 
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
$(document).ready(function () {

    var t1 = $('.display.item.t1');
    var t2 = $('.display.item.t2');
    var t3 = $('.display.item.t3');
    var t4 = $('.display.item.t4');

    var t1_s = $('.menu.item.t1');
    var t2_s = $('.menu.item.t2');
    var t3_s = $('.menu.item.t3');
    var t4_s = $('.menu.item.t4');

    var tabs = [t1, t2, t3, t4];
    var selectors = [t1_s, t2_s, t3_s, t4_s];
    var header = $('.header');

    var default_tab = 0;
    var base_tab_bd = '#dcdcdc';
    var sel_tab_bc = '#466666';

    var border_width = '5px';
    var border_enlarge = '15px';

    // if we were passed a tab query we will use that
    // **vestigial**
    var tab = getParameterByName('tab');

    // otherwise we will start at the default tab 
    if (!tab) {
        tab = default_tab;
    }

    selectors.forEach(function (slc) {
        slc.mouseover(function (tabs) {
            slc.css({ 
                'background-color': sel_tab_bc,
                'border-bottom-color': slc.attr('data-bd-color'),
                'border-bottom-width': border_enlarge,
                'color': slc.attr('data-bd-color')
            }); 
            
        });

        slc.mouseout(function (tabs) {
            if (tab != slc.attr('data-tab')) {
                slc.css({ 
                    'background-color': 'transparent',
                    'border-bottom-color': base_tab_bd,
                    'border-bottom-width': border_width,
                    'color': 'black'
                });
            }
        });
    });


    tabs[tab].css({ 'display': 'block' });
    header.css({ 'background-color': selectors[tab].attr('data-bd-color') });
    selectors[tab].css({ 
        'background-color': sel_tab_bc,
        'border-bottom-color': selectors[tab].attr('data-bd-color'),
        'border-bottom-width': border_enlarge,
        'color': selectors[tab].attr('data-bd-color')
    });


    $('.menu.item').click(function (event) {

        event.preventDefault();
        var target = $(event.target);

        temp = target.attr('data-tab'); 

        if (temp == tab) {
            gol.init(); 
            return; 
        }

        tabs[tab].fadeOut(200);
        selectors[tab].css({
            'background-color': 'transparent',
            'border-bottom-color': base_tab_bd,
            'border-bottom-width': border_width,
            'color': 'black'
        });

        tab = target.attr('data-tab');

        selectors[tab].css({
            'background-color': sel_tab_bc,
            'border-bottom-color': selectors[tab].attr('data-bd-color'),
            'border-bottom-width': border_enlarge,
            'color': selectors[tab].attr('data-bd-color')
        });

        header.animate({backgroundColor: selectors[tab].attr('data-bd-color')});

        setTimeout(function () {
            tabs[tab].fadeIn(200);
        }, 201);

    });


});