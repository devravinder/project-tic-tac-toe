package com.paravar.tictactoe.repository;

import com.paravar.tictactoe.model.ChatMessage;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<@NonNull ChatMessage, @NonNull String> {

    List<@NonNull ChatMessage> findByGameIdOrderByTimestampAsc(String gameId);
}
