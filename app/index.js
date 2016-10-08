const { socket } = io

Notification.requestPermission()


angular
    .module('App', ['ui.router'])
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

        $urlRouterProvider.otherwise('/login')
    })
    .controller('MainCtrl', ($rootScope, $scope, $timeout, $state) => {
        io.sails.url = 'https://lcchat.herokuapp.com/'

        $scope.user = {}
        $rootScope.messages = []
        $rootScope.currentRoom = {}

        socket.on('message', res => {
            new Notification(res.body)
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
            $state.go('rooms')
        }
    })
