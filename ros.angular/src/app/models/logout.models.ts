export enum ExpiryUpdateOrigin {
  Page,
  Ajax,
  CrossWindow
}

export enum AuthStatus {
  Ok,
  Warn,
  Expired
}

/** Dialog related state */
export enum SessionDialog {
  /** Key used to open/close warning dialog */
  WarningKey = 'Logout.Warning',

  /** Key used to open/close expiry dialog */
  ExpiryKey = 'Logout.Expiry'
}

export interface ITokenState {
  expiresAt: number;
  refreshesAt: number;
  warnsAt: number;
}

export interface IRefreshState {
  isChanged: boolean;
  authFailed: boolean;
}
