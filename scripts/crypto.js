
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

    if (cGrow) { 
        coinTab.css({'color':'green'});
    } else { 
        coinTab.css({ 'color': 'red' });
    }

    // generate title element
    coinTab.append('<div class=\"cTitle\">' + cName + '</div>');

    // generate price element
    coinTab.append('<div class=\"cPrice\">' + cPrice + '$</div>'); 

}

function updateCoinTab(coin) {

    // target data
    var cPrice = addCommas(coin.price_usd);
    var cName = coin.name;
    var cSym = coin.symbol;
    var c1h = coin.percent_change_1h;
    var cGrow = c1h.charAt(0) == '-' ? false : true;

    coinTab = $('#' + cSym);

    if (cGrow) {
        coinTab.css({ 'color': 'green' });
    } else {
        coinTab.css({ 'color': 'red' });
    }


    // generate price element
    $('#' + cSym + ' .cPrice').text(cPrice + '$');

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