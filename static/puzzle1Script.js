$(document).ready(function(){
    var solution1 = [2,3,4,4,3,2];
    var solution2 = [4,3,2,2,3,4];
    var userInput = [0,0,0,0,0,0];
    var audio = document.getElementsByTagName("audio")[0];
    audio.volume = .1;

    function isSolved(){
    if(userInput.toString()==solution1.toString() ||
       userInput.toString()==solution2.toString()){
    return true;}
    else{
    return false;}
    };

    $('#son1').animate({top:'0'},1000);
    $('#son2').animate({top:'0'},1100);
    $('#son3').animate({top:'0'},1200);
    $('#son4').animate({top:'0'},1300);
    $('#son5').animate({top:'0'},1400);

    $('#son1,#son2,#son3,#son4,#son5').click(function(){
        num = $(this).index();
        $('#panel').show();

        userInput.push(num+1);
        userInput.shift();

        if (num % 2 == 0 ){
        $(this).animate({top:'150'},1000);
        }
        else{
        $(this).animate({top:'-150'},1000);
        }

        $(this).animate({top:'0'},1000);

        if(isSolved()){
        $('#greeting').html('Congrats! You solved the puzzle.');
        $('#panel').hide();
        $('.son').unbind();
        }
        else{
        $('#greeting').html(userInput);
        }
        });

    $( "#rulesLink,#panel" ).mouseover(function(){
    $(this).css('color', '#EEEDE7');
    $( "#rules" ).animate({width: 'show'});
    audio.pause();
    audio.currentTime=0;
    audio.play();
    });

    $( "#rulesLink,#panel" ).mouseout(function(){
    $(this).css('color', '#FF5454');
    $( "#rules" ).animate({width: 'hide'});
    audio.pause();
    audio.currentTime=0;
    audio.play();
    });
});