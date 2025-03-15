import { IMessage } from '@domain/message.dto';

export function isMessage<T>(payload: IMessage | T): payload is IMessage {
  //magic happens here
  return (<IMessage>payload).message !== undefined;
}
