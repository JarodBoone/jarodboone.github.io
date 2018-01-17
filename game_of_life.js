(function () {

    // cell object 
    function Cell(x,y){
        this.isAlive = false; 
        this.graphic = null; 
        this.x = x; 
        this.y = y; 
        this.neighboors = 0; 
    }

    var gol = {

        width: 450, 
        height: 450,

        numberOfBlocks: 75,

        blockHeight: 0,
        blockWidth: 0,

        // initialize in init function 
        cellMatrix: null, 
        board: null,    
        state: null, // list of alive cells in the state of the game 

        // are we ticking? 
        running: false, 

        // if the cell at x,y is alive remove its graphic 
        kill: function(x,y) {

            if (!this.cellMatrix[x][y].isAlive) {
                return; 
            }

            this.cellMatrix[x][y].graphic.remove();
            this.cellMatrix[x][y].isAlive = false; 

            var index = this.state.indexOf(this.cellMatrix[x][y]); 

            if (index > -1) { 
                this.state.splice(index,1);
            }

            return;
            
        }, 

        // if the cell at x,y is not alive add a graphic
        populate: function (x,y) { 

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

            return; 
        }, 

        loadState: function (state) { 

            // default state
            if (!state) { 
                var sx = Math.ceil(this.numberOfBlocks/2); 
                var sy = Math.ceil(this.numberOfBlocks/2); 

                this.populate(sx,sy); 
                this.populate(sx + 1,sy + 1); 
                this.populate(sx - 1,sy + 1); 
                this.populate(sx, sy + 4); 
                this.populate(sx + 4, sy); 
            } else if (state == 1) { 
                var sx = Math.ceil(this.numberOfBlocks/2); 
                var sy = Math.ceil(this.numberOfBlocks/2); 

                this.populate(sx,sy); 
                this.populate(sx - 1,sy); 
                this.populate(sx - 2,sy); 

                this.populate(sx + 1, sy + 1); 
                this.populate(sx + 1, sy + 2); 
                this.populate(sx + 1, sy + 3); 

                this.populate(sx,sy + 5); 
                this.populate(sx - 1,sy + 5); 
                this.populate(sx - 2,sy + 5); 

                this.populate(sx - 4,)


            }
            
            return; 
        },

        tick : function () { 

            // array of cells that could potentially be brought to life 
            var watch = new Array(); 
            
            // determine neighboors 
            for (var i = 0; i < this.state.length; i++){ 
                var cell = this.state[i]

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

                //alert(this.state[i].x + ' ' + this.state[i].y + ' has ' + this.state[i].neighboors);
            }

            for (var i = 0; i < killMe.length; i++) { 
                this.kill(killMe[i].x,killMe[i].y); 
            }

            // can just kill all of these 
            for (var i = 0; i < watch.length; i++) { 
                if (watch[i].neighboors == 3) { 
                    this.populate(watch[i].x,watch[i].y); 
                }

                watch[i].neighboors = 0; 
            }

            return; 

        }, 

        // remove all live cells on the board 
        clean : function () {
            while(this.state.length > 0) {
                this.kill(this.state[0].x,this.state[0].y); 
            }

            return; 
        },

        // default click handler 
        baseClick: function() { 
            // reset click handler 
            $('.game_board').off("click"); 
            $('.game_board').off("mouseover"); 
            $('.game_board').off("mouseout"); 
            $('.game_board').click({gol: this}, function(event) { 
                event.preventDefault; 
                var gol = event.data.gol; 
                var boardx = $(this).offset().left; 
                var boardy = $(this).offset().top; 

                var mx = Math.floor((event.pageX - boardx)/gol.blockWidth); 
                var my = Math.floor((event.pageY - boardy)/gol.blockHeight); 
                
                if (gol.cellMatrix[mx][my].isAlive){
                    gol.kill(mx,my); 
                } else { 
                    gol.populate(mx,my); 
                }
            });
        },

        clickGlider: function () { 

            $('.game_board').off("click"); 

            $(".game_board").click({gol: this}, function (event) {  
                event.preventDefault; 
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
            $('.game_board').off("click"); 

            $(".game_board").click({gol: this}, function (event) {  
                event.preventDefault; 
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
            $('.game_board').off("click"); 

            $(".game_board").click({gol: this}, function (event) {  
                event.preventDefault; 
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
            $('.game_board').off("click"); 

            $(".game_board").click({gol: this}, function (event) {  
                event.preventDefault; 
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
            $('.game_board').off("click"); 

            $(".game_board").click({gol: this}, function (event) {  
                event.preventDefault; 
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
            $('.game_board').off("click"); 

            $(".game_board").click({gol: this}, function (event) {  
                event.preventDefault; 
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

        // function to add mouse handlers to the game board UI 
        mouseHandlers : function () { 
            
            // add click handler 
            this.baseClick(); 
            

            $('.btn').mouseover(function(event) { 
                $(event.target).css('color','orange'); 
            }); 

            $('.btn').mouseout(function(event) { 
                if ($(event.target).attr("data-on") == 1) { 
                    return; 
                }
                $(event.target).css('color','black'); 
            })

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

                //attach base click 
                gol.baseClick(); 
            }); 

            $('#glider').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch glider click
                gol.clickGlider(); 
            }); 

            $('#ship').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch glider click
                gol.clickShip(); 
            }); 


            $('#spider').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch glider click
                gol.clickSpider(); 
            }); 

            $('#block').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch glider click
                gol.clickBlock(); 
            }); 

            $('#donut').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch glider click
                gol.clickDonut(); 
            }); 

            $('#handle').click({gol: this}, function (event) { 
                // reset pattern buttons
                $('.pattern').css({'color': 'black'}).attr({'data-on' : 0});  
                $(event.target).css({'color':'orange'}); 
                $(event.target).attr({'data-on' : 1}); 

                // attatch glider click
                gol.clickHandle(); 
            }); 



        },

        // need to call this function before any the board is used 
        init : function () {
            // determine the blockHeight and block width
            this.blockHeight = this.height/this.numberOfBlocks; 
            this.blockWidth = this.width/this.numberOfBlocks;

            // initialize live cell list
            this.state = new Array();

            // have to use jquery to set the game_board elements for some reason because
            // D3 does not want to cooperate 
            $('.game_board').css({ 
                "width": this.width,
                "height": this.height
            });  

            this.board = d3.select('.game_board').append('svg'); 

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
            
            $('#single').css({'color':'orange'}).attr({'data-on': 1}); 
            this.loadState(null); 

        }
    };

    gol.init(); 

}());

