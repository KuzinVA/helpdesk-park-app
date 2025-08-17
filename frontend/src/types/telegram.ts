declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    receiver?: TelegramUser;
    chat?: TelegramChat;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date?: number;
    hash?: string;
  };
  colorScheme: 'light' | 'dark';
  themeParams: TelegramThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  backButton: TelegramBackButton;
  mainButton: TelegramMainButton;
  hapticFeedback: TelegramHapticFeedback;
  cloudStorage: TelegramCloudStorage;
  ready(): void;
  expand(): void;
  close(): void;
  isVersionAtLeast(version: string): boolean;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  onEvent(eventType: string, eventHandler: Function): void;
  offEvent(eventType: string, eventHandler: Function): void;
  sendData(data: string): void;
  switchInlineQuery(query: string, choose_chat_types?: string[]): void;
  openInvoice(url: string, callback?: Function): void;
  openLink(url: string, options?: TelegramOpenLinkOptions): void;
  openTelegramLink(url: string): void;
  openWebApp(url: string, options?: TelegramOpenWebAppOptions): void;
  closeWebApp(): void;
  showPopup(params: TelegramPopupParams, callback?: Function): void;
  showAlert(message: string, callback?: Function): void;
  showConfirm(message: string, callback?: Function): void;
  showScanQrPopup(params: TelegramScanQrPopupParams, callback?: Function): void;
  closeScanQrPopup(): void;
  readTextFromClipboard(callback?: Function): void;
  requestWriteAccess(callback?: Function): void;
  requestContact(callback?: Function): void;
  invokeCustomMethod(method: string, params: any, callback?: Function): void;
  onClosingConfirmationChange: (callback: Function) => void;
  offClosingConfirmationChange: (callback: Function) => void;
  onViewportChange: (callback: Function) => void;
  offViewportChange: (callback: Function) => void;
  onThemeChange: (callback: Function) => void;
  offThemeChange: (callback: Function) => void;
  onMainButtonClick: (callback: Function) => void;
  offMainButtonClick: (callback: Function) => void;
  onBackButtonClick: (callback: Function) => void;
  offBackButtonClick: (callback: Function) => void;
  onSettingsButtonClick: (callback: Function) => void;
  offSettingsButtonClick: (callback: Function) => void;
  onInvoiceClosed: (callback: Function) => void;
  offInvoiceClosed: (callback: Function) => void;
  onPopupClosed: (callback: Function) => void;
  offPopupClosed: (callback: Function) => void;
  onQrTextReceived: (callback: Function) => void;
  offQrTextReceived: (callback: Function) => void;
  onClipboardTextReceived: (callback: Function) => void;
  offClipboardTextReceived: (callback: Function) => void;
  onWriteAccessRequested: (callback: Function) => void;
  offWriteAccessRequested: (callback: Function) => void;
  onContactRequested: (callback: Function) => void;
  offContactRequested: (callback: Function) => void;
  onCustomMethodInvoked: (callback: Function) => void;
  offCustomMethodInvoked: (callback: Function) => void;
}

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface TelegramChat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  photo_url?: string;
}

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
}

export interface TelegramBackButton {
  isVisible: boolean;
  onClick(callback: Function): void;
  offClick(callback: Function): void;
  show(): void;
  hide(): void;
}

export interface TelegramMainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isProgressVisible: boolean;
  isActive: boolean;
  onClick(callback: Function): void;
  offClick(callback: Function): void;
  show(): void;
  hide(): void;
  enable(): void;
  disable(): void;
  showProgress(leaveActive?: boolean): void;
  hideProgress(): void;
  setText(text: string): void;
  setColor(color: string): void;
  setTextColor(color: string): void;
}

export interface TelegramHapticFeedback {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
  notificationOccurred(type: 'error' | 'success' | 'warning'): void;
  selectionChanged(): void;
}

export interface TelegramCloudStorage {
  getKeys(callback?: Function): void;
  getItem(key: string, callback?: Function): void;
  setItem(key: string, value: string, callback?: Function): void;
  removeItem(key: string, callback?: Function): void;
}

export interface TelegramOpenLinkOptions {
  try_instant_view?: boolean;
}

export interface TelegramOpenWebAppOptions {
  try_instant_view?: boolean;
}

export interface TelegramPopupParams {
  title?: string;
  message: string;
  buttons?: TelegramPopupButton[];
}

export interface TelegramPopupButton {
  id?: string;
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  text: string;
}

export interface TelegramScanQrPopupParams {
  text?: string;
}
