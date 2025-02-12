export interface IEventLogBase {
  id: number;
  eventId: number;
  message: string;
  detail: string;
  machine: string;
  createdAt: string;
}

/** Used to model the post information */
export interface IEventLog extends IEventLogBase {
  userId: number;
  logLevelId: number;
}

/** Used to get data about the logs */
export interface IEventLogDetail extends IEventLogBase {
  username: string;
  logLevel: string;
}

export interface IError {
  statusCode: number;
  statusText: string;
  message: string;
  url: string;
}

export interface ILogMessage {
  logLevel: string;
  message: string;
  detail: string;
}

export interface ILogSearchCriteria {
  filter?: string;
  dateFilter?: string;
  levelFilter?: number[];
}

/** Lookup for the external message status */
export enum ExternalMessageStatus {
  All = '',
  Queued = 'Queued',
  Blocking = 'Blocking',
  Processed = 'Processed'
}

/** Lookup for the external message status */
export enum ExternalMessageType {
  All = '',
  A08 = 'a08',
  A31 = 'a31',
  A34 = 'a34'
}

export interface IExternalMessage {
  id: number;
  msgTypeString: string;
  hic: string;
  facilityName: string;
  urn: string;
  createdAt: Date;
  processedAt: Date;
  processLog: string;
  msgXml: string;
}
