import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ChessSquare from './ChessSquare';
import { Chess } from 'chess.js';

interface ChessBoardProps {
  game: Chess;
  selectedSquare: string | null;
  onSquarePress: (square: string) => void;
  showLegalMoves: boolean;
}

const BOARD_SIZE = Math.min(Dimensions.get('window').width, Dimensions.get('window').height) - 80;
const SQUARE_SIZE = BOARD_SIZE / 8;

const ChessBoard: React.FC<ChessBoardProps> = ({ game, selectedSquare, onSquarePress, showLegalMoves }) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const isSquareSelected = (square: string) => selectedSquare === square;
  const isSquareHighlighted = (square: string) => {
    if (!selectedSquare || !showLegalMoves) return false;
    
    const piece = game.get(selectedSquare);
    if (!piece) return false;

    // Проверяем, можно ли сделать ход на эту клетку
    try {
      const moves = game.moves({ square: selectedSquare, verbose: true });
      return moves.some(move => move.to === square);
    } catch {
      return false;
    }
  };

  return (
    <View style={styles.boardContainer}>
      <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
        {ranks.map((rank, rankIndex) => (
          <View key={rank} style={styles.row}>
            {files.map((file, fileIndex) => {
              const square = `${file}${rank}`;
              const isLight = (rankIndex + fileIndex) % 2 === 0;
              const piece = game.get(square);
              
              return (
                <ChessSquare
                  key={square}
                  square={square}
                  piece={piece}
                  isLight={isLight}
                  isSelected={isSquareSelected(square)}
                  isHighlighted={isSquareHighlighted(square)}
                  size={SQUARE_SIZE}
                  onPress={() => onSquarePress(square)}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
  },
  board: {
    borderWidth: 0,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
  },
});

export default ChessBoard;
