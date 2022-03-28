import { storagePrefix } from "../constants/storagePrefix";

export const addPrefixToKeys = (
	dict : Record<string, unknown>,
	prefix = storagePrefix
) => Object.fromEntries(Object.entries(dict).map(([ k, v ]) => [ `${prefix}:${k}`, v ]));
