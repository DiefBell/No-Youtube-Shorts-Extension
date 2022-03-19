import React, { useEffect } from "react";
import { ToggleSlider } from "react-toggle-slider";
import { useChromeState } from "../hooks/useChromeState";
import "./Popup.scss";

export default function Popup()
{
    const [ hideNavigation, setHideNavigation ] = useChromeState("hideNavigation", true);
    const [ hideThumbnails, setHideThumbnails ] = useChromeState("hideThumbnails", true);
    const [ redirectToHome, setRedirectToHome ] = useChromeState("RedirectToHome", true); // maybe make the redirect page changeable?

    const broadcastPopupMounted = () =>
    {
        // Example of how to send a message to background.ts.
        chrome.runtime.sendMessage({ popupMounted: true });
    };
    useEffect(broadcastPopupMounted, []);

    return (
        <div className="popupContainer">
            Hello, world!
            <ToggleSlider active={hideNavigation} onToggle={(state) => setHideNavigation(state)} />
            <ToggleSlider active={hideThumbnails} onToggle={(state) => setHideThumbnails(state)} />
            <ToggleSlider active={redirectToHome} onToggle={(state) => setRedirectToHome(state)} />
        </div>
    );
}
