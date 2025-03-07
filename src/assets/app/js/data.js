var ocupacaoA;
var ocupacaoB;
var ocupacaoEspacos;

var setarOcupacao = function(j){
  ocupacaoA = j.ocupacao.concat([0]);
  ocupacaoB = j.total.concat([0]);
  ocupacaoEspacos = j.espacos.concat([" "]);
}

var frequenciaHorarios;
var frequenciaData;
var setarFrequencia = function(j){
  frequenciaHorarios = j.horarios;
  frequenciaData = j.reservas;
}

var situacao;
var setarSituacao = function(j){
  situacao = j;
}