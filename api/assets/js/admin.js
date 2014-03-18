function createYTPlayer(vidID){
    player = new YT.Player('player', {
        videoId: vidID,
        playerVars: {
            wmode: "opaque",
            showinfo: 0,
            modestbranding: 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': playerEvents
        }
    });
};

function onPlayerReady(event) {
    event.target.playVideo();
}

function playerEvents(event) {
    if (event.data == YT.PlayerState.PLAYING) {

        $('#play').children('i').removeClass().addClass('icon-pause');
        
        setInfo();

        var progress = setInterval(function() {
            $('#playing-time').text(songProgress());
        }, 1000);


    } else if (event.data == YT.PlayerState.ENDED) {
        
        var $nextSong = $('.playing').nextAll('.trak').first();  

        if ( $nextSong.length !== 0 ) {
            
            var youtube_id = $nextSong.attr('data-youtube-id');
            var $newPlayer = $('<div id="player"></div>');

            $('#player').remove();
            $('.playing').removeClass('playing');
            $nextSong.addClass('playing');

            $('.playing .media').prepend($newPlayer);
            createYTPlayer(youtube_id);

        }

        if ($nextSong.nextAll('.trak').first().length == 0) {

        	alert('done');

        }

    } else if (event.data == YT.PlayerState.PAUSED){

        $('#play').children('i').removeClass().addClass('icon-play');

    } else {

        $('#play').children('i').removeClass().addClass('icon-bolt');
        $('#title').text('Buffering... | Channeltrak');

    }
}

function horizontal() {

    $playing = $('.playing');

    var wW = $(window).width();
    var wH = $(window).height();
    var hH = $('#header').height();
    var cH = $playing.children('.caption').height();
    var tW = (wH - hH - 84 - 40)/(.5625);

    $('#trak-list').width(Math.ceil($('#trak-list').width() - $playing.width() + tW + 140));
    $playing.css('width', tW+'px');

}

function vertical() {

    $playing = $('.playing');

    var wW = $(window).width()/2;
    var tLW = $('#trak-list').width()/2;
    var tW = wW + tLW - 40;

    $playing.css('width', tW+'px');

}

function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,100)};return c};

$(function(){

    $('a').click(function(){
        $('body').addClass('transition');
    });

    $(window).on("debouncedresize", function(e) {

        if ($('.playing').length) {

            if ($('#trak-list').hasClass('horizontal')) {
                horizontal();
            }

        }

    });

	$('html, body, *').mousewheel(function(e, delta) {

		if ($('#trak-list').hasClass('horizontal')) {

		    this.scrollLeft -= (delta * 75);
		    e.preventDefault();

		}

	});

	$('.trak .media').click(function(){

        var $media = $(this);
        var $trak = $media.parents('.trak');
        var trak_media = $trak.attr('data-youtube-id');
        var $newPlayer = $('<div id="player"></div>');

        $('#player').remove();
        $trak.addClass('playing');
        $('.trak').not($trak).removeClass('playing').removeAttr('style');
        $media.prepend($newPlayer);
        createYTPlayer(trak_media);

        if ($('#trak-list').hasClass('horizontal')) {
            horizontal();
        }
        
    });

	$('#toggleDirection').click(function(){

		if ($('#trak-list').length && $('#trak-list').hasClass('horizontal')) {

			$('#trak-list').removeClass().addClass('vertical').removeAttr('style')
            $('.playing').removeAttr('style');
			$(this).removeClass();

            if ($('.playing').length) {
                //verticla();
            }

		} else if ($('#trak-list').length && $('#trak-list').hasClass('vertical')) {

			$(this).addClass('rotate90');
			$('#trak-list').removeClass().addClass('horizontal');

            if ($('.playing').length) {
                horizontal();
            }
		}

	});
});
