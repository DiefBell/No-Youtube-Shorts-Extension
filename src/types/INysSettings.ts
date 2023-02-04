import { YoutubePage } from "./YoutubePage";

export interface INysSettings
{
	hideNavigation : boolean;
	hideThumbnails : boolean;
	redirectFromShorts : boolean;
	redirectPage : YoutubePage,
	disabledUntil : Date | null,
	debugging : boolean;
}
