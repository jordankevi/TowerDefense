function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function randomDirection() {
    return ['left', 'right', 'down', 'up'][randomInt(0,3)];
}

function checkArrayIncludes(arrays, elem) {
    for(i in arrays) {
        if (JSON.stringify(arrays[i]) == JSON.stringify(elem)) {
            return true;
        }
    }
    return false;
}

function submit_score() {
    let score = $('.score').text();
    let pseudo = $('#pseudo').val();
    highscore.push([pseudo, score]);
    highscore.sort(function(a, b) {
        if(a[1] > b[1]) {return -1;}
        if(a[1] < b[1]) {return 1;}
        if(a[1] == b[1]) {return 0;}
    });
    highscore.splice(highscore.length - 1, 1);
    reset();
    $.modal.close();
	$('#game-div').css("display", "none");
    $('body').css("background-image", "");
    $('#menu').css("display", "flex");

}
