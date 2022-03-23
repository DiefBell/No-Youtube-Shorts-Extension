import { INysSettings } from "../types/INysSettings";
import { storagePrefix } from "../constants/storagePrefix";

export const setChromeSyncValues = async (values : Partial<INysSettings>) : Promise<void> =>
{
	const valuesWithKeysPrefixed = Object.fromEntries(
		Object.entries(values).map(([ k, v ]) => [ `${storagePrefix}:${k}`, v ])
	);

	await chrome.storage.sync.set(valuesWithKeysPrefixed);
};
