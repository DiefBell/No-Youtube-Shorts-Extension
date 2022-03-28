import React, { useEffect } from "react";
import { YoutubePages } from "../constants/YoutubePages";
import { youtubePageSettings } from "../constants/youtubePageSettings";
import { log } from "../helpers/log";
import { useChromeState } from "../hooks/useChromeState";
import { YoutubePage } from "../types/YoutubePage";
import "./Popup.scss";

export default function Popup()
{
	const [ hideNavigation, setHideNavigation ] = useChromeState("hideNavigation", true);
	const [ hideThumbnails, setHideThumbnails ] = useChromeState("hideThumbnails", true);
	const [ redirectFromShorts, setRedirectFromShorts ] = useChromeState("redirectFromShorts", true);
	const [ redirectPage, setRedirectPage ] = useChromeState("redirectPage", "home");

	const broadcastPopupMounted = () => log("Popup opened");
	useEffect(broadcastPopupMounted, []);

	const test = () => log("hideNavigation changed to: ", hideNavigation.toString());
	useEffect(test, [ hideNavigation ]);

	return (
		<div className="popupContainer">
			<h3>Settings:</h3>
			<div className="toggles">
				<button // we should create a new component for this button maybe? And move the states into it?
					type="button"
					// className={hideNavigation ? "settings-button__on" : "settings-button__off"}
					style={{ backgroundColor: hideNavigation ? "red" : "blue" }} // swap for className
					onClick={async () => { await setHideNavigation(!hideNavigation); }}
				>
					{ hideNavigation ? "show navigation" : "hide navigation" }
				</button>

				<button // we should create a new component for this button maybe? And move the states into it?
					type="button"
					// className={hideNavigation ? "settings-button__on" : "settings-button__off"}
					style={{ backgroundColor: hideThumbnails ? "red" : "blue" }} // swap for className
					onClick={async () => { await setHideThumbnails(!hideThumbnails); }}
				>
					{ hideThumbnails ? "show thumbnails" : "hide thumbnails" }
				</button>

				<button // we should create a new component for this button maybe? And move the states into it?
					type="button"
					// className={hideNavigation ? "settings-button__on" : "settings-button__off"}
					style={{ backgroundColor: redirectFromShorts ? "red" : "blue" }} // swap for className
					onClick={async () => { await setRedirectFromShorts(!redirectFromShorts); }}
				>
					{ redirectFromShorts ? "don't redirect from shorts" : "redirect from shorts" }
				</button>

				<select
					disabled={!redirectFromShorts}
					name="redirectPage"
					onChange={(option) => { setRedirectPage(option.target.value as YoutubePage); }}
					value={redirectPage}
				>
					{YoutubePages.filter((page) => page !== "shorts").map((page) => (
						<option key={page} value={page}>{page}</option>
					))}
				</select>
			</div>
		</div>
	);

	// {redirectFromShorts && (
	// 	{/* dropdown here containing redirect pages */}
	// )}
	// {/* button to disable for an hour */}
}
