export const socket = new WebSocket("ws://localhost:3000");

export function subscribeToCredits(onMessage: (data: any) => void) {
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
}
