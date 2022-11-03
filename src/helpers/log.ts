import { MessagePayload } from "../types/MessagePayload";

export const log = (msg : string, args ?: unknown) =>
	chrome.runtime.sendMessage<MessagePayload, undefined>({
		type: "LOG",
		msg,
		args
	});
