
declare const window : Window & typeof globalThis & { navButtonRemover ?: MutationObserver | null };

export const addNavButtonRemover = () =>
{
	if(window.navButtonRemover) return;

	const navButtonRemoverCallback = (mutations : MutationRecord[]) =>
	{
		// need to work out how this can be moved into its own file...
		const nodeIsElement = (node : Node) : node is Element => !!(node as Element).matches;

		const addedNodes = mutations
			.filter((m) => m.type === "childList")
			.filter((m) => m.addedNodes.length > 0)
			.map((m) => m.addedNodes);

		addedNodes.forEach((nodes) => nodes.forEach((node) =>
		{
			if(nodeIsElement(node))
			{
				const isMiniNavButton = node.matches("ytd-mini-guide-entry-renderer");
				const isBigNavButton = node.matches("ytd-guide-entry-renderer");
				const isMobileNavButton = node.matches("ytm-pivot-bar-item-renderer");

				if(isMiniNavButton || isBigNavButton || isMobileNavButton)
				{
					if(node.querySelector("a[title='Shorts']"))
					{
						const buttonName = (isMiniNavButton && "mini")
							|| (isBigNavButton && "big")
							|| (isMobileNavButton && "mobile");

						console.log(`No YouTube Shorts: removing ${buttonName} navigation button`);
						node.remove();
					}
				}
			}
		}));
	};

	window.navButtonRemover = new MutationObserver(navButtonRemoverCallback);
	const youtubeRootNode = document.querySelector("ytd-app, ytm-app");
	window.navButtonRemover.observe(youtubeRootNode, { subtree: true, childList: true });
};
