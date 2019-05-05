var users = {'a':'a'};  //MAP of user-password
var cur_user = null;
var register_validator = null;
var login_validator = null;

//check if the user name is exist already in the map of users:
$.validator.addMethod('userExist', function(value, element) {
	return this.optional(element) 
		|| !(value in users);
}, 'User name exist, please choose a different name.')

//check if the password is strong enogh (with 8 chars,at least one number, one letter and one capital letter)
$(function() {
  	$.validator.addMethod('strongPassword', function(value, element) {
		return this.optional(element) 
			|| value.length >= 8
			&& /\d/.test(value)
			&& /[A-Z]/i.test(value)
			&& /[a-z]/i.test(value);
	}, 'Password must contain 8 characters, at least one number and capital letter!')
	
	
	//validate the fields (require, no numbers.. etc..)
	register_validator = $("#register_form").validate({
		rules: {
			first_name: {
				required: true,
				nowhitespace: true,
				lettersonly: true
			},
			last_name: {
				required: true,
				nowhitespace: true,
				lettersonly: true
			},
			user_name: {
				required: true,
				nowhitespace: true,
				userExist: true
			},
			password: {
				required: true,
				strongPassword: true
			},
			confirm_password: {
				required: true,
				equalTo: '#password'
			},
			email: {
				required: true,
				email: true
			},
			birthday: {
				required: true
			}
		},
		messages: {
			email: {
				required: 'Please enter an email address.',
				email: 'Please enter a valid email address.'
			}
		},
		submitHandler: function(form) {
			after_register();
		}
	});
});

//after registration, go to the setting page
function after_register(){
	$('#register').hide();
	sign_up();
	$('#pre_game').show();
}

//add the user to the user-password MAP
function sign_up(){
	users[document.getElementById('user_name').value]=document.getElementById('password').value;
}

//if any register button has pressed:
$("#menu_register,#register_btn").click(function() {
	if (register_validator != null){
		register_validator.resetForm();
	}
});

$(function() {
	login_validator = $("#login_form").validate({
		rules: {
			login_user_name: {
				required: true,
				nowhitespace: true
			},
			login_password: {
				required: true
			}
		},
		submitHandler: function(form) {
			if (check_login()){
				cur_user = document.getElementById('login_user_name').value;
				if (pre_game_validator != null){
					pre_game_validator.resetForm();
				}
				after_login();
			}
			else{
				alert('Username or password is incorrect, please try again!');
				document.getElementById('login_user_name').value = '';
				document.getElementById('login_password').value = '';
			}
		}
	});
});

//checking the login (user -> password)
function check_login(){
	var name = document.getElementById('login_user_name').value;
	if (name in users){ //if the user exist in the MAP
		var pass = document.getElementById('login_password').value;
		if (pass == users[name]){
			return true;
		}
	}
	return false;
}

//if any login button has pressed:
$("#menu_login, #login_btn").click(function() {
	if (login_validator != null){
		login_validator.resetForm();
	}
});

//after the user pressed login button and everything is OK,
//send him to the pre game (settings) page
function after_login(){
	$('#login').hide();
	document.getElementById('lblPlayer').value = cur_user;
	pre_game_settings();
}



function pre_game_settings(){
	clear_settings_form();
	up = 'ArrowUp';
	right = 'ArrowRight';
	left = 'ArrowLeft';
	down = 'ArrowDown';
	document.getElementById('point_color_5').value = "#ffffff";
	document.getElementById('point_color_15').value = "#14b716";
	document.getElementById('point_color_25').value = "#e52929";
	$('#pre_game').show();
}

