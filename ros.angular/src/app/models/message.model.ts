import { ComponentType } from '@angular/cdk/overlay';

/** Validation */
export enum ValidationMessageType {
  Info,
  Warning,
  Error,
  Critical
}

/** A representation of the status types */
export enum MessageStatus {
  None = '',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Information = 'information',
  Critical = 'critical',
  Alert = 'alert'
}

export interface MessageModel {
  status: number;
  statusLevel: MessageStatus;
  statusText: string;
}

export interface StatusUpdate {
  status: MessageStatus;
  message: string;
  persist?: boolean;
}

export interface Message {
  severity: MessageStatus;
  summary?: string;
  detail?: string;
  id?: number;
  key?: string;
  life?: number;
  sticky?: boolean;
  closable?: boolean;
  data?: string;
}

export interface CloseMessage {
  index: number;
  message: Message;
}

export interface DialogMessageData {
  status: MessageStatus;
  title: string;
  message: string;
  buttonText: string;
  isAlert: boolean;
}

export interface CreateDialogInput {
  /** Add additional data types here | newDialogMessageData */
  data: DialogMessageData;
  component: ComponentType<unknown>;
  width?: string;
  top?: string;
}
