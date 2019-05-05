
//check if the welcome has clicked
$("#menu_welcome").click(function() {
	clear_ALL_game();
	hideAll();
	$('#welcome').show();
});

//check if the login has clicked
$("#login_btn, #menu_login").click(function() {
	clear_ALL_game();
	hideAll();
	document.getElementById('login_user_name').value = '';
	document.getElementById('login_password').value = '';
	$('#login').show();
});

//check if the register has clicked
$("#register_btn, #menu_register").click(function() {
	clear_ALL_game();
	hideAll();
	document.getElementById('first_name').value = '';
	document.getElementById('last_name').value = '';
	document.getElementById('user_name').value = '';
	document.getElementById('password').value = '';
	document.getElementById('confirm_password').value = '';
	document.getElementById('email').value = '';
	document.getElementById('birthday').value = '';
	$('#register').show();
});

function hideAll(){
	$('#welcome').hide();
	$('#login').hide();
	$('#register').hide();
	$('#about').hide();
	$('#game').hide();
	$('#board').hide();
	$('#board_div').hide();
	$('#pre_game').hide();
};


// ABOUT page -- MODAL
//check if the about has clicked
$("#menu_about").click(function() {
	$('#about').show();
});