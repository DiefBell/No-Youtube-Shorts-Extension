
declare const window : Window & typeof globalThis & { thumbnailRemover ?: MutationObserver | null };

export const addThumbnailRemover = () =>
{
	if(window.thumbnailRemover) return;

	const thumbnailRemoverCallback = (mutations : MutationRecord[]) =>
	{
		const nodeIsElement = (node : Node) : node is Element => !!(node as Element).matches;

		const addedNodes = mutations
			.filter((m) => m.type === "childList")
			.filter((m) => m.addedNodes.length > 0)
			.map((m) => m.addedNodes);

		addedNodes.forEach((nodes) => nodes.forEach((node) =>
		{
			if(nodeIsElement(node))
			{
				if(node.matches("ytd-grid-video-renderer"))
				{
					const removeThumbnailIfShort = () =>
					{
						// YouTube uses custom HTML tags, so selectors won't work
						// would be nice to find a way of doing this that doesn't require the setTimeout
						const overlayNodes = node.getElementsByTagName("ytd-thumbnail-overlay-time-status-renderer");

						if(overlayNodes[0]?.matches("[overlay-style='SHORTS']"))
						{
							console.log("No Youtube Shorts: removing thumbnail");
							node.remove();
						}
					};
					// need to ensure that the item is RENDERED, as well as its DOM node existing
					setTimeout(removeThumbnailIfShort, 0);
				}
			}
		}));
	};

	window.thumbnailRemover = new MutationObserver(thumbnailRemoverCallback);
	const youtubeRootNode = document.querySelector("ytd-app");
	window.thumbnailRemover.observe(youtubeRootNode, { subtree: true, childList: true });
};
