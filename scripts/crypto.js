
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