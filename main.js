jQuery(document).ready(function($) {

	var mastheadheight = $('.ds-header').outerHeight();
	//console.log(mastheadheight);
	$(".ds-banner,.ds-main-section").css("margin-top" , mastheadheight);

	$(window).scroll(function(){
	    if ($(window).scrollTop() >= 10) {
	        $('.ds-header').addClass('ds-fixed-header');
	    }
	    else {
	        $('.ds-header').removeClass('ds-fixed-header');
	    }
	}).scroll();


});

// view counters
const counter =  document.querySelector(".counter-number");
async function viewCounter() {
	// reference to lambda url
	let response = await fetch("https://lahdbwvkc2556rcb5wy7nktrwy0nflmu.lambda-url.us-east-1.on.aws/");
	let data = await response.json(); 
	counter.innerHTML = `Views: ${data}`;
}
viewCounter(); 