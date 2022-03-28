import React, { useEffect, useState } from "react";
import { YoutubePages } from "../constants/YoutubePages";
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
	const [ disabledUntil, setDisabledUntil ] = useChromeState("disabledUntil", null, {
		set: (value) => (value !== null ? value.toJSON() : null),
		get: (value) => (value !== null ? new Date(value) : null)
	});

	const [ disabledUntilText, setDisabledUntilText ] = useState("");

	const deleteAll = () =>
	{
		chrome.storage.sync.remove([
			"nys:disableUntil",
			"nys:hideNavigation",
			"nys:hideThumbnails",
			"nys:redirectFromShorts",
			"nyt:disableUntil"
		]);
	};
	// uncomment to delete from Chrome sync storage
	// useEffect(deleteAll, []);

	const updateDisabledUntilTextOnChange = () =>
	{
		if(disabledUntil !== null)
		{
			const today = new Date();
			if(today.getDate() === disabledUntil.getDate())
			{
				setDisabledUntilText(`Disabled until today at ${disabledUntil.toLocaleTimeString()}`);
			}
			else
			{
				setDisabledUntilText(`Disabled until tomorrow at ${disabledUntil.toLocaleTimeString()}`);
			}
		}
	};
	useEffect(updateDisabledUntilTextOnChange, [ disabledUntil ]);

	const checkIfDisabledTimeExpired = () =>
	{
		log("Disabled until: ", disabledUntil);
		if(disabledUntil !== null && disabledUntil < new Date())
		{
			setDisabledUntil(null);
		}
	};
	useEffect(checkIfDisabledTimeExpired); // run every render - overkill?

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

				{ disabledUntil !== null ? (
					<div>
						<button
							type="button"
							onClick={() => setDisabledUntil(null)}
						>
							Re-enable extension
						</button>
						<h4>
							{disabledUntilText}
						</h4>
					</div>
				) : (
					<div>
						<button
							type="button"
							onClick={() =>
							{
								const date = new Date();
								date.setHours(date.getHours() + 24);
								setDisabledUntil(date);
							}}
						>
							Disable for 24 hours
						</button>
					</div>
				)}
			</div>
		</div>
	);

	// {redirectFromShorts && (
	// 	{/* dropdown here containing redirect pages */}
	// )}
	// {/* button to disable for an hour */}
}
