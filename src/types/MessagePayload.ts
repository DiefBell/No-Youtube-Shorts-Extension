// eventually convert to an interface that specifies return types

export type MessagePayload =
	{ type : "LOG", msg : string, args ?: any } |
	{ type : "PLACEHOLDER", age : number, name : string };
