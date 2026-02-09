import HomeScreen from './components/HomeScreen'

function App() {
  const handleCreateRoom = () => {
    console.log('Create room clicked')
    // TODO: WebSocket logic to create room
  }

  const handleJoinRoom = (roomCode) => {
    console.log('Join room:', roomCode)
    // TODO: WebSocket logic to join room
  }

  return <HomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
}

export default App
