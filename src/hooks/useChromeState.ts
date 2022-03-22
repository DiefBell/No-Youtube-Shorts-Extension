import { useEffect, useState } from "react";
import { getChromeSyncValues } from "../helpers/getChromeSyncValues";
import { setChromeSyncValues } from "../helpers/setChromeSyncValues";
import { INysSettings } from "../types/INysSettings";

type SettingType<T extends keyof INysSettings> = INysSettings[T];

export const useChromeState = <T extends keyof INysSettings>(
	name : T,
	defaultValue : SettingType<T>
) : [ SettingType<T>, (newState : SettingType<T>) => Promise<void> ] =>
{
	const [ state, setState ] = useState<SettingType<T>>(defaultValue);


	const syncToChromeStorageOnMount = () =>
	{
		getChromeSyncValues([ name ]).then(async ({ [name]: value }) =>
		{
			if(value) setState(value as SettingType<T>);
			else await setChromeSyncValues({ [name]: defaultValue });
		});
	};
	useEffect(syncToChromeStorageOnMount, []);


	const setStateWithChromeSync = async (newState : SettingType<T>) =>
	{
		await setChromeSyncValues({ [name]: newState });
		setState(newState);
	};


	return [ state, setStateWithChromeSync ];
};
