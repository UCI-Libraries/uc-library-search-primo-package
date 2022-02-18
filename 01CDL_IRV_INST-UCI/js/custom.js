(function () {
  "use strict";
  'use strict';


  var app = angular.module('viewCustom', ['angularLoad', 'externalSearch']);
  var LOCAL_VID = "01CDL_IRV_INST-UCI";
  /** externalSearch **/
  angular
  .module('externalSearch', [])
  .value('searchTargets', [])
  .component('prmFacetAfter', {
    bindings: { parentCtrl: '<' },
    controller: ['externalSearchService', function (externalSearchService) {
      externalSearchService.controller = this.parentCtrl
      externalSearchService.addExtSearch()
    }]
  })
  .component('prmPageNavMenuAfter', {
  controller: ['externalSearchService', function (externalSearchService) {
    if (externalSearchService.controller) externalSearchService.addExtSearch()
  }]
  })
  .component('prmFacetExactAfter', {
    bindings: { parentCtrl: '<' },
    /* Customized the template. Removed some div with chips classes. Added target.desc and span wrapper.
       Changed width/height to 40. */
    template: `
    <div ng-if="name === 'External Search'">
      <div ng-hide="$ctrl.parentCtrl.facetGroup.facetGroupCollapsed">
        <div class="section-content animate-max-height-variable" id="external-search">
          <div ng-repeat="target in targets" aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4">
            <div class="md-chip-content layout-row" role="button" tabindex="0">
              <strong dir="auto" title="{{ target.name }}">
                <a ng-href="{{ target.url + target.mapping(queries, filters) }}" target="_blank">
                  <img ng-src="{{ target.img }}" width="40" height="40"/> {{ target.name }}
                </a>
                <span class="desc">{{target.desc}}</span>
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    controller: ['$scope', '$location', 'searchTargets', function ($scope, $location, searchTargets) {
      $scope.name = this.parentCtrl.facetGroup.name
      $scope.targets = searchTargets
      let query = $location.search().query
      let filter = $location.search().pfilter
      $scope.queries = Array.isArray(query) ? query : query ? [query] : false
      $scope.filters = Array.isArray(filter) ? filter : filter ? [filter] : false
    }]
  })
  .factory('externalSearchService', function () {
  return {
    get controller() {
      return this.prmFacetCtrl || false
    },
    set controller(controller) {
      this.prmFacetCtrl = controller
    },
    addExtSearch: function () {
      // Changed this conditional to look for our intended scope.
      //console.log('test');
      //console.log(this.prmFacetCtrl);
      if (this.prmFacetCtrl.$stateParams.search_scope == 'WorldCatSearch') {
        this.prmFacetCtrl.facetService.results.unshift({
          name: 'External Search',
          displayedType: 'exact',
          limitCount: 0,
          facetGroupCollapsed: false,
          values: undefined
        })
      } else {
        var xx = this;
        var checkExist = setInterval(function() {

           if (xx.prmFacetCtrl.facetService.results[0] && xx.prmFacetCtrl.facetService.results[0].name !="External Search") {
              if (xx.prmFacetCtrl.facetService.results.name !== 'External Search') {
                xx.prmFacetCtrl.facetService.results.unshift({
                  name: 'External Search',
                  displayedType: 'exact',
                  limitCount: 0,
                  facetGroupCollapsed: false,
                  values: undefined
                });
              }
              clearInterval(checkExist);
           }
        }, 50);
      }
    }
  }
  })


  app.value('searchTargets', [{
    "name": "Search Libraries Worldwide (WorldCat)",
    "desc": "for advanced filtering options",
    "url": "https://uci.on.worldcat.org/v2/search?queryString=",
    "img": "/discovery/custom/01CDL_IRV_INST-UCI/img/worldcatbasic.png",
    "img_2": "/discovery/custom/01CDL_IRV_INST-UCI/img/logo_placeholder.png",
    "alt": "Search Libraries Worldwide (WorldCat)",
    mapping: function (queries, filters) {
      try {
        return queries.map(function (part) {
          return part.split(",")[2] || "";
        }).join(' ');
      } catch (e) {
        return '';
      }
    }

  }
  ]);
  // /** END externalSearch **/

  /* UC Library Search Logo */
  app.component('prmSearchBarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'SearchBarAfterController',
    templateUrl: 'custom/01CDL_IRV_INST-UCI/html/prmSearchBarAfter.html'
  });

  app.controller('SearchBarAfterController', ['$scope', '$rootScope', '$location', '$window', function ($scope, $rootScope, $location, $window) {
    var vm = this;

    this.navigateToHomePage = function () {
      var params = $location.search();
      console.log(params);
      var vid = params.vid;
      var lang = params.lang || "en_US";
      var split = $location.absUrl().split('/discovery/');

      if (split.length === 1) {
        console.log(split[0] + ' : Could not detect the view name!');
        return false;
      }

      var baseUrl = split[0];
      $window.location.href = baseUrl + '/discovery/search?vid=' + vid + '&lang=' + lang;
      return true;
    };
  }]);

  /*Shelf Search Link */
  app.controller('ShelfSearchController', ['$scope', function($scope){
    var participants = [];
    //valid prmLocationsAftervar $participants = [];
    participants[0] = "Langson Library East Asian Collection Bound Periodicals";    //marked as deleted in July 2013
    participants[1] = "Langson Library East Asian Collection";
    participants[2] = "Langson Library East Asian Collection Current Periodicals";
    participants[3] = "Langson Library East Asian Collection Monograph Set Basement";   //marked as deleted in July 2013
    participants[4] = "Langson Library East Asian Collection Oversize ";
    participants[5] = "Langson Library East Asian Collection Reference";
    participants[6] = "Langson Library Korea Corner";
    participants[7] = "Langson Library Korea Corner Media";
    participants[8] = "Grunigen Medical Library";
    participants[9] = "Grunigen Medical Library Oversize";
    participants[10] = "Grunigen Medical Library Reference";
    participants[11] = "Grunigen Medical Library Periodicals  (Bound)";
    participants[12] = "Government Information";
    participants[13] = "Langson Library Government Information California";
    participants[14] = "Langson Library Government Information Orange County";
    participants[15] = "Langson Library Government Information Oversize";
    participants[16] = "Science Library Government Information United States";
    participants[17] = "Langson Library Periodicals (Bound)";
    participants[18] = "Langson Current Periodicals Popular";
    participants[19] = "Langson Library";
    participants[20] = "Langson Library Check Out Desk (Protected)";
    participants[21] = "Langson Library Check Out Desk (Critical Theory)";
    participants[22] = "Langson Library Current Periodicals";
    participants[23] = "Langson Library Double Oversize";
    participants[24] = "Langson Library New Books";
    participants[25] = "Langson Library Oversize";
    participants[26] = "Langson Library Triple Oversize";
    participants[27] = "Science Library ";
    participants[28] = "Science Library Bar";
    participants[29] = "Science Library Current Periodicals";
    participants[30] = "Science Library Bar Double Oversize";
    participants[31] = "Science Library Drum";
    participants[32] = "Science Library Bar Oversize";
    participants[33] = "Science Library Bar Triple Oversize";
    participants[34] = "Gateway Study Center Orange County Regional History";
    participants[35] = "Gateway Study Center Southeast Asian Archive";
    //participants[39] = "Law Library Stacks ";
    //participants[40] = "Law Library Faculty Display ";
    //participants[41] = "Law Library Reading Room ";
    //participants[42] = "Law Library Clinic Collection";

    //var baseUrl = "http://naiad.lib.uci.edu/staff/apps/shelfsearch/almaShelfSearch.php?";
    var baseUrl = "https://www.lib.uci.edu/sites/all/scripts/shelfsearch/almaShelfSearch.php?";
    var vm = this;
    var title = "title=";
    var author = "&author=";
    var holdings = "";
    var microform = false;

    $scope.holding = vm.parentCtrl.item.delivery.holding;

    if($scope.holding.length > 0){
      for(var key in $scope.holding){
        var location = JSON.parse(JSON.stringify($scope.holding[key]));
        var locationName = location.subLocation;
        if(location.availabilityStatus == "available" && locationName.includes('Arts Media Center')){
            vm.parentCtrl.item.delivery.holding[key].availabilityStatus = "Check at";
            angular.element(document).ready(function () {
              try {
                var availability = document.getElementsByClassName('availability-status Check at');
                var i;
                for (i = 0; i < availability.length; i++) {
                  availability[i].nextSibling.innerHTML = '';
                }
              } catch(err){}
            });
            window.setInterval(function(){
              try {
                var availability = document.getElementsByClassName('availability-status Check at');
                var j;
                for (j = 0; j < availability.length; j++) {
                  if(availability[j].innerText.includes('Check at') && availability[j].nextElementSibling.innerHTML != ''){
                    availability[j].nextElementSibling.innerHTML = '';
                  }
                }
              } catch(err){}
            }, 500);
        }
        if(participants.includes(locationName) && location.availabilityStatus == "available"){
          $scope.display = vm.parentCtrl.item.pnx.display;
          $scope.adData = vm.parentCtrl.item.pnx.addata;
          if($scope.display != null && $scope.display.type != null && $scope.display.type.length > 0){
            if($scope.display.type == "book"){
              title = title + $scope.adData.btitle;
            } else if($scope.display.type == "journal"){
              title = title + $scope.adData.jtitle;
            }  else if($scope.display.type == "article"){
              title = title + $scope.adData.jtitle;
            } else if($scope.adData.btitle != null && $scope.adData.btitle != ''){
              title = title + $scope.adData.btitle;
            } else if($scope.adData.title != null && $scope.adData.title != ''){
              title = title + $scope.adData.title;
            }
          } else if($scope.adData.btitle != null && $scope.adData.btitle != ''){
            title = title + $scope.adData.btitle;
          } else if($scope.adData.jtitle != null && $scope.adData.jtitle != ''){
            title = title + $scope.adData.jtitle;
          } else if($scope.adData.title != null && $scope.adData.title != ''){
            title = title + $scope.adData.title;
          }
          if($scope.adData.au != ''){
            author = author + $scope.adData.au;
          }
          holdings = holdings + "&loc[]=" + participants.indexOf(locationName) + "|" + encodeURI(location.callNumber);
        }
        //try replacing name of SRLF Locations
        if(locationName.includes("SRLF") || locationName.includes("NRLF")){
          vm.parentCtrl.item.delivery.holding[key].mainLocation = "Off Campus Storage";
        }
        //Microforms
        if(locationName.includes("Microforms")){
          microform = true;
        }
      }
    }
    /* Check if location is microforms */
    $scope.microfilmNote = function() {
      return microform;
    }
    /* Check for holdings */
    $scope.availableHoldings = function() {
      return holdings != "";
    };
    /* Generate shelfsearch url */
    $scope.searchUrl = function() {
        return baseUrl + title + author + holdings;
    };
    /* Report a problem link */
    $scope.commentFormLink = function() {
      let currentUrl =  encodeURIComponent(window.location.href);
      let searchIndex = '';
      if(window.location.href.length > 200) {
        if(currentUrl.search("search_scope") >= 0) {
          searchIndex = currentUrl.search("search_scope");
          currentUrl = currentUrl.substring(0,searchIndex-3);
        } else if(currentUrl.search("jsearch_slot") >= 0) {
          searchIndex = currentUrl.search("jsearch_slot");
          currentUrl = currentUrl.substring(0,searchIndex-9);
        }
      }
      return 'https://lib.uci.edu/send-us-your-comments?loc=primo&sender_referer=' + currentUrl;
    };

  }]);
  /* After locations display info links */
  app.component('prmLocationsAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'ShelfSearchController',
    template: '<br/><a href="https://www.lib.uci.edu/call-numbers" target="_blank">Call Number Locations</a><div ng-if="availableHoldings()"><a href="{{searchUrl()}}" target="_blank" rel="nofollow">Can\'t find this item on the shelf?</a></div><div><a href="{{commentFormLink()}}" class="button-as-link" target="_blank">Report a Problem<md-icon md-svg-icon="action:ic_open_in_new_24px" role="presentation" class="md-primoExplore-theme" style="height:15px;width:15px;min-height:15px !important;min-width:15px !important;"><svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_open_in_new_24px_cache105" y="1752" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg></md-icon></a></div>'
  });
  app.component('prmLocationItemsAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'ShelfSearchController',
    template: '<br/><a href="https://www.lib.uci.edu/call-numbers" target="_blank">Call Number Locations</a><div ng-if="availableHoldings()"><a href="{{searchUrl()}}" target="_blank" rel="nofollow">Can\'t find this item on the shelf?</a></div><div><a href="{{commentFormLink()}}" class="button-as-link" target="_blank">Report a Problem<md-icon md-svg-icon="action:ic_open_in_new_24px" role="presentation" class="md-primoExplore-theme" style="height:15px;width:15px;min-height:15px !important;min-width:15px !important;"><svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_open_in_new_24px_cache105" y="1752" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg></md-icon></a></div>'
  });

  /* How to get it */
  app.controller('FullViewServiceContainerController', ['$scope', function($scope){
    $scope.commentFormLinkViewit = function() {
      let currentUrlViewit = encodeURIComponent(window.location.href);
      let searchIndex = '';
      if(window.location.href.length > 200) {
        if(currentUrlViewit.search("search_scope") >= 0) {
          searchIndex = currentUrlViewit.search("search_scope");
          currentUrlViewit = currentUrlViewit.substring(0,searchIndex-3);
        } else if(currentUrlViewit.search("jsearch_slot") >= 0) {
          searchIndex = currentUrlViewit.search("jsearch_slot");
          currentUrlViewit = currentUrlViewit.substring(0,searchIndex-9);
        }
      }
      return "https://lib.uci.edu/send-us-your-comments?loc=primo&sender_referer=" + currentUrlViewit;
    };
  }]);
  app.component('almaHtgiSvcAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'FullViewServiceContainerController',
    template: '<br/><a href="{{commentFormLinkViewit()}}" class="button-as-link" target="_blank">Report a Problem<md-icon md-svg-icon="action:ic_open_in_new_24px" role="presentation" class="md-primoExplore-theme" style="height:15px;width:15px;min-height:15px !important;min-width:15px !important;"><svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_open_in_new_24px_cache105" y="1752" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg></md-icon></a>'
  });
  /* View it */
  app.controller('prmAlmaViewitController', ['$scope', function($scope){
    $scope.commentFormLinkViewit = function() {
      let currentUrlViewit = encodeURIComponent(window.location.href);
      let searchIndex = '';
      if(window.location.href.length > 200) {
        if(currentUrlViewit.search("search_scope") >= 0) {
          searchIndex = currentUrlViewit.search("search_scope");
          currentUrlViewit = currentUrlViewit.substring(0,searchIndex-3);
        } else if(currentUrlViewit.search("jsearch_slot") >= 0) {
          searchIndex = currentUrlViewit.search("jsearch_slot");
          currentUrlViewit = currentUrlViewit.substring(0,searchIndex-9);
        }
      }
      return "https://lib.uci.edu/send-us-your-comments?loc=primo&sender_referer=" + currentUrlViewit;
    };
  }]);
  app.component('prmAlmaViewitAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'prmAlmaViewitController',
    template: '<br/><a href="{{commentFormLinkViewit()}}" class="button-as-link" target="_blank">Report a Problem<md-icon md-svg-icon="action:ic_open_in_new_24px" role="presentation" class="md-primoExplore-theme" style="height:15px;width:15px;min-height:15px !important;min-width:15px !important;"><svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_open_in_new_24px_cache105" y="1752" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg></md-icon></a>'
  });

  // Begin BrowZine - Primo Integration...
  window.browzine = {
    api: "https://public-api.thirdiron.com/public/v1/libraries/1806",
    apiKey: "********",

    journalCoverImagesEnabled: true,

    journalBrowZineWebLinkTextEnabled: true,
    journalBrowZineWebLinkText: "View Journal Contents",

    articleBrowZineWebLinkTextEnabled: true,
    articleBrowZineWebLinkText: "View Issue Contents",

    articlePDFDownloadLinkEnabled: true,
    articlePDFDownloadLinkText: "Download PDF",

    articleLinkEnabled: true,
    articleLinkText: "Read Article",

    printRecordsIntegrationEnabled: true,

    unpaywallEmailAddressKey: "saclaudi@uci.edu",

    articlePDFDownloadViaUnpaywallEnabled: true,
    articlePDFDownloadViaUnpaywallText: "Download PDF (via Unpaywall)",

    articleLinkViaUnpaywallEnabled: true,
    articleLinkViaUnpaywallText: "Read Article (via Unpaywall)",

    articleAcceptedManuscriptPDFViaUnpaywallEnabled: true,
    articleAcceptedManuscriptPDFViaUnpaywallText: "Download PDF (Accepted Manuscript via Unpaywall)",

    articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true,
    articleAcceptedManuscriptArticleLinkViaUnpaywallText: "Read Article (Accepted Manuscript via Unpaywall)",
  };

  browzine.script = document.createElement("script");
  browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js";
  document.head.appendChild(browzine.script);

  /* Digital bookplates display with browzine code */
  app.controller('digitalBookTitleButtonController', ['$scope', '$location', '$mdDialog', '$anchorScroll', function($scope, $location, $mdDialog, $anchorScroll){
    window.browzine.primo.searchResult($scope);
    let vm = this;
    $scope.display = vm.parentCtrl.result.pnx.display;
    let bookplateText = $scope.display.lds04;

    $scope.hasBookplate = function() {
      return ($scope.display.lds04 != null && $scope.display.lds04 != '' && (JSON.stringify($scope.display.lds04).includes("Purchased by") || JSON.stringify($scope.display.lds04).includes("purchased by") || JSON.stringify($scope.display.lds04).includes("Honor with Books")));
    }

    $scope.getBookplateText = function() {
      let text = JSON.stringify($scope.display.lds04);
      if(text.includes("Verle and Elizabeth")){
        return "purchased by the Verle and Elizabeth Annis Library Endowed Fund";
      } else if(text.includes("Carole Creek Bailey")){
        return "purchased by the Carole Creek Bailey Library Endowed Fund";
      } else if(text.includes("Forest J. and Dolores")){
        return "purchased by the Forest J. and Dolores S. Grunigen Library Endowed Fund";
      } else if(text.includes("Nors S. Josephson")){
        return "purchased by the Nors S. Josephson and Waltraut Abstein-Josephson Library Endowed Fund";
      } else if(text.includes("Sylvia Holden Robb")){
        return "purchased by the Sylvia Holden Robb Library Endowed Fund";
      } else if(text.includes("Salinger Family")){
        return "purchased by the Salinger Family Library Endowed Fund";
      } else if(text.includes("John and Elizabeth Stahr")){
        return "purchased by the John and Elizabeth Stahr Library Fund";
      } else if(text.includes("Honor with Books")) {
        let bookplateTextArray = JSON.stringify(bookplateText).split("(");
        let bookplateButton = bookplateTextArray[0];
        if(bookplateTextArray.length == 1){
          bookplateButton = bookplateTextArray[0].split(":")[1];
          let fundTextArray = bookplateTextArray[0].split("purchased by the");
          bookplateTextArray[0] = fundTextArray[1];
          bookplateTextArray.push("");
        }
        return bookplateButton.replace("\"]","").replace("[\"","");
      } else {
        return "View Bookplate";
      }
    }

    $scope.getBookplateLink = function() {
      let text = JSON.stringify($scope.display.lds04);
      if(text.includes("purchased by the Verle and Elizabeth")){
        return "https://give.lib.uci.edu/bookplate-annis";
      } else if(text.includes("purchased by the Carole Creek Bailey")){
        return "https://give.lib.uci.edu/bookplate-bailey";
      } else if(text.includes("purchased by the Forest J. and Dolores")){
        return "https://partners.lib.uci.edu/bookplate-grunigen";
      } else if(text.includes("purchased by the Nors S. Josephson")){
        return "https://partners.lib.uci.edu/bookplate-josephson";
      } else if(text.includes("purchased by the Sylvia Holden Robb")){
        return "https://partners.lib.uci.edu/bookplate-robb";
      } else if(text.includes("purchased by the Salinger Family")){
        return "https://partners.lib.uci.edu/bookplate-salinger";
      } else if(text.includes("John and Elizabeth Stahr")){
        return "https://partners.lib.uci.edu/bookplate-stahr";
      } else if(text.includes("Honor with Books")) {
        return "https://give.lib.uci.edu/honor-with-books";
      } else {
        return '';
      }
    }

    //finding aid link for SCA
    $scope.hasFindingAid = function() {
      let hasFA = false;
      $scope.delivery = vm.parentCtrl.result.delivery;
      if($scope.delivery.link != null && $scope.delivery.link.length > 0){
        $scope.delivery.link.forEach(function (rawLink, index) {
          if(rawLink.displayLabel.includes("Online items available")){
            hasFA = true;
          }
        });
      }
      return hasFA;
    }

    $scope.getFindingAidLink = function() {
      console.log("scope getFindingAidLink");
      let findingAidLink = "";
      $scope.delivery = vm.parentCtrl.result.delivery;
      if($scope.delivery.link != null && $scope.delivery.link.length > 0){
        $scope.delivery.link.forEach(function (rawLink, index) {
          if(rawLink.displayLabel.includes("Online items available")){
            findingAidLink = rawLink.linkURL;
          }
        });
      }
      return findingAidLink;
    }

    //Custom scripts to change availability text for arts locations
    try {
      $scope.delivery = vm.parentCtrl.result.delivery;
      var subLocationCode = $scope.delivery.bestlocation.subLocationCode;
      var availability = $scope.delivery.bestlocation.availabilityStatus;
      var artsLocations = ["artres","artrf","arts","artsn"];
      if(artsLocations.includes(subLocationCode) && availability == "available"){
        angular.element(document).ready(function () {
          try {
            var sublocation = document.getElementsByClassName('best-location-sub-location');
            var availability = document.getElementsByClassName('available_in_library');
            var originalText = sublocation.item(0).innerText;
            var i;
            for (i = 0; i < availability.length; i++) {
              availability[i].innerText = 'Check at '+ originalText;
            }
          } catch(err){}
        });
        window.setInterval(function(){
          try {
            var sublocation = document.getElementsByClassName('best-location-sub-location');
            var availability = document.getElementsByClassName('available_in_library');
            var originalText = sublocation.item(0).innerText;
            var j;
            for (j = 0; j < availability.length; j++) {
              if(availability[j].innerText.includes('Arts Media Center')){
                availability[j].innerText = 'Check at '+ originalText;
              }
            }
          } catch(err){}
        }, 1000);
      }
    } catch(err){}

  }]);



  app.component('prmSearchResultAvailabilityLineAfter', {
    bindings: { parentCtrl: '<'},
    controller: 'digitalBookTitleButtonController',
    template: '<div ng-if="hasFindingAid()"><a href="{{getFindingAidLink()}}"><md-icon md-font-icon="folder" aria-label="Finding Aid"><?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="24px" width="24px" viewBox="0 0 122.88 95.19" style="enable-background:new 0 0 122.88 95.19" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" d="M2.49,20.74h4.5v-9.86c0-1.37,1.11-2.48,2.48-2.48h4.41V2.48c0-1.37,1.11-2.48,2.48-2.48h40.26 c1.37,0,2.48,1.11,2.48,2.48V8.4h54.29c1.37,0,2.48,1.11,2.48,2.48v9.86h4.53c1.37,0,2.48,1.11,2.48,2.48 c0,0.18-0.02,0.36-0.06,0.52l-8.68,63.8c-0.28,2.08-1.19,4.01-2.59,5.41c-1.38,1.38-3.21,2.24-5.36,2.24H14.7 c-2.16,0-4.03-0.87-5.43-2.26c-1.41-1.41-2.31-3.35-2.54-5.46L0.01,23.48c-0.14-1.36,0.85-2.58,2.21-2.72 C2.32,20.75,2.4,20.75,2.49,20.74L2.49,20.74L2.49,20.74L2.49,20.74L2.49,20.74z M64.03,70.77c0,0.71-0.29,1.36-0.76,1.83 c-0.46,0.46-1.11,0.75-1.82,0.76h-0.02c-0.71,0-1.36-0.29-1.83-0.76c-0.46-0.46-0.75-1.11-0.76-1.82v-8.7h-8.69 c-0.71,0-1.36-0.29-1.83-0.76c-0.46-0.46-0.75-1.11-0.76-1.82v-0.02c0-0.71,0.29-1.36,0.76-1.83c0.46-0.46,1.11-0.75,1.82-0.76h8.7 v-8.69c0-0.71,0.29-1.36,0.76-1.83c0.46-0.46,1.11-0.75,1.82-0.76h0.02c0.71,0,1.36,0.29,1.83,0.76c0.46,0.46,0.75,1.11,0.76,1.82 v8.7h8.7l0,0c0.71,0,1.36,0.29,1.83,0.76c0.46,0.46,0.75,1.11,0.76,1.82v0.02c0,0.71-0.29,1.36-0.76,1.83 c-0.46,0.46-1.11,0.75-1.82,0.76h-8.71V70.77L64.03,70.77L64.03,70.77z M61.45,32c7.44,0,14.18,3.02,19.06,7.89 c4.88,4.88,7.89,11.61,7.89,19.05c0,7.44-3.02,14.19-7.89,19.06c-4.88,4.88-11.61,7.89-19.06,7.89c-7.44,0-14.18-3.02-19.06-7.89 c-4.88-4.88-7.89-11.61-7.89-19.06c0-7.44,3.02-14.18,7.89-19.05C47.27,35.02,54.01,32,61.45,32L61.45,32L61.45,32z M77.15,43.22 c-4.02-4.02-9.58-6.51-15.71-6.51c-6.14,0-11.69,2.49-15.71,6.51s-6.51,9.58-6.51,15.71c0,6.14,2.49,11.69,6.51,15.71 c4.02,4.02,9.58,6.51,15.71,6.51c6.14,0,11.69-2.49,15.71-6.51s6.51-9.58,6.51-15.71C83.66,52.8,81.18,47.24,77.15,43.22 L77.15,43.22L77.15,43.22z M9.47,25.71H5.24l6.43,61.26c0.1,0.98,0.5,1.85,1.1,2.46c0.5,0.5,1.17,0.81,1.93,0.81l91.49,0 c0.75,0,1.38-0.3,1.87-0.79c0.62-0.62,1.03-1.53,1.17-2.55l8.32-61.18L9.47,25.71L9.47,25.71L9.47,25.71L9.47,25.71z M11.95,13.37 v7.36l98.96-1.05v-6.31H56.62c-1.37,0-2.48-1.11-2.48-2.48V4.97h-35.3v5.92c0,1.37-1.11,2.48-2.48,2.48H11.95L11.95,13.37 L11.95,13.37L11.95,13.37z"/></g></svg></md-icon> View digital items</a></div><div ng-if="hasBookplate()"><a href="{{getBookplateLink()}}"  class="bookplateLink" ><span><img src="https://www.lib.uci.edu/sites/all/images/primo/seal-white.png" width="50px" height="50px" style="background-color: #293990; margin: 2px"></span><div class="bookplateLinkText">{{getBookplateText()}}</div></a></div>'
  });


  /*  Adds 'Browse search' page content */
  app.component('prmBrowseSearchAfter', {
    bindings: { parentCtrl: '<' },
    template: '<md-content layout-xs="column" layout="row" class="layout-align-center-start"><div flex="60" flex-xs="100" layout="column"><md-card class="default-card"><md-card-content><p class="browseContentHeadline">Search here if you already know:</p><ul><li>Author</li><li>Title (or the first few words of a title)</li><li>Subject, Call number, or Series</li></ul><br><p>Looking for something else? Try:</p><ul><li><a href="https://uci.primo.exlibrisgroup.com/discovery/jsearch?vid=01CDL_IRV_INST:UCI">Journals@UCI</a> for information about print and online magazines, newspapers, and journals.</li><li><a href="https://uci.primo.exlibrisgroup.com/discovery/search?vid=01CDL_IRV_INST:UCI&tab=Everything">Articles, books, and more</a> by clicking on New Search. (Need it right away? Filter to "Available online.")</li></ul></md-card-content></md-card></div></md-content>'
 });
 /*End 'Browse search' page content*/

 /*VPN popup*/
 app.controller('ipController', ['$scope','$http', '$mdDialog', function($scope, $http, $mdDialog) {
   var vm = this;
   $http.get("https://api.ipify.org?format=json").then(function(response)
   {
     console.log("response " + response.data.ip);
     $scope.ip = response.data.ip;
     var ipRegex1 = /^128\.100\.+/;//placeholder ip
     var ipRegex2 = /^128\.100\.+/;//placeholder ip
     var ipRegex3 = /^128\.100\.+/;//placeholder ip
     var ipRegex4 = /^128\.100\.+/;//placeholder ip
     var ipRegex5 = /^128\.100\.+/;//placeholder ip
     var validIp = false;
     console.log($scope.ip);
     if(ipRegex1.test($scope.ip)){
       console.log("valid ip 1");
       validIp = true;
     } else if(ipRegex2.test($scope.ip)){
       console.log("valid ip 2");
       validIp = true;
     } else if(ipRegex3.test($scope.ip)){
       console.log("valid ip 3");
       validIp = true;
     } else if(ipRegex4.test($scope.ip)){
       console.log("valid ip 4");
       validIp = true;
     } else if(ipRegex5.test($scope.ip)){
       console.log("valid ip 5");
       validIp = true;
     }
     if(!validIp){
     //if(true){
       var name = "primoCookie=";
       var ca = document.cookie.split(';');
       var primoCookie = "";
       for(var i = 0; i < ca.length; i++) {
         var c = ca[i];
         while (c.charAt(0) == ' ') {
           c = c.substring(1);
         }
         if (c.indexOf(name) == 0) {
           primoCookie = c.substring(name.length, c.length);
         }
       }
       if(primoCookie == ""){
         //set primoCookie
         var d = new Date();
         d.setTime(d.getTime() + (0.25 * 24 * 60 * 60 * 1000));
         var expires = "expires="+d.toUTCString();
         document.cookie = "primoCookie=primoSessionCookie;"+ expires + ";path=/";
         var alert = $mdDialog.alert({
            title: 'Attention',
            clickOutsideToClose:true,
            template: '<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\"><md-dialog md-theme="mytheme" style="padding:15px">' +
            '  <div layout="column" layout-align="center start" layout-padding flex tabindex="9999"><md-dialog-content class="vpnButton">' +
            '<p><md-button md-autofocus class="md-icon-button" ng-click="close()" style="float: right;"><i class="material-icons" aria-label="close dialog">close</i></md-button></p>' +
            '<div class="dialog-demo-content" layout="column" layout-align="center center" style="width:100%"><p style="max-width:80% !important;">An activated UCINetID is required to view and access the majority of UC Irvine Libraries\' resources from off-campus.</p><br><md-button class="md-raised md-primary" href="https://www.lib.uci.edu/connect" color="primary" style="text-transform:none !important;">Connect from off-campus. Note: Library Search only works with the Desktop VPN</md-button>' +
            '<md-button ng-click="close()" class="md-raised md-primary" style="text-transform:none !important;">Enter as a GUEST (not all search results will display)</md-button></div>' +
            '  </md-dialog-content></div>' +
            '</md-dialog>',
            scope: angular.extend($scope.$new(), { close: function() {$mdDialog.cancel();} })
         });

         $mdDialog.show(alert).finally(function() {
           alert = undefined;
         });
       }
     }
   });

   /*Alert banner*/
   /*
   window.setInterval(function(){
   let date = new Date();
   if((date.getDate() == 11 && date.getMonth() == 1) || (date.getDate() == 12 && date.getMonth() == 1) || (date.getDate() == 13 && date.getMonth() == 1 && date.getHours <= 1)) {
     setTimeout(()=>{
         if(document.getElementById('customAlertBar') == null){
         let prmAlertBar = document.getElementsByClassName('topbar-wrapper');
         let alertBarDiv = document.createElement('div');
         alertBarDiv.setAttribute('id', 'customAlertBar');
         alertBarDiv.setAttribute('style', 'align-content: center;align-items: center;');
         alertBarDiv.setAttribute('layout-align', 'center center');
         let alertBarInnerDiv = document.createElement('div');
         alertBarInnerDiv.setAttribute('style', 'text-align: center;background-color: #fcd02f;border-radius: 1px;font-size: 18px;');
         alertBarInnerDiv.innerHTML = "Library Search will be unavailable on (Sunday, 2022-February-13 12:00 AM PST to Sunday, 2022-February-13 1:00 AM PST) for System maintenance. Patrons can use <a href=\"https://uci.on.worldcat.org/v2\">Libraries Worldwide (WorldCat)</a> during this time.";
         alertBarDiv.appendChild(alertBarInnerDiv);
         prmAlertBar[0].prepend(alertBarDiv);
         }
     }, 500);
    } else if(document.getElementById('customAlertBar') != null){
       document.getElementById('customAlertBar').setAttribute("style","display:none;");
    }
   }, 10000);
   */
   /*End Alert banner */
 }]);

   app.component('prmTopbarAfter', {
     bindings: {parentCtrl: '<'},
     controller: 'ipController'
   });
 /*End VPN Popup*/

 /*----------below is the code for libchat-----------*/
 app.controller('chatController', ['$scope','$http', '$mdDialog', function($scope, $http, $mdDialog) {
  var vm = this;


  $scope.chat = function() {
    var alert = $mdDialog.alert({
       title: 'Attention',
       clickOutsideToClose:true,
       template: '<div id="libchat_f03fcdb3c2e370a804b43c58fc58c664"></div><style>.s-lch-widget-float.open { height: 55% !important;margin-top: 12% !important;}.s-lch-widget-float {bottom: 200px !important;}</style>',
       scope: angular.extend($scope.$new(), { close: function() {$mdDialog.cancel();} })
    });
    $mdDialog.show(alert).finally(function() {
      alert = undefined;
    });
  }

  }]);


  app.component('prmSearchResultToolBarAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'chatController'
  });
   // Adds the chat button
  (function() {
     var lc = document.createElement('script'); lc.type = 'text/javascript';
     lc.src = 'https://uci.libanswers.com/load_chat.php?hash=f03fcdb3c2e370a804b43c58fc58c664';
     var s = document.getElementsByTagName('script')[0]; s.parentNode.append(lc);
     setTimeout(()=>{
       var widget = document.getElementsByClassName("s-lch-widget-float");
       if(widget != null){
         widget[0].style.bottom = "200px";
         widget[0].style.height = "65%";
         widget[0].style.marginTop = "12%";
       }
     },2000);
   })();

 /*---------------libchat code ends here---------------*/




 /* Test my VPN */
 app.controller('vpnButtonController', ['$scope','$http', '$mdDialog', function($scope, $http, $mdDialog) {
  $scope.range_result = '<div class="vpn-result" style="color: #002949;background-color: #fcd02f;">Still checking your connection, please close the popup and try again</div>' ;
  $http.get("https://api.ipify.org?format=json").then(function(response)
  {
    const ip_address = response.data.ip;
    const range_low_ip_one = '192.168.1.100';
    const range_high_ip_one = '192.168.1.100';

    const range_low_ip_two = '192.168.1.100';
    const range_high_ip_two = '192.168.1.100';

    const range_low_ip_three = '192.168.1.100';
    const range_high_ip_three = '192.168.1.100';

    const range_low_ip_four = '192.168.1.100';
    const range_high_ip_four = '192.168.1.100';

    const range_low_ip_five = '192.168.1.100';
    const range_high_ip_five = '192.168.1.100';

    const range_low_ip_six = '192.168.1.100';
    const range_high_ip_six = '192.168.1.100';

    const range_low_ip_seven = '192.168.1.100';
    const range_high_ip_seven = '192.168.1.100';

    const range_low_ip_eight = '192.168.1.100';
    const range_high_ip_eight = '192.168.1.100';

    const range_low_ip_nine = '192.168.1.100';
    const range_high_ip_nine = '192.168.1.100';

    const range_low_ip_ten = '192.168.1.100';
    const range_high_ip_ten = '192.168.1.100';

    const pass_result = '<div class="vpn-result"><div class="vpn-status connected">You are <strong>ON</strong> the UCI IP range, so you <strong>CAN</strong> access library resources. You are either on the UCI campus, or you are using the VPN from off campus.</div></div>';
    const fail_result = '<div class="vpn-result"><div class="vpn-status no-connection">You are <strong>OFF</strong> the UCI IP range, so you <strong>CANNOT</strong> access library resources. You need to be on the UCI campus, or you need to use the VPN from off campus.</div></div>';
    if (ip_address <= range_high_ip_one && range_low_ip_one <= ip_address) {
      $scope.range_result = pass_result;
    } else if (ip_address <= range_high_ip_two && range_low_ip_two <= ip_address) {
      $scope.range_result = pass_result;
    } else if (ip_address <= range_high_ip_three && range_low_ip_three <= ip_address) {
      $scope.range_result = pass_result;
    } else if (ip_address <= range_high_ip_four && range_low_ip_four <= ip_address) {
      $scope.range_result = pass_result;
    } else if (ip_address <= range_high_ip_five && range_low_ip_five <= ip_address) {
      $scope.range_result = pass_result;
    } else if (ip_address <= range_high_ip_six && range_low_ip_six <= ip_address) {
      $scope.range_result = pass_result;
    } else if (ip_address <= range_high_ip_seven && range_low_ip_seven <= ip_address) {
      $scope.range_result = fail_result;
    } else if (ip_address <= range_high_ip_eight && range_low_ip_eight <= ip_address) {
      $scope.range_result = fail_result;
    } else if (ip_address <= range_high_ip_nine && range_low_ip_nine <= ip_address) {
      $scope.range_result = fail_result;
    } else if (ip_address <= range_high_ip_ten && range_low_ip_ten <= ip_address) {
      $scope.range_result = fail_result;
    } else {
      $scope.range_result = fail_result;
    }
  });


  $scope.showVpnPopup = function() {
    $mdDialog.show ({
      clickOutsideToClose: true,
      preserveScope: true,
      autoWrap: true,
      skipHide: true,
      scope: $scope,
      template: '<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\"><md-dialog md-theme="mytheme" style="padding:15px">' +
      '  <div layout="column" layout-align="center start" layout-padding flex tabindex="9999"><md-dialog-content class="vpnButton">' +
      '<p><md-button md-autofocus class="md-icon-button" ng-click="closeDialog()" style="float: right;"><i class="material-icons" aria-label="close dialog">close</i></md-button></p>' +
      '<div class="dialog-demo-content" layout="column" layout-align="center center" style="width:100%">' +
      $scope.range_result +
      '</div>' +
      '  </md-dialog-content></div>' +
      '</md-dialog>',
      controller: function DialogController($scope, $mdDialog) {
          $scope.closeDialog = function() {
            $mdDialog.hide();
          }
      }
      });
    }
  }]);

  app.component('prmVpnButtonAfter', {
    bindings: { parentCtrl: '<'},
    controller: 'vpnButtonController',
    template: '<div class="vpnButtonDiv"><md-button ng-click="showVpnPopup()" class="md-raised vpnButton">Test my UCI Connection</md-button></div>'
  });

}());
