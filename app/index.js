const { socket } = io

Notification.requestPermission()


angular
    .module('App', ['ui.router', 'ngMaterial'])
    // .constant('API_ENDPOINT', 'https://lcchat.herokuapp.com')
    .constant('API_ENDPOINT', 'http://192.168.1.154:1337')
    .config(($stateProvider, $urlRouterProvider, $locationProvider, API_ENDPOINT) => {

        $stateProvider
            .state({
                name: 'login',
                url: '/login',
                templateUrl: '/app/login-form/index.html'
            })
            .state({
                name: 'rooms',
                url: '/rooms',
                controller: 'RoomsCtrl',
                templateUrl: '/app/rooms-list/index.html'
            })
            .state({
                name: 'room',
                url: '/room/:slug/',
                params: {
                    slug: null
                },
                controller: 'ChatCtrl',
                templateUrl: '/app/chat-room/index.html'
            })

        // $locationProvider.html5Mode(true).hashPrefix('!')

        $urlRouterProvider.otherwise('/login')
    })
    .controller('MainCtrl', ($rootScope, $scope, $timeout, $state, API_ENDPOINT) => {
        io.sails.url = API_ENDPOINT

        $scope.user = {}
        $rootScope.messages = []
        $rootScope.currentRoom = {}
        $rootScope.isLoggedIn = false

        socket.on('message', res => {
            if (res.sender !== $scope.user.name) {
                new Notification(res.body)
            }
            $rootScope.messages.push(res)
            $scope.$apply()
        })

        socket.on('room', res => {
            $scope.rooms = res
            $scope.$apply()
        })

        socket.on('externalAction', res => {
            $rootScope.externalAction = res
            $scope.$apply()
        })

        $scope.login = () => {
            const { name } = $scope.user
            socket.get(API_ENDPOINT + '/soquete/init', { name })
            socket.get(API_ENDPOINT + '/soquete/listRoom', { name })
            $rootScope.isLoggedIn = true
            $state.go('rooms')
        }

        $scope.mainLink = () => {
            if (!!$rootScope.currentRoom) {
                socket.post(API_ENDPOINT + '/soquete/leaveRoom', { roomName: $rootScope.currentRoom.name })
                $rootScope.currentRoom = null
            }
            $state.go('rooms')
        }

        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== 'login' && !$rootScope.isLoggedIn) {
                event.preventDefault()
                $state.go('login');
            }
        })
    })
