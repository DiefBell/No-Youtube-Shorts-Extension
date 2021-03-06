import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getChromeValues } from "../helpers/getChromeValues";
import { log } from "../helpers/log";
import { setChromeValues } from "../helpers/setChromeValues";
import { INysSettings } from "../types/INysSettings";

type SettingType<T extends keyof INysSettings> = INysSettings[T];

interface ITransformer<T extends keyof INysSettings>
{
	set : (value : SettingType<T>) => any;
	get : (value : any) => SettingType<T>;
}

// this all currently assumes no failures
export const useChromeState = <T extends keyof INysSettings>(
	name : T,
	defaultValue : SettingType<T>,
	transform : ITransformer<T> = {
		set: (value) => value,
		get: (value) => value
	}
) : [ SettingType<T>, (newValue : SettingType<T>) => Promise<void> ] =>
{
	const [ state, setState ] = useState(defaultValue);

	const getStorageFunction = async () =>
	{
		const { [name]: storedState } = await getChromeValues([ name ]);
		log(`Value of ${name} from Chrome sync storage: `, storedState !== undefined ? storedState.toString() : "undefined");
		return transform.get(storedState);
	};
	const storageQuery = useQuery(name, getStorageFunction);

	const setStateFromChromeStorage = () =>
	{
		if(storageQuery.isSuccess) // ensures this effect doesn't run on component mount
		{
			if(storageQuery.data === undefined)
			{
				log("Setting not in Chrome storage, setting to false.");
				setChromeValues({ [name]: transform.set(defaultValue) });
			}
			else
			{
				log(`Setting ${name} to ${storageQuery.data.toString()}`);
				setState(storageQuery.data);
			}
		}
	};
	useEffect(setStateFromChromeStorage, [ storageQuery.isSuccess ]);

	const setStateWithChromeSync = async (newState : SettingType<T>) =>
	{
		await setChromeValues({ [name]: transform.set(newState) });
		setState(newState);
	};


	return [ state, setStateWithChromeSync ];
};
