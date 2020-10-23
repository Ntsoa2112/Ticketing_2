$(document).ready(function () {
    $('#tab').DataTable({
        pagingType: "simple_numbers",
        lengthMenu:[10,15,25,35,45,55],
        order:[[1,'desc'], [0, 'asc']],
        language: {

            url: "DataTables/media/French.json"
        }
    });

    

});

//https://connect.ed-diamond.com/GNU-Linux-Magazine/GLMF-189/DataTables-interagir-avec-les-tableaux-HTML