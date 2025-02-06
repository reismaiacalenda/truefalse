var meses, reservas;
var reservasPorDuracaoData;
var reservasPorFuncionarioLabel
var reservasPorFuncionarioData;
function setarReservasPorMes(d){
  meses = d.meses;
  reservas = d.reservas;
}

function setarReservasPorFuncionario(d){
  reservasPorFuncionarioLabel = d.label;
  reservasPorFuncionarioData = d.value;
  console.log(reservasPorFuncionarioData);
  console.log(d.dados);
  // d.dados;
}

function setarReservasPorDuracao(d){
  reservasPorDuracaoData = d.pizza
    // [{labl: 1, value: 156}
    // ,{labl: 2, value: 106}
    // ,{labl: 3, value: 38}
    // ,{labl: 5, value: 21}
    // ,{labl: 4, value: 14}
    // ]
}
