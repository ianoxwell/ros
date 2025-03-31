import { CMessage } from '@base/message.class';

export function isMessage<T>(payload: CMessage | T): payload is CMessage {
  //magic happens here
  return (<CMessage>payload).message !== undefined;
}

export function convertDateIndexToDate(dateIndex: string): Date {
  return new Date(
    Date.UTC(
      parseInt(dateIndex.substring(0, 4), 10),
      parseInt(dateIndex.substring(4, 6), 10) - 1, // Months are 0-based
      parseInt(dateIndex.substring(6, 8), 10),
      0,
      0,
      0,
      0
    )
  );
}
