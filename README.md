# Tic Tac Toe

## Goal

To understand & implement simple multiplayer game with websockets using Spring Boot & Angular/React

## Q & A

### 1. Where is socket client connection info stored in your project? Is it in-memory?

  Yes, it is stored entirely in-memory within your Spring Boot application server's JVM.

  Specifically, in WebSocketConfig.java, you configured the default broker: `registry.enableSimpleBroker("/topic");`

  This enables Spring's built-in  SimpleBrokerMessageHandler , which maintains thread-safe in-memory maps
  of:

  • Active WebSocket TCP sessions.
  • Topic subscription registries (mapping destination topics to session IDs).
  • Session attributes (data like  username  or custom values).
  ──────

### 2. Where are topics & registered client details stored?

  In your current application, they are managed by Spring's in-memory  DefaultSubscriptionRegistry .

  When a client subscribes to a topic (e.g.,  /topic/game/123 ):

  1. The subscription frame is parsed by Spring.
  2. The session ID and subscription ID are registered in a tree-like map structure representing the
  destination patterns.
  3. When you call  messagingTemplate.convertAndSend("/topic/game/123", payload) , Spring searches this in-
  memory tree to find all matching active session IDs and sends the WebSocket frame directly to their TCP
  sockets.
  ──────

### 3. How are connection state and topics handled in heavy-load / real-time production projects?

  In heavy-load production environments, you cannot store connection details or topics inside a single
  server's memory because you need to scale horizontally across multiple server nodes (behind a load
  balancer). If Player X is connected to Server A and Player O is connected to Server B, they wouldn't be
  able to communicate using an in-memory broker.

  Here is how production systems scale:

#### A. External Message Brokers (Pub/Sub)

- Instead of using Spring's in-memory  SimpleBroker , production applications relay messages to an external
  distributed broker like RabbitMQ, ActiveMQ, or Redis Pub/Sub using the STOMP Broker Relay:

   ```java
        // Production config example
        registry.enableStompBrokerRelay("/topic")
                .setRelayHost("rabbitmq-server-ip")
                .setRelayPort(61613)
                .setSystemLogin("guest")
                .setSystemPasscode("guest");
    ```

- How it works: When Player X sends a move to Server A, Server A forwards it to RabbitMQ. RabbitMQ
  broadcasts it to Server B (which Player O is connected to), and Server B pushes it down to Player O's browser.

#### B. Distributed Connection/Session Management

- To keep track of which user is online or which game they are in across multiple nodes, developers use
  Redis (as an external shared cache).
- Instead of writing heartbeats to SQLite or keeping them in-memory, the heartbeat updates a temporary key
  in Redis with a Time-To-Live (TTL) (e.g.,  SET player:online:Reddy true EX 10  for 10-second expiry).
- If the key expires because no heartbeat was received, Redis triggers a keyspace notification, allowing
  any server node to clean up the game.

#### C. Load Balancer Sticky Sessions (Session Affinity)

- Load balancers (like Nginx, AWS ALB, or HAProxy) are configured with sticky sessions or IP hashing to
  ensure that once a WebSocket connection handshake is made, all subsequent frames from that client remain
  connected to the same physical server container.
