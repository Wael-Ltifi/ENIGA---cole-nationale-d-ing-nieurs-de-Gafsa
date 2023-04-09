function obligatoryFields (fieldsArray) {
	var labelSelectors = [];
	for ( var x in fieldsArray ) {
		labelSelectors.push('label[for='+fieldsArray[x]+']');
	}
	if( labelSelectors.length > 0 )
		$(labelSelectors.join(',')).append("<span class=\"obligatoryFieldMark\">*</span>");
}

regexSpecial = new Array('\\!', '\\^', '\\$', '\\(', '\\)', '\\[', '\\]', '\\{', '\\}', '\\?', '\\+', '\\*', '\\.', '\\/', '\\|');	   
function escape_regex_special (text) {
	for ( x = 0; x < regexSpecial.length; x++ ) {
		text = text.replace(new RegExp(regexSpecial[x], 'g'), regexSpecial[x]);
	}
	return text;
}

(function($) {
/*
 * Function: fnGetColumnData
 * Purpose:  Return an array of table values from a particular column.
 * Returns:  array string: 1d data array
 * Inputs:   object:oSettings - dataTable settings object. This is always the last argument past to the function
 *           int:iColumn - the id of the column to extract the data from
 *           bool:bUnique - optional - if set to false duplicated values are not filtered out
 *           bool:bFiltered - optional - if set to false all the table data is used (not only the filtered)
 *           bool:bIgnoreEmpty - optional - if set to false empty values are not filtered from the result array
 * Author:   Benedikt Forchhammer <b.forchhammer /AT\ mind2.de>
 */
$.fn.dataTableExt.oApi.fnGetColumnData = function ( oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty ) {
    // check that we have a column id
    if ( typeof iColumn == "undefined" ) return new Array();
     
    // by default we only want unique data
    if ( typeof bUnique == "undefined" ) bUnique = true;
     
    // by default we do want to only look at filtered data
    if ( typeof bFiltered == "undefined" ) bFiltered = true;
     
    // by default we do not want to include empty values
    if ( typeof bIgnoreEmpty == "undefined" ) bIgnoreEmpty = true;
     
    // list of rows which we're going to loop through
    var aiRows;
     
    // use only filtered rows
    if (bFiltered == true) aiRows = oSettings.aiDisplay;
    // use all rows
    else aiRows = oSettings.aiDisplayMaster; // all row numbers
 
    // set up data array   
    var asResultData = new Array();
     
    for (var i=0,c=aiRows.length; i<c; i++) {
        iRow = aiRows[i];
        var aData = this.fnGetData(iRow);
        var sValue = aData[iColumn];
         
        // ignore empty values?
        if (bIgnoreEmpty == true && sValue.length == 0) continue;
 
        // ignore unique values?
        else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1) continue;
         
        // else push the value onto the result data array
        else asResultData.push(sValue);
    }
     
    return asResultData;
}}(jQuery));

function dataTableMakeFilterSelect( oTable, i, order, dynamic_filter )
	{
		var aData = oTable.fnGetColumnData(i);
		var r='<div style="display:inline-block;" data-order="'+order+'" class="filter-block"><span>'+$("th:nth-child("+(i+1)+")", oTable).text()+'</span><select id="'+oTable.attr('id')+'_select_filter_'+i+'" data-col-id="'+i+'" '+(dynamic_filter ? 'class="dataTable_dynamic_filter"' : '')+'><option value=""></option>', i, iLen=aData.length;
		for ( i=0 ; i<iLen ; i++ )
		{
			r += '<option value="'+aData[i]+'">'+aData[i]+'</option>';
		}
		return r+'</select></div>';
	}

function dataTableMakeFilterText( oTable, i, order )
	{
		return '<div style="display:inline-block;" data-order="'+order+'" class="filter-block"><span>'+$("th:nth-child("+(i+1)+")", oTable).text()+'</span><input type="text" id="'+oTable.attr('id')+'_text_filter_'+i+'" /></div>';
	}

function dataTableFilter(oTable) 
	{
		var tableID_string = oTable.attr('id');
		var tableID = "#"+tableID_string;
		$('#'+tableID_string+'_filter_zone').remove();
		$(tableID).closest('.dataTable').parent().before('<div id="'+tableID_string+'_filter_zone" class="dataTable_filter_zone"></div>');
		var filterZone = $(tableID+'_filter_zone');
		$("th", tableID).each( function ( i ) {
			if ( $(this).hasClass('filter_select') ) {
				filterZone.append(dataTableMakeFilterSelect( oTable, i, $(this).attr('data-order'), $(this).hasClass("dataTable_dynamic_filter") ));
				$(tableID+'_select_filter_'+i).live('change', function () {
					if ( $(this).val() != "" ) 
						oTable.fnFilter( "^"+escape_regex_special($(this).val())+"$", i, true );
					else	
						oTable.fnFilter( $(this).val(), i);
				} );
			}
			else if ( $(this).hasClass('filter_text') ) {
				filterZone.append(dataTableMakeFilterText( oTable, i, $(this).attr('data-order') ));
				$(tableID+'_text_filter_'+i).live('keyup', function () {
						oTable.fnFilter( $(this).val(), i);
				} );
			}
		});

		$('.dataTable_filter_zone').append($('.dataTable_filter_zone .filter-block').sort(function(a,b){
		   return parseInt(a.getAttribute('data-order'),10)-parseInt(b.getAttribute('data-order'),10)
		}));
		
		var el_cols_to_hide = $('table .dt_hide_col');
		if (el_cols_to_hide.length > 0 )
		{
			var index_cols_to_hide = [];
			$.each( el_cols_to_hide, function( key, value ) {
				index_cols_to_hide.push($(value).index());
			});

			for(col_index in index_cols_to_hide)
			{
				oTable.fnSetColumnVis( index_cols_to_hide[col_index], false );
			}
			ColVis.fnRebuild( oTable );
		}
	}

function dataTable_dynamic_filter(oTable)
	{
		$('.dataTable_filter_zone .dataTable_dynamic_filter').each( function ( i ) {
			var filter_block = $(this).closest(".filter-block");
			filter_block.replaceWith(dataTableMakeFilterSelect( oTable, $(this).attr('data-col-id'), filter_block.attr('data-order'), true ));
		});
	}