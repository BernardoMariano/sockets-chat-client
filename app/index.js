const { socket } = io

Notification.requestPermission()


angular
    .module('App', ['ui.router', 'ngMaterial'])
    .config(($stateProvider, $urlRouterProvider, $locationProvider) => {

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

        $locationProvider.html5Mode(true).hashPrefix('!')

        $urlRouterProvider.otherwise('/login')
    })
    .controller('MainCtrl', ($rootScope, $scope, $timeout, $state) => {
        io.sails.url = 'https://lcchat.herokuapp.com/'

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

        $scope.login = () => {
            const { name } = $scope.user
            socket.get('https://lcchat.herokuapp.com/soquete/init', { name })
            socket.get('https://lcchat.herokuapp.com/soquete/listRoom', { name })
            $rootScope.isLoggedIn = true
            $state.go('rooms')
        }

        $scope.mainLink = () => {
            if (!!$rootScope.currentRoom) {
                socket.post('https://lcchat.herokuapp.com/soquete/leaveRoom', { roomName: $rootScope.currentRoom.name })
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
