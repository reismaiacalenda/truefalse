let status = false;
let subs;
let conectar = function (ws){
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer(ws);

  // console.log(App);
  // console.log("criou consumidor");
}
let bindPortas = function () {
  App.cable.subscriptions.create (
    { channel: "TrueFalseChannel"
    },
    {
      connected: function() {
        status = true;
        subs = this;
        console.log("inscreveu");
      },
      disconnected: function() {
        status = false;
        console.log("desconectooou");
      },
      rejected: function(){
        status = false;
        console.log("nao tá rolando reconectar");
      },
      received: function(msg) {
        // console.log("clicando no refresh...");
        console.log("Caiu no received:");
        console.log(msg);
        json = JSON.parse(msg)

        switch (json.action){
          case "refreshPorta": document.getElementById("refreshButton").click();break;
          case "refreshAgenda": document.getElementById("refreshButton").click();break;
          case "enviarLog": exibirLog(json.data); break;
        }
      },
      let:redirecionarPorta = function(data){
        console.log("caiu no redirecionar passando:");
        console.log(data);
        subs.perform(data.action, data);
      }
    }
  )
}
let closePortas = function (){
  subscription = App.cable.subscriptions.subscriptions[0]
  App.cable.subscriptions.remove(subscription);
  status = false;
}
let getStatus = function (){
  return status;
}

function exibirLog(data){
  $("#m_tree").jstree({
    'core' : {
      'data': JSON.parse(data)
    }
  }); 
}

montarDataTree = function (data){
  $("#m_tree").jstree({
    'core' : {
      'data': data
    }
  }); 
}


montarTreeLocalizacoes = function (data) { 
  $("#kt_tree_localizacoes").jstree({
    "core" : {
        "themes" : {
            "responsive": false
        },
        // so that create works
        "check_callback" : true,
        'data': data
    },
    "types" : {
        "default" : {
            "icon" : "fa fa-folder text-primary"
        },
        "file" : {
            "icon" : "fa fa-file  text-primary"
        }
    },
    "state" : { "key" : "demo2" },
    "plugins" : [ "state", "types" ]
});   
}