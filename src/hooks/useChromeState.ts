import { useEffect, useState } from "react";

export const useChromeState = <T>(
    name : string,
    defaultValue : T
) : [ T, (newState : T) => void ] =>
{
    const [ state, setState ] = useState<T>(defaultValue);


    const syncToChromeStorageOnMount = () =>
    {
        chrome.storage.sync.get([ name ], ([ value ] : [T]) =>
        {
            if(value) setState(value);
            else chrome.storage.sync.set({ [name]: defaultValue });
        });
    };
    useEffect(syncToChromeStorageOnMount, []);


    const setStateWithChromeSync = (newState : T) =>
    {
        chrome.storage.sync.set({ [name]: newState });
        setState(newState);
    };


    return [ state, setStateWithChromeSync ];
};
