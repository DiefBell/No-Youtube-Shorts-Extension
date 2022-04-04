import { INysSettings } from "../types/INysSettings";
import { addPrefixToKeys } from "./addPrefixToKeys";
import { log } from "./log";

export const setChromeValues = async (values : Partial<INysSettings>) : Promise<void> =>
{
	log("Setting chrome values: ");
	await chrome.storage.sync.set(addPrefixToKeys(values));
};
