import { useEffect, useState } from "react";
import { useMutation as useAsyncFunction } from "react-query";
import { getChromeValues } from "../helpers/getChromeValues";
import { log } from "../helpers/log";
import { setChromeValues } from "../helpers/setChromeValues";
import { INysSettings } from "../types/INysSettings";

type SettingType<T extends keyof INysSettings> = INysSettings[T];

// this all currently assumes no failures
export const useChromeState = <T extends keyof INysSettings>(
	name : T,
	defaultValue : SettingType<T>
) : [ SettingType<T>, (newValue : SettingType<T>) => void ] =>
{
	const [ state, setState ] = useState(defaultValue);

	const getChromeState = useAsyncFunction(getChromeValues);

	const getChromeStateOnMount = () =>
	{
		log(`Getting chrome state for ${name}`);
		getChromeState.mutate([ name ]);
	};
	useEffect(getChromeStateOnMount, []);

	const onNewChromeState = () =>
	{
		if(!getChromeState.data) return;

		const value = getChromeState.data[name];

		if(value !== undefined) setState(value);
		else
		{
			setChromeValues({ [name]: value });
		}

		getChromeState.reset();
	};
	useEffect(onNewChromeState, [ getChromeState.isSuccess ]);

	const setNewValue = (newValue : SettingType<T>) =>
	{
		setChromeValues({ [name]: newValue });
	};

	return [ state, setNewValue ];
};
