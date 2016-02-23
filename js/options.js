$(function () {
	function create_button (id, text) {
		btn_html = '<button type="button" id="' + id + '" class="btn btn-default options">' + text + '</button>';

		return btn_html;
	}

	// Create a div to hold buttons
	$("body").append('<div id="buttons"></div>');

	// Add buttons to div
	$("#buttons").append(create_button("choose_character", "Choose Character"));
	$("#buttons").append(create_button("view_rules", "View Rules"));

	// Show player options on click
	$("#choose_character").click(function () {
		$("#character").modal('show');
	});

	// Show games rules on click
	$("#view_rules").click(function () {
		$("#rules").modal('show');
	})

	// Change player on selection
	$("input[name=character]").click(function () {
		player.change_sprite($("input[name=character]:checked").attr("id"));
		$("#character").modal('hide');
	});
});