let WordToGuess, WordLetters, NumLives;
const PLACEHOLDER = "_";
const RANDOM_WORDS = [];

$(() => {
    $.ajax({
        type: "GET",
        url: "rand_words2.csv",
        dataType: "text",
        success: function(data) {
            let endOfWord = data.indexOf(",");

            while(endOfWord != -1){
                let word = data.slice(0, endOfWord).toUpperCase();
                data = data.substr(endOfWord+1, data.length);
                RANDOM_WORDS.push(word);
                endOfWord = data.indexOf(",");
            }
        }
    });
});

$("#randomWord").click(() => {
    let numWords = RANDOM_WORDS.length;
    let randNum = Math.floor(Math.random() * numWords);
    let randomWord = RANDOM_WORDS[randNum];
    
    ClearBoard();
    SetGame(randomWord);
});

$("#begin").click(() => {
    ClearBoard();
    SetGame();
});


$(".letters > button").click(function(){
    $(this).prop("disabled", true).fadeOut();
    let letter = $(this).text(); 
    let letterPosition = WordToGuess.indexOf(letter);
    
    if(letterPosition != -1){
        CorrectGuess(letter);
        CheckScore();
        return;
    }

    WrongGuess(letter);
    CheckScore();
});


function ClearBoard(){
    $(".word, .wrong").html("");
    $(".man img").attr("src", "img/L6.png");
    $(".letters > button").fadeIn(0);
    $(".game-over").removeClass("game-over").removeClass("game-win");
    $(".letters > button").prop("disabled", false);
}


function SetGame(word){
    WordToGuess = word == undefined ?  $("#begin-word").val().toUpperCase() : word; //TODO: sanitize, check if real word, etc..
    WordLetters = [...WordToGuess];
    NumLives = 6;
    
    WordLetters.forEach((val, i) => {
        $(".word").append(`<div class='missing'>${PLACEHOLDER}</div>`); //animate?
    });

    $(".letter-count").html(`${WordLetters.length} Letters`);
}


function CorrectGuess(letter) {
    WordLetters.forEach((val, i) => {
        if(val != letter) return;

        i++;
        $(`.word > div:nth-child(${i})`).text(letter).removeClass("missing");
    });
}


function WrongGuess(letter){
    let appendText = NumLives != 6 ? `, ${letter}` : letter;
    
    NumLives--;
    let imgPath = `img/L${NumLives}.png`;
    $(".man img").attr("src", imgPath);
    $(".wrong").append(appendText);
}

function CheckScore(){
    let $letters = $(".word").children();

    if(NumLives == 0){
        LockGame();
        
        $letters.each(function(i) {
            if ($(this).text() == PLACEHOLDER){
                $(this).text(WordLetters[i]);
            }
        });

        return;
    }
        
    let lettersRemaining = 0;
    $letters.each(function(i) {
        if ($(this).text() == PLACEHOLDER){
            lettersRemaining++;
        }
    });

    if(lettersRemaining == 0){
        LockGame();
        $letters.addClass("game-win");
    }
}

function LockGame(){
    $(".missing").addClass("game-over");
    $(".letters > button").prop("disabled", true).addClass("game-over");
}