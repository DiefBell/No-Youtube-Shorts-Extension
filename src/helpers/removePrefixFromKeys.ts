import { storagePrefix } from "../constants/storagePrefix";

export const removePrefixFromKeys = (
	dict : Record<string, unknown>,
	prefix = storagePrefix
) => Object.fromEntries(
	Object.entries(dict).map(([ k, v ]) => [ k.replace(`${prefix}:`, ""), v ])
);
