import { useState, useEffect } from 'react'
import HomeScreen from './components/HomeScreen'
import GameBoard from './components/GameBoard'
import { useWebSocket } from './hooks/useWebSocket'

function App() {
  const [screen, setScreen] = useState('home') // 'home' or 'game'
  const [roomCode, setRoomCode] = useState('')
  const [playerSymbol, setPlayerSymbol] = useState('')
  const [board, setBoard] = useState(Array(9).fill(''))
  const [currentTurn, setCurrentTurn] = useState('X')
  const [gameStatus, setGameStatus] = useState('waiting') // 'waiting', 'playing', 'win', 'draw'

  const { send, on, isConnected } = useWebSocket('ws://localhost:3000')

  useEffect(() => {
    // Handle room_created event
    on('room_created', (message) => {
      setRoomCode(message.roomCode)
      setPlayerSymbol(message.player)
      setGameStatus('waiting')
      setBoard(Array(9).fill(''))
      setCurrentTurn('X')
      setScreen('game')
    })

    // Handle room_joined event
    on('room_joined', (message) => {
      setRoomCode(message.roomCode)
      setPlayerSymbol(message.player)
      setGameStatus('playing')
      setBoard(message.board)
      setCurrentTurn(message.currentTurn)
      setScreen('game')
    })

    // Handle game_started event (when second player joins)
    on('game_started', (message) => {
      setGameStatus('playing')
      setBoard(message.board)
      setCurrentTurn(message.currentTurn)
    })

    // Handle move_made event
    on('move_made', (message) => {
      setBoard(message.board)
      setCurrentTurn(message.currentTurn)
      setGameStatus('playing')
    })

    // Handle game_over event
    on('game_over', (message) => {
      setBoard(message.board)
      if (message.winner === 'draw') {
        setGameStatus('draw')
      } else {
        setGameStatus('win')
        setCurrentTurn(message.winner)
      }
    })

    // Handle error event
    on('error', (message) => {
      console.error('Server error:', message.message)
      alert(message.message)
    })

    // Handle opponent_left event
    on('opponent_left', (message) => {
      alert(message.message)
      // Reset to home screen
      setScreen('home')
      setRoomCode('')
      setPlayerSymbol('')
      setBoard(Array(9).fill(''))
      setCurrentTurn('X')
      setGameStatus('waiting')
    })
  }, [on])

  const handleCreateRoom = () => {
    if (!isConnected) {
      alert('Not connected to server')
      return
    }
    send({ type: 'create_room' })
  }

  const handleJoinRoom = (code) => {
    if (!isConnected) {
      alert('Not connected to server')
      return
    }
    send({ type: 'join_room', roomCode: code })
  }

  const handleCellClick = (index) => {
    if (board[index] || gameStatus !== 'playing' || currentTurn !== playerSymbol) {
      return
    }
    
    send({ 
      type: 'make_move', 
      roomCode: roomCode,
      position: index 
    })
  }

  const handleLeaveRoom = () => {
    // Send leave message to server
    send({ 
      type: 'leave_room', 
      roomCode: roomCode
    })
    
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
