export const deleteThumbnails = () =>
{
	const browseNode = document.querySelector("ytd-browse");
	if(!browseNode) return;

	const shorts = browseNode.querySelectorAll(
		"ytd-grid-video-renderer[is-shorts]"
	);

	console.log(`No YouTube Shorts extension: hiding ${shorts.length} Shorts thumbnail${shorts.length !== 1 && "s"}`);
	shorts.forEach((short) => short.remove());
};
