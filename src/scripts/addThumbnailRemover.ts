
declare const window : Window & typeof globalThis & { thumbnailRemover ?: MutationObserver | null };

export const addThumbnailRemover = () =>
{
	// this has to be inside here for it to get bundled by WebPack
	const nthParent = (element : Element, n : number) =>
	{
		let parent = element;
		for(let i = 0; i < n; i++)
		{
			parent = parent.parentElement;
		}
		return parent;
	};

	const thumbnailRemoverCallback = (mutations : MutationRecord[]) =>
	{
		const nodeIsElement = (node : Node) : node is Element => !!(node as Element).matches;

		const addedNodes = mutations
			.filter((m) => m.type === "childList")
			.filter((m) => m.addedNodes.length > 0)
			.map((m) => m.addedNodes);

		addedNodes.forEach((nodes) => nodes.forEach((node) =>
		{
			// console.log((node as any).tagName);
			if(nodeIsElement(node))
			{
				const isShortsOverlay = node.tagName === "YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER"
					&& node.getAttribute("overlay-style") === "SHORTS";

				if(isShortsOverlay)
				{
					console.log("Video renderer");

					const thumbnail = nthParent(node, 5);
					console.log(thumbnail);

					const removeThumbnail = () =>
					{
						node.remove();
					};

					// need to ensure that the item is RENDERED, as well as its DOM node existing
					setTimeout(removeThumbnail, 20);
				}
			}
		}));
	};

	setTimeout(
		() =>
		{
			window.thumbnailRemover = new MutationObserver(thumbnailRemoverCallback);

			const setupObserver = () =>
			{
				const youtubeRootNode = document.querySelector("ytd-app, ytm-app");
				if(!youtubeRootNode)
				{
					setTimeout(setupObserver, 100);
					return;
				}
				console.log("YouTube root:", youtubeRootNode);
				window.thumbnailRemover.observe(youtubeRootNode, { subtree: true, childList: true });
			};

			setupObserver();
		},
		100
	);
};
