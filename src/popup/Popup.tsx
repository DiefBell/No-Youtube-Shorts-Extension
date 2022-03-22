import React, { useEffect } from "react";
import { ToggleSlider } from "react-toggle-slider";
import { useChromeState } from "../hooks/useChromeState";
import "./Popup.scss";

export default function Popup()
{
	const [ hideNavigation, setHideNavigation ] = useChromeState("hideNavigation", true);
	const [ hideThumbnails, setHideThumbnails ] = useChromeState("hideThumbnails", true);
	const [ redirectFromShorts, setRedirectFromShorts ] = useChromeState("redirectFromShorts", true);
	const [ redirectPage, setRedirectPage ] = useChromeState("redirectPage", "home");
	const [ disableUntil, setDisableUntil ] = useChromeState("disableUntil", null);

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
			<ToggleSlider active={redirectFromShorts} onToggle={(state) => setRedirectFromShorts(state)} />
		</div>
	);

	// {redirectFromShorts && (
	// 	{/* dropdown here containing redirect pages */}
	// )}
	// {/* button to disable for an hour */}
}
