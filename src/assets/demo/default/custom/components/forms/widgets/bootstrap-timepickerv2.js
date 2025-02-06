//== Class definition

let bootstrapTimepicker = function(minuteStep){
    //== Private functions
    // var demos = function () {
        // minimum setup
        $('#m_timepicker_1, #m_timepicker_1_modal').timepicker({
            showMeridian: false,
            minuteStep: minuteStep,
            defaultTime: '08:00',
            showSeconds: false,
            snapToStep: true,
            maxTime: '23:50'
        });

        $('#m_timepicker_2, #m_timepicker_2_modal').timepicker({
            showMeridian: false,
            minuteStep: minuteStep,
            defaultTime: '09:00',
            showSeconds: false,
            snapToStep: true,
            minTime:'00:05',
            maxTime: '23:55'
        });

        // minimum setup
        // $('#m_timepicker_2, #m_timepicker_2_modal').timepicker({
        //     minuteStep: 1,
        //     showSeconds: true,
        //     showMeridian: false,
        //     snapToStep: true
        // });

        // default time
        $('#m_timepicker_3, #m_timepicker_3_modal').timepicker({
            defaultTime: '11:45:20 AM',
            minuteStep: 1,
            showSeconds: true,
            showMeridian: true
        });

        // default time
        $('#m_timepicker_4, #m_timepicker_4_modal').timepicker({
            defaultTime: '10:30:20 AM',           
            minuteStep: 1,
            showSeconds: true,
            showMeridian: true
        });

        // validation state demos
        // minimum setup
        $('#m_timepicker_1_validate, #m_timepicker_2_validate, #m_timepicker_3_validate').timepicker({
            minuteStep: 1,
            showSeconds: true,
            showMeridian: false,
            snapToStep: true
        });
    // }

    // return {
    //     // public functions
    //     init: function() {
    //         demos(); 
    //     }
    // };
};

// jQuery(document).ready(function() {    
//     BootstrapTimepicker.init();
// });