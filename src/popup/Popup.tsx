import React, { useEffect } from "react";
import { YoutubePages } from "../constants/YoutubePages";
import { log } from "../helpers/log";
import { useChromeState } from "../hooks/useChromeState";
import { YoutubePage } from "../types/YoutubePage";
import "./Popup.scss";

export default function Popup()
{
	const [ hideNavigation, setHideNavigation ] = useChromeState(
		"hideNavigation",
		true
	);
	const [ hideThumbnails, setHideThumbnails ] = useChromeState(
		"hideThumbnails",
		true
	);
	const [ redirectFromShorts, setRedirectFromShorts ] = useChromeState(
		"redirectFromShorts",
		true
	);
	const [ redirectPage, setRedirectPage ] = useChromeState(
		"redirectPage",
		"home"
	);
	const [ disabledUntil, setDisabledUntil ] = useChromeState(
		"disabledUntil",
		null,
		{
			set: (value) => (value !== null ? value.toJSON() : null),
			get: (value) => (value !== null ? new Date(value) : null),
		}
	);

	const deleteAll = () =>
	{
		chrome.storage.sync.remove([
			"nys:disableUntil",
			"nys:hideNavigation",
			"nys:hideThumbnails",
			"nys:redirectFromShorts",
			"nyt:disableUntil",
		]);
	};
	// uncomment to delete from Chrome sync storage
	// useEffect(deleteAll, []);

	const checkIfDisabledTimeExpired = () =>
	{
		if (disabledUntil !== null && disabledUntil < new Date())
		{
			// TODO: this should really be getting done by the back-end, else the popup needs opening for it to re-enable
			setDisabledUntil(null);
		}
	};
	useEffect(checkIfDisabledTimeExpired, []);

	return (
		<div className="popupContainer">
			<h3>Settings:</h3>
			<div className="two-columns">
				<div className="button-container button-container-left">
					<button // we should create a new component for this button maybe? And move the states into it?
						className="show-hide-button"
						type="button"
						// className={hideNavigation ? "settings-button__on" : "settings-button__off"}
						style={{
							backgroundColor: hideNavigation ? "red" : "grey",
						}} // swap for className
						onClick={async () =>
						{
							await setHideNavigation(!hideNavigation);
						}}
						disabled={disabledUntil !== null}
					>
						{hideNavigation ? "Navigation blocked" : "Navigation on"}
					</button>

					<button // we should create a new component for this button maybe? And move the states into it?
						className="show-hide-button"
						type="button"
						// className={hideNavigation ? "settings-button__on" : "settings-button__off"}
						style={{
							backgroundColor: hideThumbnails ? "red" : "grey",
						}} // swap for className
						onClick={async () =>
						{
							await setHideThumbnails(!hideThumbnails);
						}}
						disabled={disabledUntil !== null}
					>
						{hideThumbnails ? "Thumbnails blocked" : "Thumbnails on"}
					</button>

					<button // we should create a new component for this button maybe? And move the states into it?
						className="show-hide-button"
						type="button"
						// className={hideNavigation ? "settings-button__on" : "settings-button__off"}
						style={{
							backgroundColor: redirectFromShorts
								? "red"
								: "grey",
						}} // swap for className
						onClick={async () =>
						{
							await setRedirectFromShorts(!redirectFromShorts);
						}}
						disabled={disabledUntil !== null}
					>
						{redirectFromShorts
							? "You'll be redirected to:"
							: "Redirection off"}
					</button>

					<select
						disabled={!redirectFromShorts || disabledUntil !== null}
						name="redirectPage"
						onChange={(option) =>
						{
							setRedirectPage(option.target.value as YoutubePage);
						}}
						value={redirectPage}
					>
						{YoutubePages.filter((page) => page !== "shorts").map(
							(page) => (
								<option key={page} value={page}>
									{page}
								</option>
							)
						)}
					</select>
				</div>
				<div className="button-container button-container-right">
					{disabledUntil !== null ? (
						<div>
							<button
								className="show-hide-button"
								type="button"
								onClick={() => setDisabledUntil(null)}
							>
								Re-enable extension
							</button>
							<h4>
								Extension disabled until
								{` ${disabledUntil.toLocaleTimeString()}`}
							</h4>
						</div>
					) : (
						<div>
							<button
								type="button"
								onClick={() =>
								{
									const date = new Date();
									date.setHours(date.getHours() + 1);
									setDisabledUntil(date);
								}}
							>
								Disable for one hour
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);

	// {redirectFromShorts && (
	// 	{/* dropdown here containing redirect pages */}
	// )}
	// {/* button to disable for an hour */}
}
