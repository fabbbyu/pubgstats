var baseApiUrl = "https://api.pubg.com/shards";
var pubgApiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwY2Y0NjFmMC0yZmM4LTAxMzctNDFjZS0wMDU3NDUzNGQzNjMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTUzMzY1OTk3LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Ii1mNzU1NmZlOS05ZDQ4LTQ3NDEtODY4My1mNzdhYmI4MjhhM2MifQ.hGpPogxQHxvDbU_VRWMgxlmk7W9p8ARlIC0mhGSQLIg";

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
      on: {
        pageBeforeIn: function (e, page) {
          //pubgApp.preloader.hide();         

        },
        pageInit: function (e, page) {

          pubgApp.preloader.show();
          pagename = page.name;
          //alert(page.name);
          
          var platformSelected = localStorage.getItem("platform");
          var usernameSelected = localStorage.getItem("username");

          console.log("platform: "+platformSelected);
          console.log("username: "+usernameSelected);

          if(platformSelected == "kakao"){
            platformSelectedToShow = "mobile";
          }else{
            platformSelectedToShow = platformSelected;
          }

          $$("#dataHeader").html("PUBG Stats: "+platformSelectedToShow.toUpperCase()+"@"+usernameSelected);

          $$("#platformHome option").each(function(){
            if($$(this).val() == platformSelected){
              $$(this).prop("selected", true);
            }
          });

          $$("#platformIndex option").each(function(){
            if($$(this).val() == platformSelected){
              $$(this).prop("selected", true);
            }
          });

          $$("#usernameHome").val(usernameSelected);

          $.ajax({
            url: baseApiUrl+"/"+platformSelected+"/players?filter[playerNames]="+usernameSelected,
            beforeSend: function(xhr) {
              xhr.setRequestHeader("Authorization", "Bearer "+pubgApiToken);
              xhr.setRequestHeader("Accept", "application/vnd.api+json");
            },
            error:function (xhr, ajaxOptions, thrownError){
                if(xhr.status==404) {
                  pubgApp.dialog.alert("No data found for this user\nChange data and try again");    
                  pubgApp.preloader.hide();  
                  //mainView.router.back();
                }
            },
            success: function(response){
              //console.log(response);
              //decodedData = JSON.stringify(response, null, 4);
              //console.log(decodedData);
              //console.log(response.data[0].relationships.matches.data[1].id);
              var matches = response.data[0].relationships.matches.data;
              //console.log(matches);
              var htmlToAppend = "";

              for(i = 0; i < matches.length; i++){
                /*console.log(matches[i].id+"i "+i);*/
                htmlToAppend += '<li>'+
                                 '<a onclick="openMatch(\''+matches[i].id+'\');" style="text-transform:none;font-size:1rem;">Match id: '+matches[i].id+'</a>'+
                                '</li>';
                
              }

              $$("#userMatchesList").html(htmlToAppend);

              pubgApp.preloader.hide();
            }
          });

        },  

      }
    },
    {
      name: 'match',
      path: '/match/',
      templateUrl: 'match.html',
      on: {
        pageBeforeIn: function (e, page) {
          //pubgApp.preloader.hide();         

        },
        pageInit: function (e, page) {

          pubgApp.preloader.show();
          //pagename = page.name;
          //alert(page.name);
          
          var matchId = localStorage.getItem("matchId");
          var platformSelected = localStorage.getItem("platform");

          console.log("matchId: "+matchId);
          console.log("platform: "+platformSelected);

          $.ajax({
            url: baseApiUrl+"/"+platformSelected+"/matches/"+matchId,
            beforeSend: function(xhr) {
              //xhr.setRequestHeader("Authorization", "Bearer "+pubgApiToken);
              xhr.setRequestHeader("Accept", "application/vnd.api+json");
            },
            success: function(response){
              console.log(response);
              //decodedData = JSON.stringify(response, null, 4);
              //console.log(decodedData);

              if(response.data.attributes.mapName == "Erangel_Main"){
                var mapPlayed = "Erangel";                
              }else if(response.data.attributes.mapName == "Desert_Main"){
                var mapPlayed = "Miramar";
              }else if(response.data.attributes.mapName == "Savage_Main "){
                var mapPlayed = "Sanhok";
              }

              if(response.data.attributes.isCustomMatch){
                isCustomMatch = "Yes";
              }else{
                isCustomMatch = "No";
              }

              var minutesDuration = Math.floor(response.data.attributes.duration / 60)+" min";

              var htmlToAppend = '<p>'+
                                    '<strong>Created at:</strong>&nbsp;<label>'+response.data.attributes.createdAt+'</label><br />'+
                                    '<strong>Duration:</strong>&nbsp;<label>'+minutesDuration+'</label><br />'+
                                    '<strong>Map:</strong>&nbsp;<label>'+mapPlayed+'</label><br />'+
                                    '<strong>Is Custom Match:</strong>&nbsp;<label>'+isCustomMatch+'</label><br />'+
                                  '</p>';
              $$("#matchDetails").find("div").eq(1).html(htmlToAppend);
              pubgApp.preloader.hide();

            }
          });


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

function loadHome(){

  var username = $$("#usernameIndex").val();

  if(username == ""){

    pubgApp.dialog.alert("Username can not to be empty");            
    $$("#usernameIndex").focus();     

  }else{
    localStorage.setItem("username", username);

    var platform = $$("#platformIndex").val();
    localStorage.setItem("platform", platform);

    mainView.router.navigate({
      name: 'home',
      reloadCurrent: true,
      ignoreCache: true
    });
  }

}

function refreshData(){

  var username = $$("#usernameHome").val();

  if(username == ""){

    pubgApp.dialog.alert("Username can not to be empty");            
    $$("#usernameHome").focus();   

  }else{

    localStorage.setItem("username", username);

    var platform = $$("#platformHome").val();
    localStorage.setItem("platform", platform);

    mainView.router.navigate(mainView.router.currentRoute.url, {
      reloadCurrent: true,
      ignoreCache: true,
    });

  }

}

function openMatch(matchId){

  localStorage.setItem("matchId", matchId);

  mainView.router.navigate({
    name: 'match',
    reloadCurrent: true,
    ignoreCache: true
  });

}


$$(".panel-left").on("click", function(){
    pubgApp.panel.close();
});

$$(document).click(function(event) {
    var element = $$(event.target);
    //console.log(element.attr('class'));
    if(element.attr('class') == 'panel panel-left panel-reveal panel-active active-state'){
      pubgApp.panel.close();
    }    
});

//***********ROUTES FIM**************//