import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';

interface GameSettingsProps {
  visible: boolean;
  onClose: () => void;
  showLegalMoves: boolean;
  onToggleLegalMoves: (value: boolean) => void;
  autoPromoteToQueen: boolean;
  onToggleAutoPromote: (value: boolean) => void;
  soundEnabled: boolean;
  onToggleSound: (value: boolean) => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  visible,
  onClose,
  showLegalMoves,
  onToggleLegalMoves,
  autoPromoteToQueen,
  onToggleAutoPromote,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Настройки игры</Text>
          
          <View style={styles.setting}>
            <Text style={styles.settingText}>Показывать возможные ходы</Text>
            <Switch
              value={showLegalMoves}
              onValueChange={onToggleLegalMoves}
              trackColor={{ false: '#DEE2E6', true: '#58CC02' }}
              thumbColor={showLegalMoves ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          
          <View style={styles.setting}>
            <Text style={styles.settingText}>Автоматически превращать пешки в ферзя</Text>
            <Switch
              value={autoPromoteToQueen}
              onValueChange={onToggleAutoPromote}
              trackColor={{ false: '#DEE2E6', true: '#58CC02' }}
              thumbColor={autoPromoteToQueen ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          
          <View style={styles.setting}>
            <Text style={styles.settingText}>Звуки и вибрация</Text>
            <Switch
              value={soundEnabled}
              onValueChange={onToggleSound}
              trackColor={{ false: '#DEE2E6', true: '#58CC02' }}
              thumbColor={soundEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#58CC02',
    textAlign: 'center',
    marginBottom: 28,
    letterSpacing: -0.5,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingHorizontal: 16,
  },
  settingText: {
    color: '#495057',
    fontSize: 18,
    flex: 1,
    marginRight: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#58CC02',
    padding: 18,
    borderRadius: 25,
    marginTop: 12,
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default GameSettings;
