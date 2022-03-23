import { INysSettings } from "../types/INysSettings";
import { storagePrefix } from "../constants/storagePrefix";

export const getChromeSyncValues = async (keys : (keyof INysSettings)[]) : Promise<Partial<INysSettings>> =>
{
	// prefix all values in storage with "nys:"
	const keysPrefixed = keys.map((key) => `${storagePrefix}:${key}`);

	// get the settings from storage
	const values = await chrome.storage.sync.get(keysPrefixed);

	// remove the prefixes in the final object
	return Object.fromEntries(
		Object.entries(values).map(([ k, v ]) => [ k.replace(storagePrefix, ""), v ])
	) as Partial<INysSettings>;
};
