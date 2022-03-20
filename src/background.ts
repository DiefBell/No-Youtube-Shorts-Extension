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

const tabChangeHandler = (tabId, changeInfo, tab) =>
{
    console.log(tabId);
    console.log(changeInfo);
    console.log(tab);
};
chrome.tabs.onUpdated.addListener(tabChangeHandler);
