import { useState } from 'react'
import { Container, Box, TextField, Button, Typography, Paper, Divider } from '@mui/material'

function HomeScreen({ onCreateRoom, onJoinRoom }) {
  const [roomCode, setRoomCode] = useState('')

  const handleJoinRoom = () => {
    if (roomCode.trim().length === 4) {
      onJoinRoom(roomCode.trim())
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && roomCode.trim().length === 4) {
      handleJoinRoom()
    }
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
          gap: 4
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Tic Tac Toe
        </Typography>

        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Create Room */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={onCreateRoom}
              sx={{ py: 2 }}
            >
              Create Room
            </Button>

            {/* Divider */}
            <Divider sx={{ my: 1 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            {/* Join Room */}
            <Box>
              <TextField
                fullWidth
                label="Room Code"
                placeholder="code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.slice(0, 4))}
                onKeyPress={handleKeyPress}
                inputProps={{ maxLength: 4 }}
                sx={{ 
                  mb: 2,
                  '& input': { 
                    textAlign: 'center', 
                    fontSize: '1.5rem', 
                    letterSpacing: '0.5rem' 
                  }
                }}
              />
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={handleJoinRoom}
                disabled={roomCode.trim().length !== 4}
                sx={{ py: 2 }}
              >
                Join Room
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default HomeScreen
