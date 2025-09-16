# Сборка Android APK для шахматного приложения

## Предварительные требования

1. **Expo CLI** (уже установлен)
2. **EAS CLI** для сборки:
   ```bash
   npm install -g @expo/eas-cli
   ```

## Настройка EAS

1. **Войдите в аккаунт Expo**:
   ```bash
   eas login
   ```

2. **Инициализируйте EAS**:
   ```bash
   eas build:configure
   ```

## Сборка APK

### Быстрая сборка (рекомендуется для тестирования):

```bash
eas build --platform android --profile preview
```

### Продакшн сборка:

```bash
eas build --platform android --profile production
```

## Локальная сборка (без облака)

Если у вас установлен Android Studio и настроен SDK:

```bash
npx expo run:android --variant release
```

## Альтернативный способ через Expo Classic

```bash
npx expo build:android
```

## Где найти APK

После успешной сборки:
1. Перейдите на [Expo Dashboard](https://expo.dev)
2. Найдите ваш проект
3. Скачайте APK файл

## Установка на устройство

1. Включите "Неизвестные источники" в настройках Android
2. Скачайте APK на устройство
3. Установите приложение

## Публикация в Google Play

1. Создайте аккаунт разработчика Google Play
2. Соберите AAB (Android App Bundle):
   ```bash
   eas build --platform android --profile production
   ```
3. Загрузите AAB в Google Play Console

## Устранение проблем

### Ошибка "No Android SDK found":
- Установите Android Studio
- Настройте переменные окружения ANDROID_HOME и ANDROID_SDK_ROOT

### Ошибка сборки:
- Проверьте, что все зависимости установлены
- Убедитесь, что app.json настроен правильно
- Попробуйте очистить кэш: `npx expo start --clear`

## Полезные команды

```bash
# Проверка конфигурации
eas build:list

# Отмена сборки
eas build:cancel

# Просмотр логов
eas build:view
```

