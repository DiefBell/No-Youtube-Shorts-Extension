import { youtubeDomains } from "./constants/youtubeDomains";
import { youtubePageSettings } from "./constants/youtubePageSettings";
import { getChromeValues } from "./helpers/getChromeValues";
import { deleteNavigationButton } from "./scripts/deleteNavigationButton";
import { deleteThumbnails } from "./scripts/deleteThumbnails";
import { MessagePayload } from "./types/MessagePayload";


const messageHandler = (
	request : MessagePayload,
	sender : chrome.runtime.MessageSender,
	sendResponse : (response ?: any) => void
) : boolean =>
{
	const isResponseAsync = false;

	switch(request.type)
	{
	case "LOG":
		if(request.args) console.log(`No Youtube Shorts: ${request.msg}`, request.args); // eslint-disable-line no-console
		else console.log(`No YouTube Shorts: ${request.msg}`); // eslint-disable-line no-console
		break;
	default:
		break;
	}

	sendResponse();
	return isResponseAsync;
};
chrome.runtime.onMessage.addListener(messageHandler);


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
		disabledUntil,
	} = await getChromeValues([
		"hideNavigation",
		"hideThumbnails",
		"redirectFromShorts",
		"redirectPage",
		"disabledUntil"
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
