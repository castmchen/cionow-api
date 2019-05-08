import { EventEmitter } from 'events';

export class eventService {
  private static _eventService: eventService;
  public static getInstance() {
    if (!eventService._eventService) {
      eventService._eventService = new eventService();
    }
    return eventService._eventService;
  }
  public eventSocket: EventEmitter = new EventEmitter();

  public triggerSocketAction(data) {
    this.eventSocket.emit('refresh', data);
  }

  public waitForSocketConnection(socket, callback) {
    const that = this;
    setTimeout(function() {
      if (socket.readyState === 1) {
        if (callback != null) {
          callback();
        }
      } else {
        that.waitForSocketConnection(socket, callback);
      }
    }, 5000);
  }
}
