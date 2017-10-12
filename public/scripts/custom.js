function oneTimeEvents(){
    $(".buggy-link").one("click", function(){
		// console.log("clicked");
		$(this).css('pointer-events','none');
		// console.log($(this).css('pointer-events'));
  		window.setTimeout(function(){
  			$(this).css('pointer-events','auto');
  			// window.setTimeout(function(){console.log($(this).css('pointer-events'));}, 1000);
  		}, 200);
	});
	
    $(".buggy-form").submit(function(){
        $(this).submit(function(){
            return false;
        });
    });
}

oneTimeEvents();