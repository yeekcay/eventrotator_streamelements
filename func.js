let safeWidget      = false;
let sliderMode 		= '{slider_mode}';
let sliderIdle  	= {slider_idle} * 1000;
let keepGoing     	= false;
let info          	= [];
let counter       	= 0;
let key           	= 0;
let slider_way		= '{slider_way}';
let nbSlides	  	= 12;
let nbSlidesActive 	= 0;
let currentSlide 	= 0;
let currency 		= '';
let userLocale 		= '';
let sliderStart    	= true;
let sliderEnd		= false;
let slideData	  	= [
    {
        'event': '{slide_0_event}',
        'show': '{slide_0_show}',
        'top': '{slide_0_top}',
        'bot': '{slide_0_bot}'
    },
    {
        'event': '{slide_1_event}',
        'show': '{slide_1_show}',
        'top': '{slide_1_top}',
        'bot': '{slide_1_bot}'
    },
    {
        'event': '{slide_2_event}',
        'show': '{slide_2_show}',
        'top': '{slide_2_top}',
        'bot': '{slide_2_bot}'
    },
    {
        'event': '{slide_3_event}',
        'show': '{slide_3_show}',
        'top': '{slide_3_top}',
        'bot': '{slide_3_bot}'
    },
    {
        'event': '{slide_4_event}',
        'show': '{slide_4_show}',
        'top': '{slide_4_top}',
        'bot': '{slide_4_bot}'
    },
    {
        'event': '{slide_5_event}',
        'show': '{slide_5_show}',
        'top': '{slide_5_top}',
        'bot': '{slide_5_bot}'
    },
    {
        'event': '{slide_6_event}',
        'show': '{slide_6_show}',
        'top': '{slide_6_top}',
        'bot': '{slide_6_bot}'
    },
    {
        'event': '{slide_7_event}',
        'show': '{slide_7_show}',
        'top': '{slide_7_top}',
        'bot': '{slide_7_bot}'
    },
    {
        'event': '{slide_8_event}',
        'show': '{slide_8_show}',
        'top': '{slide_8_top}',
        'bot': '{slide_8_bot}'
    },
    {
        'event': '{slide_9_event}',
        'show': '{slide_9_show}',
        'top': '{slide_9_top}',
        'bot': '{slide_9_bot}'
    },
    {
        'event': '{slide_10_event}',
        'show': '{slide_10_show}',
        'top': '{slide_10_top}',
        'bot': '{slide_10_bot}'
    },
    {
        'event': '{slide_11_event}',
        'show': '{slide_11_show}',
        'top': '{slide_11_top}',
        'bot': '{slide_11_bot}'
    }
];

let dataStructure = {
    'cheer-alltime-top-donation'	: ['amount', 'name'],
    'cheer-alltime-top-donator'		: ['amount', 'name'],
    'cheer-count' 					: ['count'],
    'cheer-goal'  					: ['amount'],
    'cheer-latest'  				: ['amount', 'name', 'message'],
    'cheer-month'  					: ['amount'],
    'cheer-monthly-top-donation'	: ['amount', 'name'],
    'cheer-monthly-top-donator'		: ['amount', 'name'],
    'cheer-total'					: ['amount'],
    'cheer-week'					: ['amount'],
    'follower-goal'					: ['amount'],
    'follower-latest'				: ['name'],
    'follower-month'				: ['count'],
    'follower-total'				: ['count'],
    'follower-week'					: ['count'],
    'host-latest'					: ['amount', 'name'],
    'raid-latest'					: ['amount', 'name'],
    'subscriber-alltime-gifter' 	: ['amount', 'name'],
    'subscriber-gifted-latest'		: ['amount', 'name', 'sender', 'message'],
    'subscriber-goal'				: ['amount'],
    'subscriber-latest'				: ['amount', 'gifted', 'message', 'name', 'sender', 'tier'],
    'subscriber-month'				: ['count'],
    'subscriber-new-latest'  		: ['amount', 'name', 'message'],
    'subscriber-points'				: ['amount'],
    'subscriber-resub-latest' 		: ['amount', 'name', 'message'],
    'subscriber-total'				: ['count'],
    'subscriber-week'				: ['count'],
    'tip-alltime-top-donation'		: ['amount', 'name'],
    'tip-alltime-top-donator'		: ['amount', 'name'],
    'tip-goal'						: ['amount'],
    'tip-latest'					: ['amount', 'name', 'message'],
    'tip-month'						: ['amount'],
    'tip-total'						: ['amount'],
    'tip-week'						: ['amount']
};

let resetSliderOnNewEvent = {on_new_event_reset_slider};
let timer;

window.addEventListener('onWidgetLoad', function(obj) {
    let datas 	= obj.detail.session.data;
    currency 	= obj.detail.currency.code;
    userLocale 	= '{locale}';

    for(i=0; i <= nbSlides-1; i++){
        if(slideData[i]['show'] == 1){
            safeWidget = true;
            nbSlidesActive++;
        }
        getData(i, datas);
    }

    if(!safeWidget){
        stopLoop();
    }else{
        timer = setTimeout(startLoop, 5000);
    }

});



window.addEventListener('onEventReceived', function(obj) {

    if(resetSliderOnNewEvent == 1) {
        stopLoop();
    }

    const listener  = obj.detail.listener;
    const datas     = obj.detail.event;

    for(i=0; i <= nbSlides-1; i++ ){
        if(slideData[i]['event'] == listener){
            getData(i, datas, true);
        }
    }

    if(resetSliderOnNewEvent == 1) {
        timer = setTimeout(startLoop, {on_new_event_reset_slider_timer} * 1000);
    }

});


function getData(slide, datas, update=false){

    let regex = /{(.*?)}/g;
    let myEvent = slideData[slide]['event'];
    let txtTop 	= slideData[slide]['top'];
    let txtBot 	= slideData[slide]['bot'];
    let show   	= slideData[slide]['show'];
    let myData;

    if (update){
        myData = datas;
    } else {
        myData = datas[myEvent];
    }

    if (show == 1) {
        if (myEvent != 'title') {
            dataStructure[myEvent].forEach(function (element, index) {
                let value = myData[element];
                if (element == 'amount') {
                    if (myEvent.startsWith('tip-')) {
                        value = value.toLocaleString(userLocale, {
                            style: 'currency',
                            currency: currency,
                            minimumFractionDigits: value === Math.round(value) ? 0 : 2
                        });
                        value = value.replace("$","$ ");
                    } else {
                        value = value.toLocaleString(userLocale);
                    }
                }
                txtTop = findReplaceString(txtTop, element, value);
                txtBot = findReplaceString(txtBot, element, value);
            });
        }
    }

    info[slide] = {
        'show': show,
        'top': txtTop,
        'bot': txtBot,
    }
}


function startLoop() {
    keepGoing = true;
    myLoop();
}

function stopLoop() {
    keepGoing = false;
    $('.anim').removeClass('play');
    $('#slash').removeClass();
    clearTimeout(timer);
    key = 0;
    currentSlide = 0;
}

function myLoop() {
    if (keepGoing) {
        if (sliderMode == 'pause') {
            if (key > nbSlides - 1) {
                key = 0;
                currentSlide = 0;
                slider_way = '{slider_way}';
                timer = setTimeout(myLoop, sliderIdle);
            } else {
                animateBoxes();
                key++;
                currentSlide++;
                timer = setTimeout(myLoop, 7000);
            }
        } else {
            animateBoxes();
            if (key > nbSlides - 1) {
                key = 0;
                currentSlide = 0;
            } else {
                key++;
                currentSlide++;
            }
            timer = setTimeout(myLoop, 7000);
        }
    }
};

function animateBoxes(){
    if (sliderMode == 'pause') {
        if(currentSlide == 0){
            sliderStart = true;
        }
    }

    if(currentSlide >= nbSlidesActive - 1){
        sliderEnd = true;
    }

    slider_way = slider_way;

    animateSlide(slider_way, sliderStart, sliderEnd);

    sliderStart 	= false;
    sliderEnd 		= false;
}


/*********************************************
 *			Layer Animations
 *********************************************/

function animateSlide(way, start, end){
    let slideId = '#slide_' + key;
    let timerSlide = 10000;

    while(info[key]['show'] == 0 && key <= nbSlides - 1){
        key++;
        if (typeof info[key] ==="undefined"){
            if (sliderMode == 'pause') {
                return;
            }{
                end = false;
                key = 0;
            }
        }
    }

    if(end == true) {
        timerSlide = 6500
    }

    if(slideData[key]['event'] == 'title') {
        $(slideId + ' .txt-top').addClass('title');
        $(slideId + ' .txt-bot').addClass('title');

    }

    $(slideId + ' .txt-top').html(info[key]['top']);
    $(slideId + ' .txt-bot').html(info[key]['bot']);


    resetAnim();

    if(start){
        $('#slash').addClass('play start ' + slider_way);
    }else{
        $('#slash').addClass(way);
    }

    $(slideId).addClass('play ' + way);

    timer = setTimeout( function() {
        if(end == false) {
            $(slideId).removeClass('play ' + way);
        }else{
            $('#slash').removeClass(way);
            if(way == 'left'){
                $('#slash').addClass('play right end');
            }else{
                $('#slash').addClass('play left end');
            }
            setTimeout( function() {
                $(slideId).removeClass('play ' + way);
            }, 3500 );
        }
    }, timerSlide );
}


function resetAnim(stop = false){
    $('#slash').removeClass('start');
    $('#slash').removeClass('right');
    $('#slash').removeClass('left');
    $('#slash').removeClass('end');

    if(stop == true){
        $('#slash').removeClass('play');
    }
}


function changeSide(way){
    return (way == 'left');
}

function findReplaceString(string, find, replace)
{
    if ((/[a-zA-Z\_]+/g).test(string)) {
        return string.replace(new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}'), replace);
    } else {
        return string;
    }
}