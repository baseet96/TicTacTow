import { useState, useEffect, useCallback } from 'react'
import HomeScreen from './components/HomeScreen'
import GameBoard from './components/GameBoard'
import Modal from './components/Modal'
import { useWebSocket } from './hooks/useWebSocket'

function App() {
  const [screen, setScreen] = useState('home') // 'home' or 'game'
  const [roomCode, setRoomCode] = useState('')
  const [playerSymbol, setPlayerSymbol] = useState('')
  const [board, setBoard] = useState(Array(9).fill(''))
  const [currentTurn, setCurrentTurn] = useState('X')
  const [gameStatus, setGameStatus] = useState('waiting') // 'waiting', 'playing', 'win', 'draw'

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'OK',
    isError: false,
    showClose: true,
    onConfirm: null
  })

  const { send, on, isConnected } = useWebSocket(import.meta.env.VITE_WS_URL)

  const closeModal = useCallback(() => {
    setModal(prev => ({ ...prev, open: false }))
  }, [])

  const handleRestartGame = useCallback(() => {
    send({ 
      type: 'restart_game', 
      roomCode: roomCode 
    })
    setModal(prev => ({ ...prev, open: false }))
  }, [send, roomCode])

  useEffect(() => {
    // Handle room_created event
    on('room_created', (message) => {
      setRoomCode(message.roomCode)
      setPlayerSymbol(message.player)
      setGameStatus('waiting')
      setBoard(Array(9).fill(''))
      setCurrentTurn('X')
      setScreen('game')
      // Show waiting modal
      setModal({
        open: true,
        title: 'Code: ' + message.roomCode,
        message: 'Waiting for opponent...',
        isError: false,
        showClose: true,
        confirmText: 'Leave',
        onConfirm: () => {
          send({ 
            type: 'leave_room', 
            roomCode: message.roomCode
          })
          setScreen('home')
          setRoomCode('')
          setPlayerSymbol('')
          setBoard(Array(9).fill(''))
          setCurrentTurn('X')
          setGameStatus('waiting')
          setModal(prev => ({ ...prev, open: false }))
        }
      })
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
      // Close the waiting modal
      setModal({ ...modal, open: false })
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

    // Handle restart_game event
    on('restart_game', (message) => {
      setBoard(message.board)
      setPlayerSymbol(message.player)
      setCurrentTurn('X')
      setGameStatus('playing')
      setModal({ ...modal, open: false })
    })

    // Handle game_over event
    on('game_over', (message) => {
      setBoard(message.board)
      const isYouWon = message.winner === playerSymbol
      
      if (message.winner === 'draw') {
        setGameStatus('draw')
        setModal({
          open: true,
          title: "It's a Draw!",
          message: 'Well played',
          confirmText: 'Play Again',
          isError: false,
          showClose: true,
          onConfirm: handleRestartGame
        })
      } else {
        setGameStatus('win')
        setCurrentTurn(message.winner)
        setModal({
          open: true,
          title: isYouWon ? 'You Won!' : 'You Lost',
          message: isYouWon ? 'Congrats! 🎉' : 'Better luck next time',
          confirmText: 'Play Again',
          isError: !isYouWon,
          showClose: true,
          onConfirm: handleRestartGame
        })
      }
    })

    // Handle error event
    on('error', (message) => {
      console.error('Server error:', message.message)
      setModal({
        open: true,
        title: 'Error',
        message: message.message,
        isError: true,
        showClose: true
      })
    })

    // Handle opponent_left event
    on('opponent_left', (message) => {
      console.log('Opponent left event received:', message)
      setModal({
        open: true,
        title: 'Opponent Left',
        message: 'Game ended',
        isError: true,
        showClose: true,
        onConfirm: () => {
          setScreen('home')
          setRoomCode('')
          setPlayerSymbol('')
          setBoard(Array(9).fill(''))
          setCurrentTurn('X')
          setGameStatus('waiting')
          setModal(prev => ({ ...prev, open: false }))
        }
      })
    })
  }, [on, playerSymbol, handleRestartGame])

  const handleCreateRoom = useCallback(() => {
    if (!isConnected) {
      setModal({
        open: true,
        title: 'Not Connected',
        message: 'Server is offline',
        isError: true,
        showClose: true
      })
      return
    }
    send({ type: 'create_room' })
  }, [isConnected, send])

  const handleJoinRoom = useCallback((code) => {
    if (!isConnected) {
      setModal({
        open: true,
        title: 'Not Connected',
        message: 'Server is offline',
        isError: true,
        showClose: true
      })
      return
    }
    send({ type: 'join_room', roomCode: code })
  }, [isConnected, send])

  const handleCellClick = useCallback((index) => {
    if (board[index] || gameStatus !== 'playing' || currentTurn !== playerSymbol) {
      return
    }
    
    send({ 
      type: 'make_move', 
      roomCode: roomCode,
      position: index 
    })
  }, [board, gameStatus, currentTurn, playerSymbol, send, roomCode])

  const handleLeaveRoom = useCallback(() => {
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
  }, [send, roomCode])

  if (screen === 'game') {
    return (
      <>
        <GameBoard
          roomCode={roomCode}
          playerSymbol={playerSymbol}
          board={board}
          currentTurn={currentTurn}
          gameStatus={gameStatus}
          onCellClick={handleCellClick}
          onLeaveRoom={handleLeaveRoom}
        />
        <Modal
          open={modal.open}
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText}
          onClose={closeModal}
          onConfirm={modal.onConfirm || closeModal}
          isError={modal.isError}
          showClose={modal.showClose}
        />
      </>
    )
  }

  return (
    <>
      <HomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      <Modal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        onClose={closeModal}
        onConfirm={modal.onConfirm || closeModal}
        isError={modal.isError}
        showClose={modal.showClose}
      />
    </>
  )
}

export default App
