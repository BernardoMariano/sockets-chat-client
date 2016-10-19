angular
    .module('App')
    .controller('RoomsCtrl', function ($rootScope, $scope, $state, API_ENDPOINT) {
        $scope.createRoom = () => {
            socket.post(API_ENDPOINT + '/soquete/createRoom', { roomName: $scope.newRoom })
            $scope.newRoom = ''
        }

        $scope.enterRoom = room => {
            socket.post(API_ENDPOINT + '/soquete/enterRoom', { roomName: room.name })
            $rootScope.currentRoom = room
            $state.go('room', {
                slug: room.name
            })
        }
    })
