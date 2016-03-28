$( document ).ready(function() {
    console.log( "jquery ready!" );

    var mustacheNum = 0;
    var beardNum = 0;
    var hatNum = 0;
    var necklaceNum = 0;
    var glassesNum = 0;

    $( "#glassesbutton" ).click(function() {

    	if($('#glasses').is(':visible')) {

    	   $( "#glasses" ).hide( "slow", function() {
    	   });
    	} else {
    		if (glassesNum == 2){
    			glassesNum = 0;
    		} else {
    			glassesNum =  glassesNum + 1;
    		}
    		$("#glasses").attr("src","./public/glasses"+ glassesNum + ".png");
    		$( "#glasses" ).show();
    	}

    });


    $( "#necklacebutton" ).click(function() {

    	if($('#necklace').is(':visible')) {

    	   $( "#necklace" ).hide( "slow", function() {
    	   });
    	} else {
    		if (necklaceNum == 2){
    			necklaceNum = 0;
    		} else {
    			necklaceNum =  necklaceNum + 1;
    		}
    		$("#necklace").attr("src","./public/necklace"+ necklaceNum + ".png");
    		$( "#necklace" ).show();
    	}

    });

    $( "#beardbutton" ).click(function() {

    	if($('#beard').is(':visible')) {

    	   $( "#beard" ).hide( "slow", function() {
    	   });
    	} else {
    		if (beardNum == 2){
    			beardNum = 0;
    		} else {
    			beardNum =  beardNum + 1;
    		}
    		$("#beard").attr("src","./public/beard"+ beardNum + ".png");
    		$( "#beard" ).show();
    	}

    });

    $( "#hatbutton" ).click(function() {

    	if($('#hat').is(':visible')) {

    	   $( "#hat" ).hide( "slow", function() {
    	   });
    	} else {
    		if (hatNum == 2){
    			hatNum = 0;
    		} else {
    			hatNum =  hatNum + 1;
    		}
    		$("#hat").attr("src","./public/hat"+ hatNum + ".png");
    		$( "#hat" ).show();
    	}

    });

    $( "#mustaschebutton" ).click(function() {
    
    if($('#mustache').is(':visible')) {

    	$( "#mustache" ).hide( "slow", function() {
    	});
    } else {
    	if (mustacheNum == 2){
    		mustacheNum = 0;
    	} else {
    		mustacheNum =  mustacheNum + 1;
    	}
    
    	  $('#mustache').attr("src","./public/mustache"+ mustacheNum + ".png");
    		$( "#mustache" ).show();
    	}
    });


});