import { CMessage } from '@base/message.class';

export function isMessage<T>(payload: CMessage | T): payload is CMessage {
  //magic happens here
  return (<CMessage>payload).message !== undefined;
}
