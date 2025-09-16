import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

class SoundManager {
  private moveSound: Audio.Sound | null = null;
  private captureSound: Audio.Sound | null = null;
  private checkSound: Audio.Sound | null = null;
  private gameEndSound: Audio.Sound | null = null;
  private buttonSound: Audio.Sound | null = null;

  async initialize() {
    try {
      // Создаем звуки программно (так как у нас нет аудиофайлов)
      await this.createSounds();
    } catch (error) {
      console.log('Ошибка инициализации звуков:', error);
    }
  }

  private async createSounds() {
    // Создаем простые звуки с помощью Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Звук хода
      this.moveSound = await this.createTone(audioContext, 800, 0.1, 'sine');
      
      // Звук взятия
      this.captureSound = await this.createTone(audioContext, 600, 0.2, 'square');
      
      // Звук шаха
      this.checkSound = await this.createTone(audioContext, 1200, 0.3, 'sawtooth');
      
      // Звук окончания игры
      this.gameEndSound = await this.createTone(audioContext, 400, 0.5, 'triangle');
      
      // Звук кнопки
      this.buttonSound = await this.createTone(audioContext, 1000, 0.05, 'sine');
    }
  }

  private async createTone(audioContext: AudioContext, frequency: number, duration: number, type: OscillatorType): Promise<Audio.Sound> {
    return new Promise((resolve) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      // Создаем фиктивный Audio.Sound объект
      resolve({
        playAsync: async () => {
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        },
        unloadAsync: async () => {},
      } as any);
    });
  }

  async playMoveSound() {
    try {
      if (this.moveSound) {
        await this.moveSound.playAsync();
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.log('Ошибка воспроизведения звука хода:', error);
    }
  }

  async playCaptureSound() {
    try {
      if (this.captureSound) {
        await this.captureSound.playAsync();
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.log('Ошибка воспроизведения звука взятия:', error);
    }
  }

  async playCheckSound() {
    try {
      if (this.checkSound) {
        await this.checkSound.playAsync();
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (error) {
      console.log('Ошибка воспроизведения звука шаха:', error);
    }
  }

  async playGameEndSound() {
    try {
      if (this.gameEndSound) {
        await this.gameEndSound.playAsync();
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.log('Ошибка воспроизведения звука окончания игры:', error);
    }
  }

  async playButtonSound() {
    try {
      if (this.buttonSound) {
        await this.buttonSound.playAsync();
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.log('Ошибка воспроизведения звука кнопки:', error);
    }
  }

  async cleanup() {
    try {
      if (this.moveSound) await this.moveSound.unloadAsync();
      if (this.captureSound) await this.captureSound.unloadAsync();
      if (this.checkSound) await this.checkSound.unloadAsync();
      if (this.gameEndSound) await this.gameEndSound.unloadAsync();
      if (this.buttonSound) await this.buttonSound.unloadAsync();
    } catch (error) {
      console.log('Ошибка очистки звуков:', error);
    }
  }
}

export default new SoundManager();

