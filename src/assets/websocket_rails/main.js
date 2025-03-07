let dispatcher;
let channel;
let socketStatus = false;

let conectar = function (ws){
  // Connect to websocket
  dispatcher = new WebSocketRails(ws);

  // Notificar conexão estabelecida
  dispatcher.on_open = function(data) {
    socketStatus = true;
  }

  // Notificar queda de rede e reconectar recursivamente
  dispatcher._conn.on_close = function(data){
    socketStatus = false;
    setTimeout(function (){conectar(ws);},10000);
  }

  // Subscribe to the channel
  channel = dispatcher.subscribe('tf');
}

let getStatus = function(){
  return socketStatus;
}

let bindPortas = function(){
  channel.bind('portaConectado', function(data) {
    setTimeout(function(){document.getElementById("refreshButton").click()}, 500);
  });

  channel.bind('portaDesconectado', function(data) {
    document.getElementById("refreshButton").click();
  });
}

let recarregarPagina = function(chave_vinculo_licenca){
  dispatcher.trigger('recarregarPagina', chave_vinculo_licenca);
}

let atualizarDados = function(param_url){
  dispatcher.trigger('atualizarDados', param_url);
}
