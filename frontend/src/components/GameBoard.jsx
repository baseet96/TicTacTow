import { Box, Paper, Typography, Button, Container } from '@mui/material'

function GameBoard({ 
  roomCode, 
  playerSymbol, 
  board, 
  currentTurn, 
  gameStatus,
  onCellClick,
  onLeaveRoom 
}) {
  const renderCell = (index) => {
    const value = board[index]
    
    return (
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: value ? 'default' : 'pointer',
          bgcolor: value ? 'action.selected' : 'background.paper',
          '&:hover': {
            bgcolor: value ? 'action.selected' : 'action.hover',
          },
          transition: 'all 0.2s'
        }}
        onClick={() => !value && onCellClick(index)}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            color: value === 'X' ? 'primary.main' : 'secondary.main',
            userSelect: 'none'
          }}
        >
          {value}
        </Typography>
      </Paper>
    )
  }

  const getStatusMessage = () => {
    if (gameStatus === 'waiting') {
      return 'Waiting for opponent...'
    }
    if (gameStatus === 'win') {
      return `${currentTurn} Wins! 🎉`
    }
    if (gameStatus === 'draw') {
      return "It's a Draw!"
    }
    if (currentTurn === playerSymbol) {
      return 'Your turn'
    }
    return `Opponent's turn (${currentTurn})`
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          py: 4
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Tic Tac Toe
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Room: {roomCode} | You are: {playerSymbol}
          </Typography>
        </Box>

        {/* Status */}
        <Paper elevation={1} sx={{ px: 3, py: 1.5, width: '100%' }}>
          <Typography
            variant="h6"
            textAlign="center"
            color={
              gameStatus === 'win' ? 'success.main' :
              gameStatus === 'draw' ? 'warning.main' :
              currentTurn === playerSymbol ? 'primary.main' : 'text.secondary'
            }
          >
            {getStatusMessage()}
          </Typography>
        </Paper>

        {/* Game Board */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1.5,
            width: '100%',
            maxWidth: '400px'
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => renderCell(index))}
        </Box>

        {/* Leave Button */}
        <Button
          variant="outlined"
          color="error"
          onClick={onLeaveRoom}
          sx={{ mt: 2 }}
        >
          Leave Game
        </Button>
      </Box>
    </Container>
  )
}

export default GameBoard
