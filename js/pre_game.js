var time;
var balls;
var pre_game_validator = null;
var ghosts;


//Keys:
var up_move = 'ArrowUp';
var right_move = 'ArrowRight';
var left_move = 'ArrowLeft';
var down_move = 'ArrowDown';

//Colors:
var color_5 = "#ffffff";
var color_15 = "#14b716";
var color_25 = "#e52929";


//The keys and thier listeners:
const input_key_up = document.getElementById('key_up');
const input_key_down = document.getElementById('key_down');
const input_key_left = document.getElementById('key_left');
const input_key_right = document.getElementById('key_right');
input_key_up.addEventListener('keydown', change_key_up);
input_key_down.addEventListener('keydown', change_key_down);
input_key_left.addEventListener('keydown', change_key_left);
input_key_right.addEventListener('keydown', change_key_right);


//this function check if there are two balls with the same color
$(function() {
	$.validator.addMethod( "notEqualTo", function( value, element, param ) {
		return this.optional( element ) || !$.validator.methods.equalTo.call( this, value, element, param );
	}, "The color of each ball should be different." );
    
    //checking if the settings are OK:
	pre_game_validator = $("#pre_game_form").validate({
        rules: {
            num_balls: {
                required: true,
                digits: true,
                range: [50, 90]
            },
            num_ghost: {
                required: true,
                digits: true,
                range: [1, 3]
            },
            time: {
                required: true,
                digits: true,
                min: 60
            },
			point_color_15: {
				notEqualTo: '#point_color_5'
			},
			point_color_25: {
				notEqualTo: '#point_color_5',
				notEqualTo: '#point_color_15'
			}
        },


//if the submit has pressed:
submitHandler: function(form) {
            set_value();
            $('#pre_game').hide();
            $('#board_div').show();
            $('#board').show();

            initiate_keys_and_game();
        }
    });
});

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

//setting the values of all things:
function set_value(){
	balls = document.getElementById('num_balls').value;
	ghosts = document.getElementById('num_ghost').value;  
	time =  document.getElementById('time').value;
	color_5 = document.getElementById('point_color_5').value;
	color_15 = document.getElementById('point_color_15').value;
	color_25 = document.getElementById('point_color_25').value;
}


function clear_settings_form() {
    balls = '';
	ghosts = '';  
	time = '';
    document.getElementById('num_balls').value = '';
    document.getElementById('num_ghost').value = '';
    document.getElementById('time').value = '';
    document.getElementById('point_color_5').value = "#ffffff";
    document.getElementById('point_color_15').value = "#14b716";
    document.getElementById('point_color_25').value = "#e52929";
}

//if the random button clicked:
$("#random").click(function() {
    setKeysValuesToDefault();
    document.getElementById('num_balls').value = Math.ceil(Math.random() * 41) + 49;
    document.getElementById('num_ghost').value = Math.ceil(Math.random() * 3);
    document.getElementById('time').value = Math.ceil(Math.random() * 121) + 59;
	document.getElementById('point_color_5').value = getRandomColor();
	document.getElementById('point_color_15').value = getRandomColor();
	document.getElementById('point_color_25').value = getRandomColor();
});

//set the arrow keys to the default
function setKeysValuesToDefault(){
    up_move = 'ArrowUp';
    input_key_up.value = 'ArrowUp';
    down_move = 'ArrowDown';
    input_key_down.value = 'ArrowDown';
    left_move = 'ArrowLeft';
    input_key_left.value = 'ArrowLeft';
    right_move = 'ArrowRight';
    input_key_right.value = 'ArrowRight';
}



//----------------------------CHANGE KEYS------------------------------------//
function change_key_up(e) {
    var x = e.code;
    var txt;
    var r = confirm("Are you sure you want to change the UP-KEY to " + x + " ?");
    if (r) {
        txt = "The key has been changed!";
        up_move = x;
    } else {
        txt = "The key has not been replaced";
    }
    alert(txt);
    input_key_up.value = x;
}
function change_key_down(e) {
    var x = e.code;
    var txt;
    var r = confirm("Are you sure you want to change the DOWN-KEY to " + x + " ?");
    if (r) {
        txt = "The key has been changed!";
        down_move = x;
    } else {
        txt = "The key has not been replaced";
    }
    alert(txt);
    input_key_down.value = x;
}
function change_key_left(e) {
    var x = e.code;
    var txt;
    var r = confirm("Are you sure you want to change the LEFT-KEY to " + x + " ?");
    if (r) {
        txt = "The key has been changed!";
        left_move = x;
    } else {
        txt = "The key has not been replaced";
    }
    alert(txt);
    input_key_left.value = x;
}
function change_key_right(e) {
    var x = e.code;
    var txt;
    var r = confirm("Are you sure you want to change the RIGHT-KEY to " + x + " ?");
    if (r) {
        txt = "The key has been changed!";
        right_move = x;
    } else {
        txt = "The key has not been replaced";
    }
    alert(txt);
    input_key_right.value = x;
}
//--------------------------------------------------------------------------------//
