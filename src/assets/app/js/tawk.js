var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();

var construirChatExposto = function (currentUser, versao) {
  var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/5a5e06674b401e45400c221e/default';
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
  Tawk_API.onLoad = function(){
    Tawk_API.setAttributes({
      'name' : currentUser.name,
      'email': currentUser.email,
      'unidade': currentUser.unidade_selecionada,
      'versao': versao
    });
    // 'empresa': currentUser.empresa,
    // 'id': currentUser.id,
  };
};

var construirChatOculto = function (currentUser, versao) {
  var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/5a5e06674b401e45400c221e/default';
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
  Tawk_API.onLoad = function(){
    Tawk_API.hideWidget();
    Tawk_API.setAttributes({
      'name' : currentUser.name,
      'email': currentUser.email,
      'unidade': currentUser.unidade_selecionada,
      'versao': versao
    });
  };
  Tawk_API.onChatMinimized = function(){
    Tawk_API.hideWidget();
  };
};

var esconderChat = function () {
  Tawk_API.hideWidget();
}

//TESTES de chamadas boladas
//   // Tawk_API.addTags(['hello', 'world'], function(error){});
//   Tawk_API.addEvent('product-add-to-cart', {
//     'sku'    : 'A0012',
//     'name'  : 'Jeans',
//     'price' :'50'
// }, function(error){});

var abrirChat = function(){
  if(Tawk_API.isChatHidden()){
    Tawk_API.showWidget();
  }
  Tawk_API.maximize();
}
