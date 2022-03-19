import { useEffect, useState } from "react";

export const useChromeState = <T>(
    name : string,
    defaultValue : T
) : [ T, (newState : T) => void ] =>
{
    const [ state, setState ] = useState<T>(defaultValue);


    // const syncToChromeStorageOnMount = () =>
    // {
    //     chrome.storage.local.get([ name ], ([ value ] : [T]) =>
    //     {
    //         if(value) setState(value);
    //         else chrome.storage.local.set({ [name]: defaultValue });
    //     });
    // };
    // useEffect(syncToChromeStorageOnMount, []);


    // const setStateWithChromeSync = (newState : T) =>
    // {
    //     chrome.storage.local.set({ [name]: newState });
    //     setState(newState);
    // };


    // return [ state, setStateWithChromeSync ];

    return [ state, setState ];
};
