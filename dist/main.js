
// AJAX EXAMPLE ***********
// (function update() {
//     $.ajax({
//         dataType: 'json',
//         url: url,
//         async: false,
//         success: function (data) {
//             $ticker.text('$' + addCommas(data.USD.last));
//         }

//     }).then(function () {
//         setTimeout(update, duration);
//     });
// })();


function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function genCoinTab(coin) {

    // target data
    var cPrice = addCommas(coin.price_usd);
    var cName = coin.name; 
    var cSym = coin.symbol;
    var c1h = coin.percent_change_1h; 
    var cGrow = c1h.charAt(0) == '-' ? false : true; 
    
    if(cGrow) { 
        c1h = '+' + c1h; 
    }

    // generate list element
    var coinTab = '<li id=' + cSym + '></li>'; 
    $('.cryptoList').append(coinTab);
    coinTab = $('#' + cSym); 

    // coinTab.css({
    //     'width': '90%',
    //     'display': 'flex', 
    //     'flex-direction': 'horizontal',
    //     'justify-content': 'space-evenly',
    //     'margin': '10px'
    // })

    // generate title element
    coinTab.append('<div class=\"cTitle\" id=' + cSym + '>' + cName + '</div>');

    // generate price element
    coinTab.append('<div class=\"cPrice\" id=' + cSym + '>' + cPrice + '$\t\t\t' + c1h +'$ </div>'); 

    $('#' + cSym).css({
        'cursor': 'pointer'
        //'background-color': 'rgba(0, 204, 102, 0.5)'
    });

    $('#' + cSym + ' .cPrice').css({
        'cursor': 'pointer'
        //'background-color': 'rgba(0, 204, 102, 0.5)'
    });

    $('#' + cSym + ' .cTitle').css({
        'cursor': 'pointer'
        //'background-color': 'rgba(0, 204, 102, 0.5)'
    });

    if (cGrow) {
        $('#' + cSym + ' .cPrice').css({
            'color': 'rgb(0, 204, 102)'
            //'background-color': 'rgba(0, 204, 102, 0.5)'
        });
    } else {
        $('#' + cSym + ' .cPrice').css({
            'color': 'rgb(204, 58, 0)'
            //'background-color': 'rgba(204, 58, 0, 0.5)'
        });
    }
}

function updateCoinTab(coin) {

    // target data
    var cPrice = addCommas(coin.price_usd);
    var cName = coin.name;
    var cSym = coin.symbol;
    var c1h = coin.percent_change_1h;
    var cGrow = c1h.charAt(0) == '-' ? false : true;

    var coinPrice = $('#' + cSym + ' .cPrice');

    if (cGrow) {
        c1h = '+' + c1h;
        coinPrice.css({ 
            'color': 'rgb(0, 204, 102)'
            //'background-color': 'rgba(0, 204, 102, 0.5)'
        });
    } else {
        coinPrice.css({ 
            'color': 'rgb(204, 58, 0)'
            //'background-color': 'rgba(204, 58, 0, 0.5)'
        });
    }

    // generate price element$('#' + cSym + ' .cPrice')
    coinPrice.text(cPrice + '$\t\t\t' + c1h +'$');

}

var firstLoad = true; 


(function getCryptoData() { 
    var url = 'https://api.coinmarketcap.com/v1/ticker/'; 
    var duration = 10000; 
    var counter = 0; 

    $.ajax({
        dataType: 'json',
        url: url, 
        async: false, 
        success: function (data) { 
            if (firstLoad) { 
                data.forEach(function (coin) {
                    genCoinTab(coin); 
                }); 
                firstLoad = false; 
            } else { 
                data.forEach(function (coin) {
                    updateCoinTab(coin);
                }); 
            }
        }
    }).then(function() { 
        setTimeout(getCryptoData,duration); 
    });

})(); 

$('.cryptoList>li').mouseover(function(event) {
    var id = $(event.target).attr('id');
    var target = $('#' + id + ' .cTitle');

    target.animate({
        marginLeft: '100px' 
    }, 100, function () {
        // alert('boop'); 
    });

});

$('.cryptoList>li').mouseout(function (event) {
    //alert("oooo"); 
    var hovered = $(event.target).attr('data-hover');
   // if (hovered == 1) {
        var id = $(event.target).attr('id');
        var to = document.elementFromPoint(event.clientX,event.clientY); 

       // alert(id); 

        if ($(to).attr('id') && $(to).attr('id') == id) {
            return;
        }
        $('#' + id).each(function() {
            $(this).attr({'data-hover':0});
        });

        var target = $('#' + id + ' .cTitle');

        target.animate({
            marginLeft: '0px'
        }, 100, function () {
            //alert('boop');
        });

  //  }
   
});
// (function applyMouseHandlers() { 

// })
(function () {

    var MAX_ZOOM = 20; 
    var MIN_ZOOM = 200; 

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
        print: function (text) { 
            var pt = $('#pt').val(); // get pretext 
            this.console.append(pt + text +';<br>'); 
            // if (this.consoleLength >= 500) { 
            //     this.console.children('p').pop(); 
            // }

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
                this.print(cellStr);
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

            if (this.ref) {
                this.kill(this.ref.x,this.ref.y); 
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
            this.print(cellStr);
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
            this.console = $('.golConsole p'); 

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

        clickEgg: function () {

            $('.gameBoard').off("click");

            var gol = this; 

            $(".gameBoard").each(function () {
                //alert('nah'); 
                $(this).click({gol: gol}, function (event) {
                    //alert("thaaa");
                    event.preventDefault();
                    var gol = event.data.gol;
                    var boardx = $(this).offset().left;
                    var boardy = $(this).offset().top;
                    
                    try {
                        var mx = Math.floor((event.pageX - boardx) / gol.blockWidth) - 1;
                        var my = Math.floor((event.pageY - boardy) / gol.blockHeight);
                    } catch(err) {
                        alert(err); 
                    }
    
                    

                    gol.populate(mx, my);
                    gol.populate(mx - 1, my - 2);
                    gol.populate(mx - 1, my - 1);
                    gol.populate(mx + 2, my - 1);
                    gol.populate(mx + 2, my - 2);
                    gol.populate(mx + 1, my - 3);
                    gol.populate(mx, my + 1);
                    gol.populate(mx, my + 2);
                    gol.populate(mx + 1, my + 3);
                    gol.populate(mx + 3, my + 2);
                    gol.populate(mx + 3, my + 1);
                    gol.populate(mx + 2, my);
                });
            })
           

            // $(".gameBoard").click({ gol: this }, function (event) {
            //     event.preventDefault();
            //     var gol = event.data.gol;
            //     var boardx = $(this).offset().left;
            //     var boardy = $(this).offset().top;

            //     var mx = Math.floor((event.pageX - boardx) / gol.blockWidth) - 1;
            //     var my = Math.floor((event.pageY - boardy) / gol.blockHeight);

            //     gol.populate(mx, my);
            //     gol.populate(mx - 1, my - 2);
            //     gol.populate(mx - 1, my - 1);
            //     gol.populate(mx + 2, my - 1);
            //     gol.populate(mx + 2, my - 2);
            //     gol.populate(mx + 1, my - 3);
            //     gol.populate(mx, my + 1);
            //     gol.populate(mx, my + 2);
            //     gol.populate(mx + 1, my + 3);
            //     gol.populate(mx + 3, my + 2);
            //     gol.populate(mx + 3, my + 1);
            //     gol.populate(mx + 2, my);
            // });
        },

        clickDoubleEgg: function () {

            $('.gameBoard').off("click");

            $(".gameBoard").click({ gol: this }, function (event) {
                event.preventDefault();
                var gol = event.data.gol;
                var boardx = $(this).offset().left;
                var boardy = $(this).offset().top;

                var mx = Math.floor((event.pageX - boardx) / gol.blockWidth) - 1;
                var my = Math.floor((event.pageY - boardy) / gol.blockHeight);

                gol.populate(mx, my);
                gol.populate(mx - 1, my - 2);
                gol.populate(mx - 1, my - 1);
                gol.populate(mx + 2, my - 1);
                gol.populate(mx + 2, my - 2);
                gol.populate(mx + 1, my - 3);
                gol.populate(mx, my + 1);
                gol.populate(mx, my + 2);
                gol.populate(mx + 1, my + 3);
                gol.populate(mx + 3, my + 2);
                gol.populate(mx + 3, my + 1);
                gol.populate(mx + 2, my);
                gol.populate(mx + 7, my);
                gol.populate(mx + 6, my - 2);
                gol.populate(mx + 6, my - 1);
                gol.populate(mx + 9, my - 1);
                gol.populate(mx + 9, my - 2);
                gol.populate(mx + 8, my - 3);
                gol.populate(mx + 7, my + 1);
                gol.populate(mx + 7, my + 2);
                gol.populate(mx + 8, my + 3);
                gol.populate(mx + 10, my + 2);
                gol.populate(mx + 10, my + 1);
                gol.populate(mx + 9, my);

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

            $('#zoomIn').click({gol: this}, function(event) { 
                event.data.gol.numberOfBlocks -= 20; 
                if (event.data.gol.numberOfBlocks == MAX_ZOOM) {
                    alert('Cannot zoom in anymore. Learn to see the bigger pictures. Particle theory is a misrepresentation of reality'); 
                    event.data.gol.numberOfBlocks += 20; 
                     
                } else { 
                    event.data.gol.resize(1);
                }
               
            }); 

            $('#zoomOut').click({ gol: this }, function (event) {
                event.data.gol.numberOfBlocks += 20;
                if (event.data.gol.numberOfBlocks == MIN_ZOOM) {
                    alert('Cannot zoom our anymore. The meanings are in the cells, the \"thing\" is just coincidence');
                    event.data.gol.numberOfBlocks -= 20;
                    
                } else { 
                    event.data.gol.resize(2);
                }
                
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

            $('#egg').click({ gol: this }, function (event) {
                // reset pattern buttons
                $('.pattern').css({ 'color': 'black' }).attr({ 'data-on': 0 });
                $(event.target).css({ 'color': 'orange' });
                $(event.target).attr({ 'data-on': 1 });

                // attatch gull click
                event.data.gol.clickEgg();
            });

            $('#doubleEgg').click({ gol: this }, function (event) {
                // reset pattern buttons
                $('.pattern').css({ 'color': 'black' }).attr({ 'data-on': 0 });
                $(event.target).css({ 'color': 'orange' });
                $(event.target).attr({ 'data-on': 1 });

                // attatch gull click
                event.data.gol.clickDoubleEgg();
            });

        },

        //fucntion to resize the game board based on the gol_container dimensions 
        resize : function (zoom) { 
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
                    .attr('class', 'gameBoard')
                    .attr('x1', 0)
                    .attr('y1', row * this.blockHeight)
                    .attr('x2', this.width)
                    .attr('y2', row * this.blockHeight)
                    .style("stroke", "rgba(95, 95, 95, 0.178)")
                    .style("stroke-width", 1);

                this.board.append('svg:line')
                    .attr('class', 'gameBoard')
                    .attr('x1', row * this.blockWidth)
                    .attr('y1', 0)
                    .attr('x2', row * this.blockWidth)
                    .attr('y2', this.height)
                    .style("stroke", "rgba(95, 95, 95, 0.178)")
                    .style("stroke-width", 1);

            } 

            this.mouseHandlers();

            //alert(temp.length); 

            for (var i = 0; i < temp.length; i++) { 
                // ***** FOR WHEN ZOOM FUNCTIONALITY IS IMPLEMENTED *****
                if (zoom == 1) { 
                    this.populate(temp[i].x - 10, temp[i].y - 10);
                } else if (zoom == 2) {
                    this.populate(temp[i].x + 10, temp[i].y + 10);
                } else {
                    this.populate(temp[i].x, temp[i].y);
                }
                 
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
                .attr('class','gameBoard')
                .attr('x1',0)
                .attr('y1',row * this.blockHeight)
                .attr('x2', this.width)
                .attr('y2',row * this.blockHeight)
                .style("stroke", "rgba(95, 95, 95, 0.178)")
                .style("stroke-width", 1); 

                this.board.append('svg:line')
                .attr('class','gameBoard')
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
                gol.resize(0); 
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
$(document).ready(function() {
    //////////////////////////////////////
    // START DRAWING CODE
    //////////////////////////////////////

    var _data; // data from previous update

    function draw_grid(data, colors) {
        var color_obj = {};
        for (var i = 0; i < colors.length; i += 2) {
            color_obj[colors[i]] = colors[i + 1];
        }
        var width = 600;
        var height = 600;
        var grid_length = data.length;
        var width_cell = width / grid_length;
        var height_cell = height / grid_length;

        var canvas = document.getElementById("grid")
        if (canvas == null) {
            canvas = document.createElement('canvas');
            canvas.id = "grid";
            canvas.width = width;
            canvas.height = height;
            document.getElementsByTagName('body')[0].appendChild(canvas);
        }

        canvas.width = width; 
        canvas.height = height; 
        var context = canvas.getContext("2d");

        function draw_cells() {
            for (var i = 0; i < grid_length; i++) {
                for (var ii = 0; ii < grid_length; ii++) {
                    if (_data && _data[i][ii] === data[i][ii]) {
                        continue;
                    }
                    context.fillStyle = color_obj[data[i][ii]];
                    context.fillRect(i * width_cell, ii * height_cell, width_cell, height_cell);
                }
            }
        }
        draw_cells();
        if (!_data) {
            _data = [];
        }
        for (var i = 0; i < grid_length; i++) {
            _data[i] = data[i].slice();
        }
    }

    function update_grid(data, colors) {
        draw_grid(data, colors);
    }


    //////////////////////////////////////
    // END DRAWING CODE
    //////////////////////////////////////			

    var grid_length = 300;
    var grid = [];
    var temp_grid = [];
    var colors = ["0", "#ffffff", "1", "#00bfff", "2", "#ffd700", "3", "#b03060"];
    var population = [];

    var start_i;
    var start_ii;

    var continue_drawing = true;
    var grain_counter = 0;



    function init_grid() {
        for (var i = 0; i < grid_length; i = i + 1) {
            grid[i] = [];
            for (var ii = 0; ii < grid_length; ii = ii + 1) {
                grid[i][ii] = 0;
            }
        }
        start_i = Math.round(grid_length / 2);
        start_ii = Math.round(grid_length / 2);
    }

    init_grid();

    draw_grid(grid, colors);

    run_and_draw();

    function run_and_draw() {
        var cd = continue_drawing;
        // the global variable continue_drawing can be set via iframe
        // to stop the simulation
        while (cd) {
            run_time_step();
            if (grain_counter % 1000 == 0) {
                cd = false;
                update_grid(grid, colors);
                setTimeout(function () {
                    run_and_draw();
                }, 1000);
            }
        }
    }


    function run_time_step() {
        add_sand(start_i, start_ii);
        grain_counter++;
    }

    function add_sand(i, ii) {
        var grains = grid[i][ii];
        if (grains < 3) {
            grid[i][ii]++;
        }
        else {
            grid[i][ii] = grains - 3;
            if (i > 0) {
                add_sand(i - 1, ii);
            }
            if (i < grid_length - 1) {
                add_sand(i + 1, ii);
            }
            if (ii > 0) {
                add_sand(i, ii - 1);
            }
            if (ii < grid_length - 1) {
                add_sand(i, ii + 1);
            }
        }
    }

}); 
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
$(document).ready(function () {

    // taglines that will cycle through 
    var lines = [ 
        'Crafty',
        'Please',
        '??????????????????????', 
        'is this where we began...',
        'call your mom', 
        'Hello?',
        '...or where we started?', 
        'Beep boop boop beep beep',
        'Hahaha what, no',
        'I literally cannot see right now', 
        'Who made this?? XD',
        'Big if true',
        'Seize the Means of production',
        'Don\'t trust what they teach you in school',
        'Eats his greens',
        'I never learned how to read',
        'Testing Testing 123',
        'Just do it'
    ]; 

    var index = 15; 
    var first = 1; 
    var duration = 10000; 

    // uncomment this when you turn off cycling
    $('#subTitle').text(lines[index]);
    (function cycle() {

        var rand = Math.floor(Math.random() * (lines.length));

        if (rand == index) {
            if (index == 0) {
                rand++; 
            } else {
                rand--; 
            }
        }

        if (rand == lines.length) {
            rand--; 
        } 

        index = rand; 

        var text = lines[index]; 

        if (first) { 
            first = 0; 
            $('#subTitle').text(text);
                setTimeout(cycle,duration); 
        } else { 
            $('#subTitle').animate({
                marginLeft: '100px',
                opacity: '0'
            }, 500, function () {
                $('#subTitle').text(text);
            });

            $('#subTitle').animate({
                marginLeft: '0px',
                opacity: '100'
            }, 500, function () {
                setTimeout(cycle, duration);
            });

        }

       

    });




});