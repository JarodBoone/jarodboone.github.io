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