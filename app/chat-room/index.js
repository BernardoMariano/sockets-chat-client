angular
    .module('App')
    .controller('ChatCtrl', function ($rootScope, $scope, $state, API_ENDPOINT) {
        $rootScope.messages = []

        $scope.leaveRoom = () => {
            socket.post(API_ENDPOINT + '/soquete/leaveRoom', { roomName: $rootScope.currentRoom.name })
            $state.go('rooms')
            $rootScope.currentRoom = null
        }

        $scope.checkIfEnter = ($event) => {
            if ($event.which === 13) {
                $event.preventDefault()
                $scope.send()
            }
        }

        $scope.handleKeypress = ($event) => {
            socket.post(API_ENDPOINT + '/soquete/externalAction', { action: 'typing' })
        }

        $scope.send = () => {
            const { user, body } = $scope
            const { name } = user

            if (!body) return

            socket.post(API_ENDPOINT + '/soquete/message', { name, body })
            $scope.body = ''
        }
    })
