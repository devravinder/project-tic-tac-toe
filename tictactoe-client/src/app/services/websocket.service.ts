import { OnDestroy, Service, signal } from '@angular/core';
import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import { map } from 'rxjs';

@Service()
export class WebsocketService implements OnDestroy {
  private rxStomp = new RxStomp();

  // Connection state as a Signal for easy UI binding
  public connectionState = signal(RxStompState.CLOSED);

  constructor() {
    this.initStomp();
  }

  private initStomp() {
    this.rxStomp.configure({
      brokerURL: 'ws://localhost:8080/ws',
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 5000,
      // debug: (msg) => console.log(msg),
    });

    // Sync the connection state signal
    this.rxStomp.connectionState$.subscribe((state) => {
      this.connectionState.set(state);
    });

    this.rxStomp.activate();
  }

  // Generic method to watch a specific topic
  watchGame<GameDto>(gameId: string) {
    return this.rxStomp
      .watch(`/topic/game/${gameId}`)
      .pipe(map((message) => JSON.parse(message.body) as GameDto));
  }

  watchGameChat<T>(gameId: string) {
    return this.rxStomp
      .watch(`/topic/chat/${gameId}`)
      .pipe(map((message) => JSON.parse(message.body) as T));
  }

  move(gameId: string, player: string, position: number) {
    this.rxStomp.publish({
      destination: '/app/game/move',
      body: JSON.stringify({ gameId, player, position }),
    });
  }

  resign(gameId: string, player: string) {
    this.rxStomp.publish({
      destination: '/app/game/resign',
      body: JSON.stringify({ gameId, player }),
    });
  }

  heartbeat(gameId: string, player: string) {
    this.rxStomp.publish({
      destination: '/app/game/heartbeat',
      body: JSON.stringify({ gameId, player }),
    });
  }

  // Method to send messages
  sendMessage(gameId: string, sender: string, content: string) {
    this.rxStomp.publish({
      destination: '/app/game/chat',
      body: JSON.stringify({ gameId, sender, content }),
    });
  }

  ngOnDestroy() {
    this.rxStomp.deactivate();
  }
}
