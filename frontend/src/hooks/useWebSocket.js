import { useEffect, useRef, useState } from 'react'

export function useWebSocket(url) {
  const ws = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const messageHandlers = useRef({})

  useEffect(() => {
    // Create WebSocket connection
    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log('Received:', message)

      // Call the appropriate handler based on message type
      const handler = messageHandlers.current[message.type]
      if (handler) {
        handler(message)
      }
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.current.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url])

  const send = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
      console.log('Sent:', message)
    } else {
      console.error('WebSocket not connected')
    }
  }

  const on = (type, handler) => {
    messageHandlers.current[type] = handler
  }

  const off = (type) => {
    delete messageHandlers.current[type]
  }

  return { send, on, off, isConnected }
}
