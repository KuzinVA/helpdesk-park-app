import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Chess } from 'chess.js';
import ChessBoard from './components/ChessBoard';
import GameInfo from './components/GameInfo';
import GameSettings from './components/GameSettings';
import SoundManager from './utils/SoundManager';

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showLegalMoves, setShowLegalMoves] = useState(true);
  const [autoPromoteToQueen, setAutoPromoteToQueen] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Отладочная информация
  console.log('Current game FEN:', game.fen());
  console.log('Current turn:', game.turn());

  useEffect(() => {
    // Инициализируем звуки при загрузке приложения
    SoundManager.initialize();
    
    return () => {
      // Очищаем звуки при размонтировании
      SoundManager.cleanup();
    };
  }, []);

  const handleSquarePress = (square: string) => {
    if (selectedSquare === null) {
      // Выбираем фигуру
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        if (soundEnabled) SoundManager.playButtonSound();
      }
    } else {
      // Делаем ход
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: autoPromoteToQueen ? 'q' : undefined
        });

        if (move) {
          setGameHistory([...gameHistory, move.san || '']);
          // Не создаем новый экземпляр, а обновляем состояние
          setGame(new Chess(game.fen()));
          
          // Воспроизводим звуки в зависимости от типа хода
          if (soundEnabled) {
            if (move.captured) {
              SoundManager.playCaptureSound();
            } else if (game.isCheck()) {
              SoundManager.playCheckSound();
            } else {
              SoundManager.playMoveSound();
            }
          }
        }
      } catch (error) {
        console.log('Недопустимый ход:', error);
      }
      setSelectedSquare(null);
    }
  };

  const resetGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setGameHistory([]);
    if (soundEnabled) SoundManager.playButtonSound();
  };

  const undoMove = () => {
    game.undo();
    setGame(new Chess(game.fen()));
    setSelectedSquare(null);
    setGameHistory(gameHistory.slice(0, -1));
    if (soundEnabled) SoundManager.playButtonSound();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      <View style={styles.header}>
        <Text style={styles.title}>Шахматы</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettings(true)}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>
      
      <GameInfo 
        game={game} 
        gameHistory={gameHistory}
        onReset={resetGame}
        onUndo={undoMove}
      />
      
      <ChessBoard 
        game={game}
        selectedSquare={selectedSquare}
        onSquarePress={handleSquarePress}
        showLegalMoves={showLegalMoves}
      />

      <GameSettings
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        showLegalMoves={showLegalMoves}
        onToggleLegalMoves={setShowLegalMoves}
        autoPromoteToQueen={autoPromoteToQueen}
        onToggleAutoPromote={setAutoPromoteToQueen}
        soundEnabled={soundEnabled}
        onToggleSound={setSoundEnabled}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#58CC02',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#58CC02',
    letterSpacing: -0.5,
  },
  settingsButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#FFC800',
    shadowColor: '#FFC800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsButtonText: {
    fontSize: 20,
  },
});
