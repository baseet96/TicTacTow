import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'

function Modal({ 
  open, 
  title, 
  message, 
  onClose, 
  onConfirm,
  confirmText = 'OK',
  showCancel = false,
  showClose = true,
  isError = false 
}) {
  return (
    <Dialog 
      open={open} 
      onClose={showClose ? onClose : undefined}
      maxWidth="xs" 
      fullWidth
      disableEscapeKeyDown={!showClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          textAlign: 'center',
          color: isError ? 'error.main' : 'success.main',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          pb: 1
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent 
        sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 3
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      {showClose && (
        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
          {showCancel && (
            <Button 
              onClick={onClose}
              variant="outlined"
              size="large"
              sx={{ minWidth: '100px' }}
            >
              Cancel
            </Button>
          )}
          <Button 
            onClick={onConfirm || onClose}
            variant="contained"
            color={isError ? 'error' : 'success'}
            size="large"
            sx={{ minWidth: '120px' }}
          >
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default Modal
