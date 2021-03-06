angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angularMoment', 'ngCordovaOauth'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login-default.html',
    controller: 'LoginCtrl'
  })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.campaign', {
    url: '/campaigns/:id',
    resolve: {
      campaign: function($stateParams, campaigns, places) {
        return campaigns.find($stateParams.id).then(function(campaign) {
          return places.find(campaign.place_id).then(function(place) {
            campaign.place = place;
            return campaign
          });
        });
      }
    },
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-campaign.html',
        controller: 'CampaignCtrl'
      }
    }
  })

  .state('tab.issue', {
    resolve: {
      issue: function($stateParams, $q, issues, campaigns, places) {
        return $q(function(resolve, reject) {
          $q.all([
            issues.find($stateParams.id),
            campaigns.for_issue($stateParams.id)
          ]).then(function(results) {
            var issue = results[0];
            issue.campaigns = results[1];

            $q.all(_.map(issue.campaigns, function(campaign) {
              return places.find(campaign.place_id).then(function(place) {
                campaign.place =  place;
              });
            })).then(function() {
              resolve(issue);
            });
          });
        });
      }
    },
    url: '/issues/:id',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-issue.html',
        controller: 'IssueCtrl'
      }
    }
  })

  .state('tab.place', {
    resolve: {
      place: function($q, $stateParams, places, campaigns) {
        return $q.all([
          places.find($stateParams.id),
          campaigns.for_place($stateParams.id)
        ]).then(function(results) {
          var place = results[0];
          var campaigns = results[1];
          place.campaigns = campaigns;

          return $q.all(_.map(campaigns, function(campaign) {
            return places.find(campaign.place_id).then(function(this_place) {
              campaign.place = this_place;
            });
          })).then(function() {
            return place;
          });
        });
      }
    },
    url: '/places/:id',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-place.html',
        controller: 'PlaceCtrl'
      }
    }
  })

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('tab.news', {
    url: '/news',
    views: {
      'tab-news': {
        templateUrl: 'templates/tab-news.html',
        controller: 'NewsCtrl'
      }
    }
  })

  .state('tour', {
    url: '/tour',
    templateUrl: 'templates/tour-default.html',
    controller: 'TourDefaultCtrl'
  });

  $urlRouterProvider.otherwise('/tab/home');

});
