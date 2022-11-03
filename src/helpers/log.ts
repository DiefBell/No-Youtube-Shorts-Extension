import { MessagePayload } from "../types/MessagePayload";

export const log = (msg : string, args ?: unknown) =>
{
	try
	{
		chrome.runtime.sendMessage<MessagePayload, undefined>({
			type: "LOG",
			msg,
			args
		});
	}
	catch(err)
	{
		console.error(err);
	}
};
