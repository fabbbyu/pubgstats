
var pubgApp = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'PUBG Stats',
  // App id
  id: 'com.pubgstats',
  theme: 'ios',
  // Enable swipe panel
  // Add default routes
  routes: [
    {
      name: 'home',
      path: '/home/',
      templateUrl: 'home.html',
      /*options: {
        context: {
          users: ['John Doe', 'Vladimir Kharlampidi', 'Timo Ernst'],
        },
      },*/
      on: {
        pageBeforeIn: function (e, page) {
         

        },
      }
    },
  ],
  // ... other parameters
});

var mainView = pubgApp.views.create('.view-main');

// Export selectors engine
var $$ = Dom7;

Framework7.request.setup({
  headers: {
    'Content-type': 'application/json;charset=UTF-8'
  }
})

//***********HELPERS FUNCTIONS INICIO**************//

var noWiFiOneTime = 0;

function yesWiFi(){
  if(noWiFiOneTime > 0){
    window.location.href = "index.html";
  }
}

function noWiFi(){

  noWiFiOneTime = 1;

  mainView.router.navigate({
    name: 'nowifi',
    reloadCurrent: true,
    ignoreCache: true
  });
}

function onBackKeyDown() {
  var preloader = $$(".preloader-modal");
  if(preloader.is(":visible")){
    console.log("preloader visible");
  }else{
    console.log("preloader not visible");
    if(pagename != "home"){
      mainView.router.back();
    }
  }
}

function backPage(){
  mainView.router.back();
  //marvelApp.preloader.hide(); 
}

pubgApp.navbar.hide($$('.navbar'));

//***********HELPERS FUNCTIONS FIM**************//

//***********ROUTES INICIO**************//

$$(".item-link").each(function(){
  var itemLink = $$(this);
  itemLink.on("click", function(){
    pubgApp.panel.close();
  });
}); 

/*$$(".panel-left").on("click", function(){
    marvelApp.panel.close();
});*/

$$(document).click(function(event) {
    var element = $(event.target);
    //console.log(element.attr('class'));
    if(element.attr('class') == 'panel panel-left panel-reveal panel-active active-state'){
      pubgApp.panel.close();
    }    
});

//***********ROUTES FIM**************//