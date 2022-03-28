import React, { useEffect } from "react";
import { log } from "../helpers/log";
import { useChromeState } from "../hooks/useChromeState";
import "./Popup.scss";

export default function Popup()
{
	const [ hideNavigation, setHideNavigation ] = useChromeState("hideNavigation", true);

	const broadcastPopupMounted = () => log("Popup opened");
	useEffect(broadcastPopupMounted, []);

	const test = () => log("hideNavigation changed to: ", hideNavigation.toString());
	useEffect(test, [ hideNavigation ]);

	return (
		<div className="popupContainer">
			<h3>Turn off:</h3>
			<div className="popupContainer-content">
				<div className="popup-toggle-section">
					<h5 className="div-heading">Hide Navigation</h5>
					<h5 className="div-heading">Hide Thumbnails</h5>
					<h5 className="div-heading">Redirect from shorts</h5>
				</div>
				<div className="popup-toggle-section">
					<div className="slider">
						<button
							type="button"
							// className={hideNavigation ? "settings-button__on" : "settings-button__off"}
							style={{ backgroundColor: hideNavigation ? "red" : "blue" }}
							onClick={async () => { await setHideNavigation(!hideNavigation); }}
						>
							{ hideNavigation ? "show navigation" : "hide navigation" }
						</button>
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
