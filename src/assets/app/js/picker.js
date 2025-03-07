
var iniciarPicker = function(date){
  var input = document.getElementById('pickerInput');
  var picker = new Picker(input, {
    date: date,
    format: 'HH:mm',
    controls: true,
    container: '.picker-container',
    inline: true,
    headers: true,
    text: {
      title: '',
      hour: 'Hora',
      minute: 'Minuto'
    },
    increment: {
      hour: 1,
      minute: 1,
    },
  });
}