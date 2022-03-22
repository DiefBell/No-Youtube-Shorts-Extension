export const deleteNavigationButton = () =>
{
	setTimeout(() =>
	{
		const navNode = document.querySelector("ytd-guide-section-renderer");
		if(navNode)
		{
			const navButtons = navNode.querySelectorAll("ytd-guide-entry-renderer");
			console.log(`No YouTube Shorts extension: found ${navButtons.length} full nav buttons`);
			return;
		}

		const navNodeMini = document.querySelector("ytd-mini-guide-renderer");
		if(navNodeMini)
		{
			const navButtons = navNodeMini.querySelectorAll("ytd-mini-guide-entry-renderer");
			const shortsNavButton = navButtons.forEach((element) =>
			{
				const titleTextSpan = element.querySelector("span.title");
				if(titleTextSpan.innerHTML === "Shorts")
				{
					console.log("No YouTube Shorts extension: removing Shorts navigation icon");
					element.remove();
					return;
				}
			});
			return;
		}
	}, 1000);
};

// try this: https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
