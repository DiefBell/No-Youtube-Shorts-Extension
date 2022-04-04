import { INysSettings } from "../types/INysSettings";
import { storagePrefix } from "../constants/storagePrefix";
import { removePrefixFromKeys } from "./removePrefixFromKeys";
import { log } from "./log";

export const getChromeValues = async (keys : (keyof INysSettings)[]) : Promise<Partial<INysSettings>> =>
{
	// prefix all values in storage with "nys:"
	const keysPrefixed = keys.map((key) => `${storagePrefix}:${key}`);

	// get the settings from storage
	const values = await chrome.storage.sync.get(keysPrefixed);

	// remove the prefixes in the final object
	const valuesNoPrefixes = removePrefixFromKeys(values) as Partial<INysSettings>;

	log("Getting chrome values: ", valuesNoPrefixes.toString());

	return valuesNoPrefixes;
};
