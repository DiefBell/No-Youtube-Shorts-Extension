import { youtubeDomains } from "./constants/youtubeDomains";
import { youtubePageSettings } from "./constants/youtubePages";
import { getChromeSyncValues } from "./helpers/getChromeSyncValues";
import { deleteNavigationButton } from "./scripts/deleteNavigationButton";
import { deleteThumbnails } from "./scripts/deleteThumbnails";



// Listen to messages sent from other parts of the extension.
const popupMountedHandler = (
	request : any,
	sender : chrome.runtime.MessageSender,
	sendResponse : (response ?: any) => void,
) =>
{
	// onMessage must return "true" if response is async.
	const isResponseAsync = true;

	if (request.popupMounted)
	{
		console.log("background worker notified that Popup.tsx has mounted.");
	}

	return isResponseAsync;
};

chrome.runtime.onMessage.addListener(popupMountedHandler);



const tabChangeHandler = async (
	tabId : number,
	changeInfo : chrome.tabs.TabChangeInfo,
	tab : chrome.tabs.Tab
) =>
{
	console.log("\n\n=== TAB CHANGED ===");
	console.log("Tab id: ", tabId);
	console.log("Change info", changeInfo);
	console.log("Tab: ", tab);

	if(tab.status !== "complete" && tab.status !== "loading") return;

	const youtubeDomain = youtubeDomains.find((ytDomain) => tab.url?.includes(ytDomain));
	if(!youtubeDomain) return;

	const {
		hideNavigation,
		hideThumbnails,
		redirectFromShorts,
		redirectPage,
		disableUntil,
	} = await getChromeSyncValues([
		"hideNavigation",
		"hideThumbnails",
		"redirectFromShorts",
		"redirectPage",
		"disableUntil"
	]);

	if(redirectFromShorts === undefined || redirectFromShorts === true)
	{
		if(tab.url.includes(`${youtubeDomain}${youtubePageSettings.shorts.url}`))
		{
			console.log("Redirecting!!!");
			const redirectUrl = redirectPage !== undefined
				? youtubePageSettings[redirectPage].url
				: youtubePageSettings.home.url;
			await chrome.tabs.update(tabId, { url: `http://${youtubeDomain}${redirectUrl}` });
		}
	}

	if(tab.status !== "complete") return;

	if(hideThumbnails === undefined || hideThumbnails === true)
	{
		await chrome.scripting.executeScript({
			target: { tabId },
			func: deleteThumbnails
		});
	}

	if(hideNavigation === undefined || hideNavigation === true)
	{
		await chrome.scripting.executeScript({
			target: { tabId },
			func: deleteNavigationButton
		});
	}
};
chrome.tabs.onUpdated.addListener(tabChangeHandler);
