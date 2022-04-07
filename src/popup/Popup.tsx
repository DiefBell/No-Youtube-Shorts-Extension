import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
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
			<hr style={{
				width: "90%", backgroundColor: "red", marginTop: "0", marginBottom: "4px", padding: "0", height: "3px", border: "none"
			}}
			/>
			<div className="two-columns">
				<div className="button-container button-container-left">
					<button // we should create a new component for this button maybe? And move the states into it?
						className={hideNavigation ? "show-hide-button" : "show-hide-button__off"}
						disabled={!!disabledUntil}
						type="button"
						style={{
							backgroundColor: hideNavigation ? "red" : "#C7D0D8",
							color: hideNavigation ? "white" : "black",
						}}
						onClick={async () =>
						{
							await setHideNavigation(!hideNavigation);
						}}
					>
						{hideNavigation ? "Navigation blocked" : "Navigation on"}
					</button>

					<button // we should create a new component for this button maybe? And move the states into it?
						className={hideThumbnails ? "show-hide-button" : "show-hide-button__off"}
						disabled={!!disabledUntil}
						type="button"
						style={{
							backgroundColor: hideThumbnails ? "red" : "#C7D0D8",
							color: hideThumbnails ? "white" : "black",
						}}
						onClick={async () =>
						{
							await setHideThumbnails(!hideThumbnails);
						}}
					>
						{hideThumbnails ? "Thumbnails blocked" : "Thumbnails on"}
					</button>

					<button // we should create a new component for this button maybe? And move the states into it?
						className={redirectFromShorts ? "show-hide-button" : "show-hide-button__off"}
						disabled={!!disabledUntil}
						type="button"
						style={{
							backgroundColor: redirectFromShorts
								? "red"
								: "#C7D0D8",
							color: redirectFromShorts ? "white" : "black",
						}}
						onClick={async () =>
						{
							await setRedirectFromShorts(!redirectFromShorts);
						}}
					>
						{redirectFromShorts
							? "You'll be redirected to:"
							: "Redirection off"}
					</button>

					<select
						className={redirectFromShorts ? "redirection-menu" : "redirection-menu__off"}
						disabled={!!disabledUntil}
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
								className="show-hide-button-2 enable-disable-extension"
								type="button"
								onClick={() => setDisabledUntil(null)}
							>

								<FontAwesomeIcon icon={faPowerOff} />

								<span className="smaller-text">Turn on</span>
							</button>
							{/* <h4>
								Extension disabled until
								{` ${disabledUntil.toLocaleTimeString()}`}
							</h4> */}
						</div>
					) : (
						<div>
							<button
								className="enable-disable-extension "
								type="button"
								onClick={() =>
								{
									const date = new Date();
									date.setHours(date.getHours() + 1);
									setDisabledUntil(date);
								}}
							>
								<span className="off-icon">
									<FontAwesomeIcon icon={faPowerOff} />
								</span>
								<br />
								<span className="smaller-text">Turn off</span>

							</button>
						</div>
					)}
				</div>
			</div>
			<div>
				{disabledUntil !== null ? (
					<h4 className="disabled-until">
						Extension disabled until
						{` ${disabledUntil.toLocaleTimeString()}`}
					</h4>
				) : ("")}
			</div>
		</div>
	);

	// {redirectFromShorts && (
	// 	{/* dropdown here containing redirect pages */}
	// )}
	// {/* button to disable for an hour */}
}
