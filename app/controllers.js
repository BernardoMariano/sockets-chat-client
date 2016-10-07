const { socket } = io

Notification.requestPermission()


angular
    .module('Soquetes', [])
    .controller('MainCtrl', ($scope, $timeout) => {
        io.sails.url = 'https://lcchat.herokuapp.com/'

        $scope.messages = []

        socket.on('message', res => {
            new Notification(res.body)
            $scope.messages.push(res)
            $scope.$apply()
        })

        socket.on('room', res => {
            $scope.rooms = res
            $scope.$apply()
        })

        $scope.isLoggedIn = false
        $scope.inChatRoom = false

        $scope.login = () => {
            const { name } = $scope
            socket.get('https://lcchat.herokuapp.com/soquete/init', { name })
            $scope.isLoggedIn = true
            socket.get('https://lcchat.herokuapp.com/soquete/listRoom', { name })
        }

        $scope.sendIfEnter = ($event) => {
            if ($event.which === 13) {
                $event.preventDefault()
                $scope.send()
            }
        }

        $scope.send = () => {
            const { name, body } = $scope

            if (!body) return

            socket.post('https://lcchat.herokuapp.com/soquete/message', { name, body })
            $scope.body = ''
        }

        $scope.createRoom = () => {
            socket.post('https://lcchat.herokuapp.com/soquete/createRoom', { roomName: $scope.newRoom })
            $scope.newRoom = ''
        }

        $scope.enterRoom = room => {
            $scope.messages = []
            socket.post('https://lcchat.herokuapp.com/soquete/enterRoom', { roomName: room.name })
            $scope.inChatRoom = true
            $scope.currentRoom = room
        }

        $scope.leaveRoom = () => {
            socket.post('https://lcchat.herokuapp.com/soquete/leaveRoom', { roomName: $scope.currentRoom.name })
            $scope.inChatRoom = false
            $scope.currentRoom = null
        }
    })
