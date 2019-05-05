var context = canvas.getContext("2d");
var board;//0-empty, 2-pacman, 4-block, 5-ball5, 15-ball15, 25-ball25, 11-candy, 22-extra time, 33-extra life
var characters_board;//6-redGhost, 7-blueGhost, 8-pinkGhost, 50-starShape
var score = 0;
var heart = 3;
var pac_color;
var full_chosen_time;
var balls_counter = 0;

// songs
var game_audio = new Audio("songs/play.mp3");

var direction = 4;//the direction of the pacman

//the intervals of the game:
var interval_pacman;
var interval_ghost;
var interval_collisions;
var interval_gift;
var interval_time;

//the characters:
var pacman_shape = new Object();
var redGhost_shape = new Object();
var blueGhost_shape = new Object();
var pinkGhost_shape = new Object();
var gift_shape = null;
var star_shape = new Object();



function initiate_keys_and_game() {
    //adding listeners to the moving keys:
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.code] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.code] = false;
    }, false);

    createIntervals();
    StartGame();
    init_ghosts_and_star();
}

    

    function StartGame() {
        full_chosen_time = time;
        printHearts();
        board = new Array();
        characters_board  = new Array();
        score = 0;
        pac_color = "yellow";
        var cnt = 100;
        var food_remain = balls;

        for (var i = 0; i < 10; i++) {
            board[i] = new Array();
            characters_board[i] = new Array();
            //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
            for (var j = 0; j < 10; j++) {
                if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
                    board[i][j] = 4;
                    characters_board[i][j] = 4;
                } else {
                    var randomNum = Math.random();
                    if (randomNum <= 1.0 * food_remain / cnt) {
                        var rdm = Math.random();
                        if (rdm < 0.6) {
                            board[i][j] = 5;
                            characters_board[i][j] = 0; 
                        }
                        else if (rdm > 0.6 && rdm < 0.9) {
                            board[i][j] = 15;
                            characters_board[i][j] = 0;   
                        }
                        else {
                            board[i][j] = 25;
                            characters_board[i][j] = 0;   
                        }
                        food_remain--;
                    } else {
                        board[i][j] = 0;
                        characters_board[i][j] = 0;
                    }
                    cnt--;
                }
            }
        }
        //adding the remainning food:
        while (food_remain > 0) {
            var emptyCell = findRandomEmptyCell(board);
            board[emptyCell[0]][emptyCell[1]] = 5;
            food_remain--;
        }

        put_Pacman_on_board();
    }


    function findRandomEmptyCell(board) {
        var i = Math.floor((Math.random() * 9) + 1);
        var j = Math.floor((Math.random() * 9) + 1);
        while (board[i][j] !== 0) {
            i = Math.floor((Math.random() * 9) + 1);
            j = Math.floor((Math.random() * 9) + 1);
        }
        return [i, j];
    }

    /**
     * @return {number}
     */
    function GetKeyPressed() {
        if (keysDown[up_move]) {
            return 1;
        }
        if (keysDown[down_move]) {
            return 2;
        }
        if (keysDown[left_move]) {
            return 3;
        }
        if (keysDown[right_move]) {
            return 4;
        }
    }


    function Draw() {
        context.clearRect(0, 0, canvas.width, canvas.height); //clean board
        lblScore.value = score;
        lblTime.value = time;
        play_game_music();
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var center = new Object();
                center.x = i * 60 + 30;
                center.y = j * 60 + 30;

                //draw the real board:
                if (board[i][j] === 2) {
                    draw_Pacman(center);
                } else if (board[i][j] === 4) {
                    context.beginPath();
                    context.rect(center.x - 30, center.y - 30, 60, 60);
                    context.fillStyle = "grey"; 
                    context.fill();
                }
                else if (board[i][j] === 5) {//5 ball
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0, 2 * Math.PI); 
                    context.fillStyle = color_5;
                    context.fill();
                    context.font = "12px Arial";
                    context.fillStyle = "white";
                    context.fillText('5',center.x - 6,center.y + 3);
                
                }else if (board[i][j] === 15) {//15 ball
                    context.beginPath();
                    context.arc(center.x, center.y, 12, 0, 2 * Math.PI);
                    context.fillStyle = color_15; 
                    context.fill();
                    context.font = "12px Arial";
                    context.fillStyle = "white";
                    context.fillText('15',center.x - 6,center.y + 6);
                }
                else if (board[i][j] === 25) {//25 ball
                    context.beginPath();
                    context.arc(center.x, center.y, 10, 0, 2 * Math.PI); 
                    context.fillStyle = color_25;
                    context.fill();
                    context.font = "12px Arial";
                    context.fillStyle = "white";
                    context.fillText('25',center.x - 6,center.y + 6);
                }
            }
        }

        draw_all_characters();
    }

    function draw_all_characters() {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var center = new Object();
                center.x = i * 60 + 30;
                center.y = j * 60 + 30;
                //Draw the characters:
                if(characters_board[i][j] === 6){//red ghost
                    var img = document.getElementById("redGhost");
                    context.drawImage(img, center.x - 15,center.y - 15, 40, 40);
                }if(characters_board[i][j] === 7){//blue ghost
                    var img = document.getElementById("blueGhost");
                    context.drawImage(img, center.x - 15,center.y - 15, 40, 40);
                }if(characters_board[i][j] === 8){//pink ghost
                    var img = document.getElementById("pinkGhost");
                    context.drawImage(img, center.x - 15,center.y - 15, 40, 40);
                }if(characters_board[i][j] === 50){//star - moving shape (extra 50 points)
                    var img = document.getElementById("star_shape");
                    context.drawImage(img, center.x - 18,center.y - 18, 45, 45);
                }if(board[i][j] === 11){//extra points gift (extra 100 points)
                    var img = document.getElementById("points_shape");
                    context.drawImage(img, center.x - 15,center.y - 15, 45, 45);
                }if(board[i][j] === 22){//extra time gift (20 sec)
                    var img = document.getElementById("time_shape");
                    context.drawImage(img, center.x - 15,center.y - 15, 45, 45);
                }if(board[i][j] === 33){//extra life gift (max 4 lifes)
                    var img = document.getElementById("heart_shape");
                    context.drawImage(img, center.x - 15,center.y - 15, 45, 45);
                }
            }
        }
    }

    function UpdateTime() {
        if (time > 0)
            time--;
        else if(time === 0)
            game_over();
    }


//----------------------------------------------------//
//----------------------------THE-PACMAN----------------//
//----------------------------------------------------//

    //adding the pacman to the board:
    function put_Pacman_on_board() {
        var pacman_index_i = Math.floor(Math.random() * 10); 
        var pacman_index_j = Math.floor(Math.random() * 10); 
        while(is_corner(pacman_index_i,pacman_index_j) || (board[pacman_index_i][pacman_index_j] !== 0)){
            pacman_index_i = Math.floor(Math.random() * 10); 
            pacman_index_j = Math.floor(Math.random() * 10); 
        }
        pacman_shape.i = pacman_index_i;
        pacman_shape.j = pacman_index_j;
        board[pacman_index_i][pacman_index_j] = 2;
        characters_board[pacman_index_i][pacman_index_j] = 0;
    }

    function draw_Pacman(center){ 
        if(direction == 3){// pacman is looking left  
            context.beginPath();
            context.arc(center.x, center.y, 30, 1.15 * Math.PI, 2.85 * Math.PI); // looking left
            context.lineTo(center.x, center.y);
            context.fillStyle = pac_color; //color
            context.fill();
            context.beginPath();
            context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
            context.fillStyle = "black"; //color
            context.fill();
        }else if(direction == 4){// pacman is looking right 
            context.beginPath();
            context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // looking right
            context.lineTo(center.x, center.y);
            context.fillStyle = pac_color; //color
            context.fill();
            context.beginPath();
            context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
            context.fillStyle = "black"; //color
            context.fill();
        }else if(direction == 1){// pacman is looking up
            context.beginPath();
            context.arc(center.x, center.y, 30, -0.35 * Math.PI, 1.35 * Math.PI); // looking up
            context.lineTo(center.x, center.y);
            context.fillStyle = pac_color; //color
            context.fill();
            context.beginPath();
            context.arc(center.x + 10, center.y + 5, 5, 0, 2 * Math.PI); // circle
            context.fillStyle = "black"; //color
            context.fill();
        }else if(direction == 2){// pacman is looking down
            context.beginPath();
            context.arc(center.x, center.y, 30, 0.68 * Math.PI, 2.33 * Math.PI); // looking down
            context.lineTo(center.x, center.y);
            context.fillStyle = pac_color; //color
            context.fill();
            context.beginPath();
            context.arc(center.x + 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
            context.fillStyle = "black"; //color
            context.fill();
        }
    }

    function UpdatePosition_Packman() {
        board[pacman_shape.i][pacman_shape.j] = 0;
        var x = GetKeyPressed();
        var center = new Object();
        center.x = pacman_shape.i * 60 + 30;
        center.y = pacman_shape.j * 60 + 30;
        if (x === 1) {//up
            if (pacman_shape.j > 0 && isNotWall(pacman_shape.i,pacman_shape.j - 1)) {
                pacman_shape.j--;
                direction = 1;
            }
        }
        if (x === 2) {//down
            if (pacman_shape.j < 9 && isNotWall(pacman_shape.i,pacman_shape.j + 1)) {
                pacman_shape.j++;
                direction = 2;
            }
        }
        if (x === 3) {//left
            if (pacman_shape.i > 0 && isNotWall(pacman_shape.i - 1,pacman_shape.j)) {
                pacman_shape.i--;
                direction = 3;
            }
        }
        if (x === 4) {//right
            if (pacman_shape.i < 9 && isNotWall(pacman_shape.i + 1,pacman_shape.j)) {
                pacman_shape.i++;
                direction = 4;
            }
        }

        //balls eating:
        if (board[pacman_shape.i][pacman_shape.j] === 5) {// 5 points ball
            score += 5;
            balls_counter += 1;
        }
        else if (board[pacman_shape.i][pacman_shape.j] === 15){// 15 points ball
            score += 15;
            balls_counter += 1;
        }
        else if (board[pacman_shape.i][pacman_shape.j] === 25){// 25 points ball
            score += 25;
            balls_counter += 1;
        }
        board[pacman_shape.i][pacman_shape.j] = 2;

        Draw();
        if (balls_counter == balls) {//if we eated all the balls:
            game_over();
        }
    }


    //----------------------------------//
    //----------BOARD-CHECK------------//
    //----------------------------------//
    function is_corner(i,j) {
        if(((i === 0) && (j === 0)) || ((i === 0) && (j === 9)) || ((i === 9) && (j === 0)) || ((i === 9) && (j === 9)))
        return true;
    }

    function isNotWall(i, j) {
        return (board[i][j] !== 4);
    }

    //this function check if there was a collision between two objects        
    function checkCollisions() {
        var collision = false;

        //collision with red ghost:
        if ((redGhost_shape.i === pacman_shape.i) && (redGhost_shape.j === pacman_shape.j)) {
                    heart--;
                    score -= 10;
                    collision = true;
        }
        //collision with blue ghost:
        else if ((blueGhost_shape.i === pacman_shape.i) && (blueGhost_shape.j === pacman_shape.j)) {
                    heart--;
                    score -= 10;
                    collision = true;
        }
        //collision with pink ghost:
        else if ((pinkGhost_shape.i === pacman_shape.i) && (pinkGhost_shape.j === pacman_shape.j)) {
                    heart--;
                    score -= 10;
                    collision = true;
        }
        //collision with the star - extra 50 points:
        else if ((star_shape !== null) && (star_shape.i === pacman_shape.i) && (star_shape.j === pacman_shape.j)) {
                    score += 50;
                    characters_board[star_shape.i][star_shape.j] = 0;
                    star_shape = null;
        }
        //collision with the gift:
        else if ((gift_shape !== null) && (gift_shape.i === pacman_shape.i) && (gift_shape.j === pacman_shape.j)) {
            if(gift_shape.num === 11){//it's a candy
                score += 100;
            }else if(gift_shape.num === 22){//it's an extra time
                time += 20;
            }else {//it's an extra life
                if(heart <= 3){
                    heart += 1;
                    printHearts();
                }
            }
            characters_board[gift_shape.i][gift_shape.j] = 0;
            gift_shape = null;
        }
        if (heart === 0)
            game_over();
        else if (collision) {
            printHearts();
            newRound();
        }
    }

//prints the hearts in there position
function printHearts(){
    var canvas = document.getElementById('lblHeart');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var img = document.getElementById("heart");

    if (heart === 4){
        ctx.drawImage(img, 0, 30, 60, 140);
        ctx.drawImage(img, 60, 30, 60, 140);
        ctx.drawImage(img, 120, 30, 60, 140);
        ctx.drawImage(img, 180, 30, 60, 140);
    } else if (heart === 3){
        ctx.drawImage(img, 0, 30, 60, 140);
        ctx.drawImage(img, 60, 30, 60, 140);
        ctx.drawImage(img, 120, 30, 60, 140);
    } else if (heart === 2){
        ctx.drawImage(img, 0, 30, 60, 140);
        ctx.drawImage(img, 60, 30, 60, 140);
    } else if (heart === 1){
        ctx.drawImage(img, 0, 30, 60, 140);
    }
}



//----------------------------------------------------//
//---------------------------NEW GAME-BUTTON----------//
//----------------------------------------------------//

$("#new_game").click(function() {
    deleteIntervals();
    pacman_shape = new Object();
    star_shape = new Object();
    board;
    score;
    heart = 3;
    pac_color;
    balls_counter = 0;
    direction = 4;
    time = full_chosen_time;

    $('#game_over_div').hide();
    $('#board').show();

    initiate_keys_and_game();
    Draw();
});


function newRound() {
    deleteIntervals();
    board[pacman_shape.i][pacman_shape.j] = 0;
    characters_board[redGhost_shape.i][redGhost_shape.j] = 0;
    var num_of_ghosts = Number(ghosts);
    if (num_of_ghosts >= 2)
        characters_board[blueGhost_shape.i][blueGhost_shape.j] = 0;
    if (num_of_ghosts >= 3)
        characters_board[pinkGhost_shape.i][pinkGhost_shape.j] = 0;
    if (star_shape !== null)
        characters_board[star_shape.i][star_shape.j] = 0;
    else
        star_shape = new Object();
    init_ghosts_and_star();
    createIntervals();
    put_Pacman_on_board();
    Draw();
}



//-----------------------------------------------------------//
//---------------------THE GHOSTS-AND-STAR-------------------//
//-----------------------------------------------------------//
function init_ghosts_and_star(){
    var num_of_ghosts = Number(ghosts);
    characters_board[0][0] = 6;
    redGhost_shape.num = 6;
    redGhost_shape.i = 0;
    redGhost_shape.j = 0;
    redGhost_shape.i_last = -1;//is the last X position of the ghost
    redGhost_shape.j_last = -1;//is the last Y position of the ghost

    if (num_of_ghosts >= 2){
        characters_board[0][9] = 7;
        blueGhost_shape.num = 7;
        blueGhost_shape.i = 0;
        blueGhost_shape.j = 9;
        blueGhost_shape.i_last = -1;
        blueGhost_shape.j_last = -1;
    }
    if (num_of_ghosts >= 3){
        characters_board[9][0] = 8;
        pinkGhost_shape.num = 8
        pinkGhost_shape.i = 9;
        pinkGhost_shape.j = 0;
        pinkGhost_shape.i_last = -1;
        pinkGhost_shape.j_last = -1;
    }
    characters_board[9][9] = 50;
    star_shape.i = 9;
    star_shape.j = 9;
    star_shape.i_last = -1;
    star_shape.j_last = -1;
    star_shape.num = 50;
}

function UpdatePosition_Ghosts_and_Star() {
    //moving the star:
    if (star_shape !== null) {
        moveCharacter(star_shape, false);
    }
    //moving the ghosts:
    var num_of_ghosts = Number(ghosts);
    moveCharacter(redGhost_shape, true);
    if (num_of_ghosts >= 2)
        moveCharacter(blueGhost_shape, true);
    if (num_of_ghosts >= 3)
        moveCharacter(pinkGhost_shape, true);
}

//this function checks for the next step for the given character:
function moveCharacter(character , isGhost) {
    characters_board[character.i][character.j] = 0;
    var optional_moves = findOptionalMoves(character.i, character.j)
    var chosen_dist_ghost = Number.MAX_SAFE_INTEGER;
    var chosen_move = 0;
    if(isGhost){//it's a ghost:
        for (var i = 0 ; i < optional_moves.length ; i++){
            if (!(optional_moves[i].x === character.i_last && optional_moves[i].y === character.j_last)){
                var tmp_dist = euclideanDistance(optional_moves[i].x, optional_moves[i].y, pacman_shape.i, pacman_shape.j);
                if (tmp_dist < chosen_dist_ghost){
                    chosen_move = i;
                    chosen_dist_ghost = tmp_dist;
                }
            }
        }
    }
    else{//it's the star:
        var random_move = Math.floor(Math.random() * optional_moves.length);
        while((optional_moves[random_move].x === character.i_last && optional_moves[random_move].y === character.j_last)){
            random_move = Math.floor(Math.random() * optional_moves.length);
        }
        chosen_move = random_move;
    }
    character.i_last = character.i;
    character.j_last = character.j;
    character.i = optional_moves[chosen_move].x;
    character.j = optional_moves[chosen_move].y;
    characters_board[character.i][character.j] = character.num;
}



//-------------------------------------------------//
//----------------------GIFT-EXTRA-----------------//
//-------------------------------------------------//

function UpdatePosition_Gift() {
    if (gift_shape === null) {//adding the gift to the board
        gift_shape = new Object();
        var emptyCell = findRandomEmptyCell(board);
        gift_shape.i = emptyCell[0];
        gift_shape.j = emptyCell[1];
        var rand = Math.random();
        if (rand < 0.33) {
            board[gift_shape.i][gift_shape.j] = 33;//heart adding (max 4 life)
            gift_shape.num = 33;
        } else if (rand < 0.66){
            board[gift_shape.i][gift_shape.j] = 22;//time adding (20 sec)
            gift_shape.num = 22;
        }else{
            board[gift_shape.i][gift_shape.j] = 11;//candy - extra points (100)
            gift_shape.num = 11;
        }
    }
    else {//removing the gift from the board
        board[gift_shape.i][gift_shape.j] = 0;
        gift_shape = null;
    }
}


//-------------------------------------------------//
//---------------------------------MUSIC----------//
//-------------------------------------------------//
function play_game_music() {
    game_audio.loop = true;
    game_audio.play();
}

function stop_game_music() {
    game_audio.pause();
    game_audio.currentTime = 0;
}



//-------------------------------------------------//
//-------------------------------INTERVALS-----------//
//-------------------------------------------------//
//setting the intervals:
function createIntervals() {
    interval_pacman = setInterval(UpdatePosition_Packman, 120);
    interval_time = setInterval(UpdateTime, 1000);
    interval_ghost = setInterval(UpdatePosition_Ghosts_and_Star, 500);
    interval_collisions = setInterval(checkCollisions, 50);
    interval_gift = setInterval(UpdatePosition_Gift, 5000);
}

// clear the intervals
function deleteIntervals() {
    clearInterval(interval_pacman);
    clearInterval(interval_time);
    clearInterval(interval_ghost);
    clearInterval(interval_collisions);
    clearInterval(interval_gift);
}



//-------------------------------------------------//
//---------------------------EXIT-GAME-------------//
//-------------------------------------------------//
//if we exit the game:
function clear_ALL_game() {
    deleteIntervals();
    stop_game_music();
    if (pre_game_validator !== null){
        pre_game_validator.resetForm();
    }
    pacman_shape = new Object();
    score = 0;
    heart = 3;
}


function game_over() {
    window.clearInterval(interval_pacman);

    stop_game_music();
    if (heart === 0)
        window.alert("You lost! Your score is:" + score)
    else if (time === 0){
        if (score < 150){
            window.alert("You can do better then: " + score);
        }
        else{
            window.alert("We have a Winner, your score is: " + score + " !!!!!");
        }
    }else{
        window.alert("You ate all the food! your score is: " + score);
    }
    
    deleteIntervals();
}


//--------------------------------------------------//
//--------------------------------DISTANCE----------//
//--------------------------------------------------//

function findOptionalMoves(x, y) {
    var options = [];
    if ((x - 1 >= 0) && (isNotWall(x - 1, y)))
        options.push({x: x - 1, y: y});
    if ((y - 1 >= 0) && (isNotWall(x, y - 1)))
        options.push({x: x, y: y - 1});
    if ((x + 1 <= 9) && (isNotWall(x + 1, y)))
        options.push({x: x + 1, y: y});
    if ((y + 1 <= 9) && (isNotWall(x, y + 1)))
        options.push({x: x, y: y + 1});

    return options;
}

function euclideanDistance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    dx = Math.pow(dx, 2);
    dy = Math.pow(dy, 2);
    return Math.sqrt(dx + dy);
}