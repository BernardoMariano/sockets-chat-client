angular
    .module('App')
    .controller('ChatCtrl', function ($rootScope, $scope, $state) {
        $rootScope.messages = []

        $scope.leaveRoom = () => {
            socket.post('https://lcchat.herokuapp.com/soquete/leaveRoom', { roomName: $rootScope.currentRoom.name })
            $state.go('rooms')
            $rootScope.currentRoom = null
        }

        $scope.sendIfEnter = ($event) => {
            if ($event.which === 13) {
                $event.preventDefault()
                $scope.send()
            }
        }

        $scope.send = () => {
            const { user, body } = $scope
            const { name } = user

            if (!body) return

            socket.post('https://lcchat.herokuapp.com/soquete/message', { name, body })
            $scope.body = ''
        }
    })
