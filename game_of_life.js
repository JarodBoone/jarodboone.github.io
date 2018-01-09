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

        numberOfBlocks: 45,

        blockHeight: 0,
        blockWidth: 0,

        // initialize in init function 
        cellMatrix: null, 
        board: null,    
        state: null, // list of alive cells in the state of the game 

        // if the cell at x,y is alive remove its graphic 
        kill: function(x,y) {

            if (!this.cellMatrix[x][y].isAlive) {
                return; 
            }

            this.cellMatrix[x][y].graphic.remove();
            this.cellMatrix[x][y].isAlive = false; 

            this.state.splice(this.state.indexOf(this.cellMatrix[x][y],1));
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
        }, 

        loadState: function (state) { 

            // default state
            if (!state) { 
                var sx = Math.ceil(this.numberOfBlocks/2); 
                var sy = Math.ceil(this.numberOfBlocks/2); 

                this.populate(sx,sy); 
                this.populate(sx + 1,sy + 1); 
                this.populate(sx, sy + 4); 
                this.populate(sx + 4, sy); 
            }

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
                    .style("stroke", "rgb(0,0,0)")
                    .style("stroke-width", 1); 

                this.board.append('svg:line')
                    .attr('x1',row * this.blockWidth)
                    .attr('y1',0)
                    .attr('x2', row * this.blockWidth)
                    .attr('y2', this.height)
                    .style("stroke", "rgb(0,0,0)")
                    .style("stroke-width", 1); 

                // initialize cell Matrix columns 
                this.cellMatrix[row] = new Array(this.numberOfBlocks); 
                for (var col = 0; col < this.numberOfBlocks; col++) {
                    this.cellMatrix[row][col] = new Cell(row,col); 
                }
            } 

            // add click handler 
            $('.game_board').click({gol: this}, function(event) { 
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

            this.loadState(0); 

        }
    };

    gol.init(); 

}());

