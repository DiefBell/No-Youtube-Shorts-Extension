import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { log } from "../helpers/log";
import { useChromeState } from "../hooks/useChromeState";
import "./Popup.scss";

export default function Popup()
{
	const [ hideNavigation, setHideNavigation ] = useState(true);

	const getHideNav = async () =>
	{
		const rawSetting = await chrome.storage.sync.get([ "nys:hideNavigation" ]);
		log("Raw settings: ", rawSetting);
		const value = rawSetting["nys:hideNavigation"];
		log("Value: ", value !== undefined ? value.toString() : "undefined");
		return value;
	};
	const getHideNavQuery = useQuery("getHideNav", getHideNav);

	const broadcastPopupMounted = () => log("Popup opened");
	useEffect(broadcastPopupMounted, []);

	const getHideNavSetting = () =>
	{
		if(getHideNavQuery.isSuccess) // ensures this doesn't run on component mount
		{
			if(getHideNavQuery.data === undefined)
			{
				log("Setting not in Chrome storage, setting to false.");
				chrome.storage.sync.set({ "nys:hideNavigation": true });
			}
			else
			{
				log(`Setting hideNavigation to ${getHideNavQuery.data.toString()}`);
				setHideNavigation(getHideNavQuery.data);
			}
		}
	};
	useEffect(getHideNavSetting, [ getHideNavQuery.isSuccess ]);

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
							// className={hideNavigation ? "settings-button__on" : "settings-button"}
							onClick={async () =>
							{
								await chrome.storage.sync.set({ "nys:hideNavigation": !hideNavigation });
								setHideNavigation(!hideNavigation);
							}}
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
