import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Chess } from 'chess.js';

interface GameInfoProps {
  game: Chess;
  gameHistory: string[];
  onReset: () => void;
  onUndo: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ game, gameHistory, onReset, onUndo }) => {
  const buttonScale = new Animated.Value(1);

  const handleButtonPress = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    callback();
  };
  const getGameStatus = () => {
    if (game.isCheckmate()) return 'Шах и мат!';
    if (game.isDraw()) return 'Ничья!';
    if (game.isCheck()) return 'Шах!';
    if (game.isStalemate()) return 'Пат!';
    return `Ход ${game.turn() === 'w' ? 'белых' : 'черных'}`;
  };

  const getStatusColor = () => {
    if (game.isCheckmate() || game.isDraw()) return '#e74c3c';
    if (game.isCheck()) return '#f39c12';
    return '#27ae60';
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {getGameStatus()}
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress(onReset)}>
            <Text style={styles.buttonText}>Новая игра</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={[styles.button, styles.undoButton]} 
            onPress={() => handleButtonPress(onUndo)}
            disabled={gameHistory.length === 0}
          >
            <Text style={styles.buttonText}>Отменить ход</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>История ходов:</Text>
        <ScrollView style={styles.historyScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.historyList}>
            {gameHistory.map((move, index) => (
              <View key={index} style={styles.moveItem}>
                <Text style={styles.moveNumber}>{Math.floor(index / 2) + 1}.</Text>
                <Text style={styles.moveText}>{move}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  status: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#58CC02',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  undoButton: {
    backgroundColor: '#FFC800',
    shadowColor: '#FFC800',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  historyTitle: {
    color: '#495057',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  historyScroll: {
    maxHeight: 100,
  },
  historyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moveItem: {
    flexDirection: 'row',
    marginRight: 16,
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  moveNumber: {
    color: '#6C757D',
    marginRight: 6,
    minWidth: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  moveText: {
    color: '#495057',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default GameInfo;
