import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { Piece } from 'chess.js';

interface ChessSquareProps {
  square: string;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  size: number;
  onPress: () => void;
}

const ChessSquare: React.FC<ChessSquareProps> = ({
  square,
  piece,
  isLight,
  isSelected,
  isHighlighted,
  size,
  onPress,
}) => {
  const scaleAnim = new Animated.Value(1);
  const opacityAnim = new Animated.Value(1);

  useEffect(() => {
    if (isSelected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSelected]);

  useEffect(() => {
    if (isHighlighted) {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isHighlighted]);
  const getBackgroundColor = () => {
    if (isSelected) return '#FF6B6B';
    if (isHighlighted) return '#4ECDC4';
    return isLight ? '#FFE5B4' : '#8B4513';
  };

  const getPieceSymbol = () => {
    if (!piece) return '';
    
    const symbols: { [key: string]: string } = {
      'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
      'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
    };
    
    const key = `${piece.color}${piece.type.toUpperCase()}`;
    return symbols[key] || piece.type.toUpperCase();
  };

  const getPieceColor = () => {
    return piece?.color === 'w' ? '#2C3E50' : '#FFFFFF';
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.square,
          {
            width: size,
            height: size,
            backgroundColor: getBackgroundColor(),
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.piece,
          {
            color: getPieceColor(),
            fontSize: Math.max(size * 0.5, 16),
          },
        ]}>
          {getPieceSymbol()}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  square: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 4,
  },
  piece: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default ChessSquare;
