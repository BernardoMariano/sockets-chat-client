angular
    .module('App')
    .controller('RoomsCtrl', function ($rootScope, $scope, $state) {
        $scope.createRoom = () => {
            socket.post('https://lcchat.herokuapp.com/soquete/createRoom', { roomName: $scope.newRoom })
            $scope.newRoom = ''
        }

        $scope.enterRoom = room => {
            socket.post('https://lcchat.herokuapp.com/soquete/enterRoom', { roomName: room.name })
            $rootScope.currentRoom = room
            $rootScope.messages = []
            $state.go('room', {
                slug: room.name
            })
        }
    })
