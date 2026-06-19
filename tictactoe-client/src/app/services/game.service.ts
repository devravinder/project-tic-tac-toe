import { inject, Service } from '@angular/core';
import { ChatMessageDto, GameDto } from '../types/global';
import { HttpClient } from '@angular/common/http';

@Service()
export class GameService {

  http = inject(HttpClient)
  baseUrl = "http://localhost:8080/api/games"
  
  //=== api calls

  createGame(playerName: string){
     return this.http.post<GameDto>(this.baseUrl, {playerName})
  }

  joinGame(gameId: string, playerName: string){
     return this.http.post<GameDto>(`${this.baseUrl}/${gameId}/join`, {playerName})
  }

  getAvailableGames(){
     return this.http.get<GameDto[]>(`${this.baseUrl}/available`)
  }

  getPlayingGame(playerName: string){
     return this.http.get<GameDto | null>(`${this.baseUrl}/in-progress/${playerName}`)
  }

  getGame(gameId: string){
    return this.http.get<GameDto>(`${this.baseUrl}/${gameId}`)
  }

  getChatMessages(gameId: string){
     return this.http.get<ChatMessageDto[]>(`${this.baseUrl}/${gameId}/chat`)
  }

}
