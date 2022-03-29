
declare const window : Window & typeof globalThis & { navButtonRemover ?: MutationObserver | null };

export const addNavButtonRemover = () =>
{
	if(window.navButtonRemover) return;

	const navButtonRemoverCallback = (mutations : MutationRecord[]) =>
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
				if(node.matches("ytd-mini-guide-entry-renderer"))
				{
					if(node.querySelector("a[title='Shorts']"))
					{
						console.log("No YouTube Shorts: removing navigation button");
						node.remove();
					}
				}
			}
		}));
	};

	window.navButtonRemover = new MutationObserver(navButtonRemoverCallback);
	const youtubeRootNode = document.querySelector("ytd-app");
	window.navButtonRemover.observe(youtubeRootNode, { subtree: true, childList: true });
};
