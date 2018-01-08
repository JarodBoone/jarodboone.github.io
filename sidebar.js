$(document).ready(function () {

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
    var jumbotron = $('.jumbotron');

    const default_tab = 0;
    const base_tab_bd = '#dcdcdc';
    const sel_tab_bc = '#466666';

    const border_width = '5px';
    const border_enlarge = '15px';

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
    jumbotron.css({ 'background-color': selectors[tab].attr('data-bd-color') });
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
            //alert("NOOO");
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

        jumbotron.animate({backgroundColor: selectors[tab].attr('data-bd-color')});

        setTimeout(function () {
            tabs[tab].fadeIn(200);
        }, 201);

    });


});