
declare const window : Window & typeof globalThis & { thumbnailRemover ?: MutationObserver | null };

export const addThumbnailRemover = (debugMode : boolean) =>
{
	console.log(`Is debug mode? ${debugMode}`);
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

	const deleteNodeIfIsShort = (node : Node) =>
	{
		const nodeIsElement = (n : Node) : n is Element => !!(n as Element).tagName;

		if(nodeIsElement(node))
		{
			const isShortsOverlay = node.tagName === "YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER"
				&& node.getAttribute("overlay-style") === "SHORTS";

			if(isShortsOverlay)
			{
				const thumbnail = nthParent(node, 5);

				const removeThumbnail = () =>
				{
					thumbnail.parentNode.removeChild(thumbnail);
					console.log("Removing short thumbnail", thumbnail);
				};

				const highlightThumbnail = () =>
				{
					thumbnail.setAttribute("style", "background: linear-gradient(to top, #3204fdba, #9907facc) no-repeat top center;");
					console.log("Highlighting short thumbnail", thumbnail);
				};

				// need to ensure that the item is RENDERED, as well as its DOM node existing
				setTimeout(debugMode ? highlightThumbnail : removeThumbnail, 100);
			}
		}
	};

	const thumbnailRemoverCallback = (mutations : MutationRecord[]) =>
	{
		const addedNodes = mutations
			.filter((m) => m.type === "childList")
			.filter((m) => m.addedNodes.length > 0)
			.map((m) => m.addedNodes);

		addedNodes.forEach(
			(nodes) => nodes.forEach(deleteNodeIfIsShort)
		);
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

				setTimeout(
					() => youtubeRootNode.childNodes.forEach(deleteNodeIfIsShort),
					1000
				);
			};

			setupObserver();
		},
		100
	);
};
