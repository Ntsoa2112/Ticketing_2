$(document).ready(function () {
    $('#tab').DataTable({
        pagingType: "simple_numbers",
        lengthMenu:[5,10,15,20,25],
        order:[[1,'desc'], [0, 'asc']],
        language: {

            url: "DataTables/media/French.json"
        }
    });

    $('#tab2').DataTable({
        pagingType: "simple_numbers",
        lengthMenu:[5,10,15,20,25],
        order:[[1,'desc'], [0, 'asc'],[0, 'asc'],[0, 'asc'], [0, 'asc'],[0, 'asc'],[0, 'asc'],[0, 'asc'],[0, 'asc'],[0, 'asc']],
        language: {
            url: "DataTables/media/French.json"
        }
    });

    $('#tab3').DataTable({
        pagingType: "simple_numbers",
        lengthMenu:[5,10,15,20,25],
        order:[[1,'desc'], [0, 'asc'],[0, 'asc'],[0, 'asc'], [0, 'asc'],[0, 'asc'],[0, 'asc'],[0, 'asc'],[0, 'asc'],[0, 'asc']],
        language: {
            url: "DataTables/media/French.json"
        }
    });

});

//https://connect.ed-diamond.com/GNU-Linux-Magazine/GLMF-189/DataTables-interagir-avec-les-tableaux-HTML