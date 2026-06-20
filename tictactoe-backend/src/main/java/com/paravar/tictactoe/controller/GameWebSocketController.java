package com.paravar.tictactoe.controller;

import com.paravar.tictactoe.dto.ChatRequest;
import com.paravar.tictactoe.dto.GameActionRequest;
import com.paravar.tictactoe.dto.HeartBeatRequest;
import com.paravar.tictactoe.dto.MoveRequest;
import com.paravar.tictactoe.model.ChatMessage;
import com.paravar.tictactoe.model.Game;
import com.paravar.tictactoe.repository.ChatMessageRepository;
import com.paravar.tictactoe.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class GameWebSocketController {

    private final GameService gameService;
    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/game/move")
    public void makeMove(MoveRequest request) {
        Game game = gameService.makeMove(
                request.getGameId(),
                request.getPlayer(),
                request.getPosition()
        );

        messagingTemplate.convertAndSend(
                "/topic/game/" + game.getId(),
                gameService.toDto(game)
        );
    }

    @MessageMapping("/game/resign")
    public void resign(GameActionRequest request) {
        Game game = gameService.resign(
                request.getGameId(),
                request.getPlayer()
        );

        messagingTemplate.convertAndSend(
                "/topic/game/" + game.getId(),
                gameService.toDto(game)
        );
    }
    @MessageMapping("/game/request-draw")
    public void requestDraw(GameActionRequest request) {
        Game game = gameService.requestDraw(
                request.getGameId(),
                request.getPlayer()
        );

        messagingTemplate.convertAndSend(
                "/topic/game/" + game.getId(),
                gameService.toDto(game)
        );
    }
    @MessageMapping("/game/accept-draw")
    public void acceptDraw(GameActionRequest request) {
        Game game = gameService.acceptDraw(
                request.getGameId(),
                request.getPlayer()
        );

        messagingTemplate.convertAndSend(
                "/topic/game/" + game.getId(),
                gameService.toDto(game)
        );
    }

    @MessageMapping("/game/heartbeat")
    public void heartbeat(HeartBeatRequest request) {
        Game game  = gameService.heartbeat(
                request.getGameId(),
                request.getPlayer()
        );

        messagingTemplate.convertAndSend(
                "/topic/game/" + game.getId(),
                gameService.toDto(game)
        );
    }

    @MessageMapping("/game/chat")
    public void chat(ChatRequest request) {
        ChatMessage message = new ChatMessage();

        message.setGameId(request.getGameId());
        message.setSender(request.getSender());
        message.setContent(request.getContent());

        chatMessageRepository.save(message);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + request.getGameId(),
                message
        );
    }
}