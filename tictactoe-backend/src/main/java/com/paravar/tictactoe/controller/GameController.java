package com.paravar.tictactoe.controller;

import com.paravar.tictactoe.dto.CreateGameRequest;
import com.paravar.tictactoe.dto.GameDto;
import com.paravar.tictactoe.dto.JoinGameRequest;
import com.paravar.tictactoe.model.ChatMessage;
import com.paravar.tictactoe.model.Game;
import com.paravar.tictactoe.service.GameService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public ResponseEntity<@NonNull GameDto> createGame(@RequestBody CreateGameRequest request) {
        Game game = gameService.createGame(request.getPlayerName());
        return ResponseEntity.ok(gameService.toDto(game));
    }

    @PostMapping("/{gameId}/join")
    public ResponseEntity<@NonNull GameDto> joinGame(
            @PathVariable String gameId,
            @RequestBody JoinGameRequest request) {

        Game game = gameService.joinGame(gameId, request.getPlayerName());
        GameDto dto = gameService.toDto(game);
        
        messagingTemplate.convertAndSend("/topic/game/" + gameId, dto);
        
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/available")
    public ResponseEntity<@NonNull List<GameDto>> getAvailableGames() {
        List<GameDto> games = gameService.getAvailableGames()
                .stream()
                .map(gameService::toDto)
                .toList();

        return ResponseEntity.ok(games);
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<@NonNull GameDto> getGame(@PathVariable String gameId) {
        Game game = gameService.getGame(gameId);
        return ResponseEntity.ok(gameService.toDto(game));
    }

    @GetMapping("/{gameId}/chat")
    public List<ChatMessage> getChat(@PathVariable String gameId) {
        return gameService.getChatMessages(gameId);
    }
}