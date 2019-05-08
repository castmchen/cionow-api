import { eventService } from './eventService';

export const socketService = {
  onConnection(ws: WebSocket) {
    ws.onmessage = event => {
      console.log('WS connection has been builded successfully.');
    };

    ws.onclose = event => {
      console.log('WS connection has been closed.');
    };

    eventService.getInstance().eventSocket.addListener('refresh', data => {
      if (data) {
        eventService.getInstance().waitForSocketConnection(ws, () => {
          ws.send(JSON.stringify(data));
        });
      }
    });
  }
};
