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
			<div className="grey-div">
				<h3>Turn off:</h3>
				<hr className="hr-divider" />
			</div>
			<div className="popupContainer-content">
				<div className="popup-toggle-section">
					<h5 className="div-heading">Hide Navigation</h5>
					<h5 className="div-heading">Hide Thumbnails</h5>
					<h5 className="div-heading">Redirect from shorts</h5>
				</div>
				<div className="popup-toggle-section">
					<div className="slider">
						<ToggleSlider
							active={hideNavigation}
							handleBackgroundColor="#D9D9D9"
							barBackgroundColorActive="#FF1616"
							barBackgroundColor="#000000"
							onToggle={(state) => setHideNavigation(state)}
						/>
					</div>
					<div className="slider">
						<ToggleSlider
							active={hideThumbnails}
							handleBackgroundColor="#D9D9D9"
							barBackgroundColorActive="#FF1616"
							barBackgroundColor="#000000"
							onToggle={(state) => setHideThumbnails(state)}
						/>
					</div>
					<div className="slider">
						<ToggleSlider
							active={redirectFromShorts}
							handleBackgroundColor="#D9D9D9"
							barBackgroundColorActive="#FF1616"
							barBackgroundColor="#000000"
							onToggle={(state) => setRedirectFromShorts(state)}
						/>
					</div>
				</div>
			</div>
		</div>
	);

	// {redirectFromShorts && (
	// 	{/* dropdown here containing redirect pages */}
	// )}
	// {/* button to disable for an hour */}
}
