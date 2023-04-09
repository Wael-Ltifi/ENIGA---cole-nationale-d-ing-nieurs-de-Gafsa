$(document).ready(function(){
	//Change the default display to 50 rows
	var pageDataTables = $('.dataTable').dataTable();
	pageDataTables.each(function( index ) {
		var el = $(this).dataTable();
		var oSettings = el.fnSettings();
		oSettings._iDisplayLength = 50;
		el.fnDraw();
	});
	$('select[name=Table_length]').val(50);
	$('select[name=Table_length] option[value=50]').attr("selected", true);

	//Set the current tab
	$('#tabs6').find('li[data-action='+url_action+']').addClass('current');
});