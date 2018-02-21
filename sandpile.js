// implement the sand pile probably will be similair to game of life
// for init and resize 


//fucntion to resize the game board based on the gol_container dimensions 
resize: function () {
    // copy the state to reapply 
    var temp = this.state.slice();
    this.clean();
    this.board.remove();

    this.height = Math.floor($('.golContainer').parent().height() * this.hRatio);
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
        this.populate(temp[i].x, temp[i].y);
    }

}, 

// need to call this function before any the board is used 
init: function () {
    // set dimensions of the game board
    this.hRatio = $('.golContainer').height() / 100;
    this.height = Math.floor($('.golContainer').parent().height() * this.hRatio);
    this.width = this.height;

    // determine the blockHeight and block width
    this.blockHeight = this.height / this.numberOfBlocks;
    this.blockWidth = this.width / this.numberOfBlocks;

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


        // initialize cell Matrix columns 
        this.cellMatrix[row] = new Array(this.numberOfBlocks);
        for (var col = 0; col < this.numberOfBlocks; col++) {
            this.cellMatrix[row][col] = new Cell(row, col);
        }
    }

    this.mouseHandlers();

    //alert('where'); 
    $('#single').css({ 'color': 'orange' }).attr({ 'data-on': 1 });
    this.loadState(null);

    $(window).resize({ gol: this }, function (event) {
        gol.resize();
    });
}
    };