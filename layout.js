$(document).ready(function () {

	// this layout could be created with NO OPTIONS - but showing some here just as a sample...
	// myLayout = $('body').layout(); -- syntax with No Options

	myLayout = $('body').layout(layoutSettings);

	myLayout.addToggle("showBigBar", "north");

	// if there is no state-cookie, then DISABLE state management initially
	var cookieExists = !$.isEmptyObject( myLayout.readCookie() );
	if (!cookieExists) toggleStateManagement( true, false );

	// 'Reset State' button requires updated functionality in rc29.15+
	if ($.layout.revision && $.layout.revision >= 0.032915)
		$('#btnReset').show();
});

var layoutSettings = {
	//	reference only - these options are NOT required because 'true' is the default
		closable:					true
	,	resizable:					true
	,	slidable:					true
	,	livePaneResizing:			true
	,	spacing_closed:				20
	,	spacing_open:				10
	,	fxSettings_open:			{ easing: "easeInQuint" }

	//	some resizing/toggling settings
	,	north__size:				85
	,	north__slidable:			false
	,	north__resizable:			false
	,	north__initClosed:			true

	,	west__size:					100
	,	west__resizable:			false
	,	west__initClosed:			true

	//	some pane-size settings
	,	center__minWidth:			100
};