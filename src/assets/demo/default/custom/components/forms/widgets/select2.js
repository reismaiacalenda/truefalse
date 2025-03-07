//== Class definition
var hostFuncionarios;
var hostEspacos;
function iniciarHosts(){
    if (window.location.port == ""){
        hostFuncionarios = "/api/v1/funcionarios/list.json"; 
        hostEspacos = "/api/v1/espacos/listSelect2.json"; 
    }else{
        hostFuncionarios = "http://" + window.location.hostname + ":3000/api/v1/funcionarios/list.json";
        hostEspacos = "http://" + window.location.hostname + ":3000/api/v1/espacos/list.json";
    }
} 

var Select2 = function() {
    //== Private functions
    var demos = function() {
        // basic
        $('#m_select2_1, #m_select2_1_validate').select2({
            placeholder: "Select a state"
        });

        // nested
        $('#m_select2_2, #m_select2_2_validate').select2({
            placeholder: "Select a state"
        });

        // multi select
        $('#m_select2_31, #m_select2_31_validate').select2({
            placeholder: "Selecione um responsável",
            maximumSelectionLength: 1
        });

        $('#m_select2_32, #m_select2_32_validate').select2({
            placeholder: "Selecione o(s) convidado(s)"
        });

        $('#m_select2_33, #m_select2_33_validate').select2({
            placeholder: "Selecione a(s) espaco(s)",
            maximumSelectionLength: 1
        });

        $('#m_select2_37, #m_select2_37_validate').select2({
            placeholder: "Selecione a(s) espaco(s)"
        });

        $('#m_select2_34, #m_select2_34_validate').select2({
            placeholder: "Selecione um autor",
            maximumSelectionLength: 1
        });

        $('#m_select2_35, #m_select2_35_validate').select2({
            placeholder: "Selecione...",
            maximumSelectionLength: 1
        });

        // basic
        $('#m_select2_4').select2({
            placeholder: "Select a state",
            allowClear: true
        });

        // loading data from array
        var data = [{
            id: 0,
            text: 'Enhancement'
        }, {
            id: 1,
            text: 'Bug'
        }, {
            id: 2,
            text: 'Duplicate'
        }, {
            id: 3,
            text: 'Invalid'
        }, {
            id: 4,
            text: 'Wontfix'
        }];

        $('#m_select2_5').select2({
            placeholder: "Select a value",
            data: data
        });

        // loading remote data

        function formatRepo(repo) {
            console.log("wat");
            console.log(repo);
            if (repo.loading) return repo.text;
            var markup = "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__meta'>" +
                "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";
            if (repo.description) {
                markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
            }
            markup += "<div class='select2-result-repository__statistics'>" +
                "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.forks_count + " Forks</div>" +
                "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.stargazers_count + " Stars</div>" +
                "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.watchers_count + " Watchers</div>" +
                "</div>" +
                "</div></div>";
            return markup;
        }

        function formatRepoSelection(repo) {
            return repo.text.slice(0,7); //|| repo.text;
        }

        function formatRepoSelectionWithoutSlice(repo) {
            return repo.text; //|| repo.text;
        }

        $("#m_select2_61").select2({
            placeholder: "Busque pelo responsável:",
            allowClear: true,
            ajax: {
                url: hostFuncionarios,
                dataType: 'json',
                delay: 400,
                data: function(params) {
                    return {
                        q: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function(data, params) {
                    // parse the results into the format expected by Select2
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    params.page = 1;
                    return {
                        results: data.funcionarios,
                        pagination: {
                            more: false
                        }
                    };
                },
                cache: true
            },
            // escapeMarkup: function(markup) {
            //     return markup;
            // }, // let our custom formatter work
            maximumSelectionLength: 1,
            // templateResult: formatRepo, // omitted for brevity, see the source of this page
            templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
        });

        $("#m_select2_62").select2({
            placeholder: "Busque pelos participantes:",
            allowClear: true,
            ajax: {
                url: hostFuncionarios,
                dataType: 'json',
                delay: 400,
                data: function(params) {
                    return {
                        q: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function(data, params) {
                    // parse the results into the format expected by Select2
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    params.page = 1;
                    return {
                        results: data.funcionarios,
                        pagination: {
                            more: false
                        }
                    };
                },
                cache: true
            },
            // escapeMarkup: function(markup) {
            //     return markup;
            // }, // let our custom formatter work
            // minimumInputLength: 1,
            // templateResult: formatRepo, // omitted for brevity, see the source of this page
            templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
        });
        var count = 0;
        $("#m_select2_64").select2({
            placeholder: "Adicione o e-mail dos participantes:",
            allowClear: true,

            // function(params) {
            //     console.log("parannnnnns");
            //     console.log(params);
            // },
            // ab = function(params) {
            //     return params.term;
            // },
            tags: true,

            // data: [{"id": count, "text": "a"}],
            // ajax: {
            //     url: hostFuncionarios,
            //     dataType: 'json',
            //     delay: 400,
            //     data: function(params) {
            //         return {
            //             q: params.term, // search term
            //             page: params.page
            //         };
            //     },
            //     processResults: function(data, params) {
            //         count++;
            //         var ovo =  
            //             [{"id": count, "text": params.term}]
            //         ;
            //         data = ovo;
            //         params.page = 1;
            //         return {
            //             results: ovo,
            //             pagination: {
            //                 more: false
            //             }
            //         };
            //     }
            //     // cache: true
            // },
            // escapeMarkup: function(markup) {
            //     return markup;
            // }, // let our custom formatter work
            // minimumInputLength: 1,
            maximumInputLength: 50,
            maximumSelectionLength: 1000,
            // templateResult: formatRepo, // omitted for brevity, see the source of this page
            templateSelection: formatRepoSelectionWithoutSlice // omitted for brevity, see the source of this page
        });

        $("#m_select2_63").select2({
            placeholder: "Busque  ovo pelas espacos:",
            allowClear: false,
            ajax: {
                url: hostFuncionarios,
                dataType: 'json',
                delay: 400,
                data: function(params) {
                    return {
                        q: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function(data, params) {
                    // parse the results into the format expected by Select2
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    params.page = 1;
                    return {
                        results: data.espacos,
                        pagination: {
                            more: false
                        }
                    };
                },
                cache: true
            },
            // escapeMarkup: function(markup) {
            //     return markup;
            // }, // let our custom formatter work
            // minimumInputLength: 1,
            // templateResult: formatRepo, // omitted for brevity, see the source of this page
            templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
        });

        // custom styles

        // tagging support
        $('#m_select2_12_1, #m_select2_12_2, #m_select2_12_3, #m_select2_12_4').select2({
            placeholder: "Select an option",
        });

        // disabled mode
        $('#m_select2_7').select2({
            placeholder: "Select an option"
        });

        // disabled results
        $('#m_select2_8').select2({
            placeholder: "Select an option"
        });

        // limiting the number of selections
        $('#m_select2_9').select2({
            placeholder: "Select an option",
            maximumSelectionLength: 2
        });

        // hiding the search box
        $('#m_select2_10').select2({
            placeholder: "Select an option",
            minimumResultsForSearch: Infinity
        });

        // tagging support
        $('#m_select2_11').select2({
            placeholder: "Add a tag",
            tags: true
        });
    }

    var modalDemos = function() {
        $('#m_select2_modal').on('shown.bs.modal', function () {
            // basic
            $('#m_select2_1_modal').select2({
                placeholder: "Select a state"
            });

            // nested
            $('#m_select2_2_modal').select2({
                placeholder: "Select a state"
            });

            // multi select
            $('#m_select2_3_modal').select2({
                placeholder: "Select a state",
            });

            // basic
            $('#m_select2_4_modal').select2({
                placeholder: "Select a state",
                allowClear: true
            }); 
        });
    }

    //== Public functions
    return {
        init: function() {
            iniciarHosts();
            demos();
            modalDemos();
        }
    };
}();

//== Initialization
jQuery(document).ready(function() {
    Select2.init();
});