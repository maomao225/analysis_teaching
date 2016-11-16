var fn = function(innerHTML,optional) {

	var $con = $('#xy_NVToolTip');
    var style = (optional && optional["style"]) ? optional["style"] : "";
	var HTML = '<div class="nvtooltip" id="xy_NVToolTip" style="'+style+'" ></div>';
    var html2= '<div  id="xy_NVToolTip" class="ui popup top center dot_matrix_wrap_popup"></div>';
    if (optional && optional["showAngle"]){
        HTML = html2;
    }
	if (!$con.length) {
		$con = $(HTML).appendTo('body');
	}else{
        $con.remove();
        $con = $(HTML).appendTo('body');
    }

	var offsetLeft = 0;
	var event = window.event;
	if (optional){
		 if (optional["offsetLeft"]){
			 offsetLeft = optional["offsetLeft"];
		 }
		if (optional["event"]){
			event = optional["event"];
		}
	}

	$con.html(innerHTML);

	setTimeout(function(){
		$con = $('#xy_NVToolTip');
		var $conW = $con.outerWidth();
		var $conH = $con.outerHeight();
		var x = event.x - $conW / 2;
		var y = event.y + $('body').scrollTop() - $conH - 10;
		if (optional && optional["origin"]=="left"){
			x = event.x - $conW-10;
			y = event.y + $('body').scrollTop() - $conH/2 - 10;
		}
		if (optional && optional["showAngle"]){
			x = event.x - offsetLeft;
			y = y -5;
		}
		$con.css({
			left: x,
			top: y
		}).show();
	},200);
};


fn.removeToolTip = function() {
	setTimeout(function(){//防止隐藏后再次弹出
		$('#xy_NVToolTip').hide();
	},200);
};

module.exports = fn;
