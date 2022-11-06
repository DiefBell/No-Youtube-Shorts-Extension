
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
		const nodeIsElement = (node : Node) : node is Element => !!(node as Element).tagName;

		const addedNodes = mutations
			.filter((m) => m.type === "childList")
			.filter((m) => m.addedNodes.length > 0)
			.map((m) => m.addedNodes);

		addedNodes.forEach((nodes) => nodes.forEach((node) =>
		{
			if(nodeIsElement(node))
			{
				const isShortsOverlay = node.tagName === "YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER"
					&& node.getAttribute("overlay-style") === "SHORTS";

				if(isShortsOverlay)
				{
					const thumbnail = nthParent(node, 5);

					// const removeThumbnail = () =>
					// {
					// 	thumbnail.parentNode.removeChild(thumbnail);
					// };

					const removeThumbnail = () =>
					{
						thumbnail.setAttribute("style", "background: linear-gradient(to top, #3204fdba, #9907facc) no-repeat top center;");
						console.log("Adding white border to", thumbnail);
					};

					// need to ensure that the item is RENDERED, as well as its DOM node existing
					setTimeout(removeThumbnail, 100);
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
				window.thumbnailRemover.observe(youtubeRootNode, { subtree: true, childList: true });
			};

			setupObserver();
		},
		100
	);
};
