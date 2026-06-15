package com.paravar.tictactoe.service;


import com.paravar.tictactoe.config.GameProperties;
import com.paravar.tictactoe.model.Game;
import com.paravar.tictactoe.model.GameStatus;
import com.paravar.tictactoe.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameCleanupService {

    private final GameRepository gameRepository;
    private final SimpMessageSendingOperations messagingTemplate;
    private final GameService gameService;
    private final GameProperties gameProperties;

    // Clean up games where no one joined within 5 minutes
//    @Scheduled(fixedRateString = "${game.cleanup-interval-ms:30000}")
    public void cleanupIdleGames() {

        Instant idleLimit = Instant.now().minus(Duration.ofMinutes(gameProperties.getIdleTimeoutMinutes()));

        List<Game> idleGames =
                gameRepository.findByStatusAndCreatedAtBefore(
                        GameStatus.WAITING,
                        idleLimit
                );

        for (Game game : idleGames) {
            game.setStatus(GameStatus.ABANDONED);

            gameRepository.save(game);

            messagingTemplate.convertAndSend(
                    "/topic/game/" + game.getId(),
                    gameService.toDto(game)
            );

            log.info("Cleaned up idle game: {}", game.getId());
        }
    }

    // Check for disconnected players
//    @Scheduled(fixedRate = 5000)
    public void checkDisconnections() {

        List<Game> activeGames =
                gameRepository.findByStatus(GameStatus.IN_PROGRESS);

        Instant now = Instant.now();

        for (Game game : activeGames) {
            checkPlayerDisconnection(game, now, true);
            checkPlayerDisconnection(game, now, false);
        }
    }

    private void checkPlayerDisconnection(
            Game game,
            Instant now,
            boolean isPlayerX) {

        Instant lastSeen = isPlayerX
                ? game.getPlayerXLastSeen()
                : game.getPlayerOLastSeen();

        if (lastSeen == null) {
            return;
        }

        long secondsSinceLastSeen =
                Duration.between(lastSeen, now).getSeconds();

        // Total disconnection timeout
        if (secondsSinceLastSeen >= gameProperties.getDisconnectTimeoutSeconds()) {

            game.setWinner(
                    isPlayerX
                            ? game.getPlayerO()
                            : game.getPlayerX()
            );

            game.setStatus(GameStatus.FINISHED);

            gameRepository.save(game);

            messagingTemplate.convertAndSend(
                    "/topic/game/" + game.getId(),
                    gameService.toDto(game)
            );

            return;
        }

        // Track disconnection strikes
        if (secondsSinceLastSeen >= gameProperties.getDisconnectStrikeSeconds()) {

            int strikes = isPlayerX
                    ? game.getPlayerXDisconnects()
                    : game.getPlayerODisconnects();

            if (isPlayerX) {
                game.setPlayerXDisconnects(strikes + 1);
            } else {
                game.setPlayerODisconnects(strikes + 1);
            }

            if ((isPlayerX
                    ? game.getPlayerXDisconnects()
                    : game.getPlayerODisconnects()) >= gameProperties.getMaxDisconnectStrikes()) {

                game.setWinner(
                        isPlayerX
                                ? game.getPlayerO()
                                : game.getPlayerX()
                );

                game.setStatus(GameStatus.FINISHED);
            }

            gameRepository.save(game);

            messagingTemplate.convertAndSend(
                    "/topic/game/" + game.getId(),
                    gameService.toDto(game)
            );
        }
    }
}