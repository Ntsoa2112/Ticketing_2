/*
$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var min = Date.parse( $('#min').val());
        var max = Date.parse( $('#max').val());
        var debut = Date.parse( data[9]) ; // use data for the dat column
        var fin = Date.parse( data[10]) ; 
        console.log(min + " *** " + max)
 
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
*/
$(document).ready(function() {
    $('#tab').css("font-size", 14).DataTable( {
        pagingType: "simple_numbers",
        lengthMenu:[10,15,25,35,45,55],
        order:[[1,'desc'], [0, 'asc']],
        language: {

            url: "DataTables/media/French.json"
        },
        initComplete: function () {
            this.api().columns([0,1,2,3,4,6,7,8,9,10]).every( function () {
                var column = this;
                var select = $('<select style="margin-left:-15px; color:black;"><option value=""></option></select>')
                    .appendTo( $(column.header()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    });
 
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );
        }
    } );
    //var table = $('#tab').DataTable();
     
    // Event listener to the two range filtering inputs to redraw on input
    /*
    $('#min, #max').change( function() {
        table.draw();
    } );
    */
} );

//https://connect.ed-diamond.com/GNU-Linux-Magazine/GLMF-189/DataTables-interagir-avec-les-tableaux-HTML