$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var min = Date.parse( $('#min').val());
        var max = Date.parse( $('#max').val());
        var debut = Date.parse( data[9]) ; // use data for the dat column
        var fin = Date.parse( data[10]) ; 
 
        if ( ( isNaN( min ) && isNaN( max ) ) ||
             ( isNaN( min ) && fin <= max ) ||
             ( min <= debut   && isNaN( max ) ) ||
             ( min <= debut   && fin <= max ) )
        {
            return true;
        }
        return false;
    }
);
 
$(document).ready(function() {
    var table = $('#tab').DataTable();
     
    // Event listener to the two range filtering inputs to redraw on input
    $('#min, #max').keyup( function() {
        table.draw();
    } );
} );