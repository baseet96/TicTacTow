import { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import GameBoard from './components/GameBoard'

function App() {
  const [screen, setScreen] = useState('home') // 'home' or 'game'
  const [roomCode, setRoomCode] = useState('')
  const [playerSymbol, setPlayerSymbol] = useState('')
  const [board, setBoard] = useState(Array(9).fill(''))
  const [currentTurn, setCurrentTurn] = useState('X')
  const [gameStatus, setGameStatus] = useState('waiting') // 'waiting', 'playing', 'win', 'draw'

  const handleCreateRoom = () => {
    // TODO: WebSocket logic to create room
    // Mock for now
    const mockRoomCode = Math.floor(1000 + Math.random() * 9000).toString()
    setRoomCode(mockRoomCode)
    setPlayerSymbol('X')
    setGameStatus('waiting')
    setScreen('game')
    console.log('Create room clicked:', mockRoomCode)
  }

  const handleJoinRoom = (code) => {
    // TODO: WebSocket logic to join room
    // Mock for now
    setRoomCode(code)
    setPlayerSymbol('O')
    setGameStatus('playing')
    setScreen('game')
    console.log('Join room:', code)
  }

  const handleCellClick = (index) => {
    if (board[index] || gameStatus !== 'playing' || currentTurn !== playerSymbol) {
      return
    }
    
    // TODO: Send move via WebSocket
    const newBoard = [...board]
    newBoard[index] = playerSymbol
    setBoard(newBoard)
    setCurrentTurn(currentTurn === 'X' ? 'O' : 'X')
    console.log('Cell clicked:', index)
  }

  const handleLeaveRoom = () => {
    // Reset game state
    setScreen('home')
    setRoomCode('')
    setPlayerSymbol('')
    setBoard(Array(9).fill(''))
    setCurrentTurn('X')
    setGameStatus('waiting')
  }

  if (screen === 'game') {
    return (
      <GameBoard
        roomCode={roomCode}
        playerSymbol={playerSymbol}
        board={board}
        currentTurn={currentTurn}
        gameStatus={gameStatus}
        onCellClick={handleCellClick}
        onLeaveRoom={handleLeaveRoom}
      />
    )
  }

  return <HomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
}

export default App
