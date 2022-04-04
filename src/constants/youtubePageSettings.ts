import { YoutubePage } from "../types/YoutubePage";

export const youtubePageSettings : Record<YoutubePage, { url : string, title : string }> = {
	home: {
		url: "",
		title: "Home"
	},
	explore: {
		url: "feed/explore",
		title: "Explore"
	},
	shorts: {
		url: "shorts",
		title: "Shorts"
	},
	subscriptions: {
		url: "feed/subscriptions",
		title: "Subscriptions"
	}
} as const;
