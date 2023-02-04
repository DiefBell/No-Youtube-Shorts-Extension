import * as React from "react";
import * as ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Popup from "./Popup";

const queryClient = new QueryClient();

chrome.tabs.query({ active: true, currentWindow: true }, (tab) =>
{
	ReactDOM.render(
		<QueryClientProvider client={ queryClient }>
			<Popup />
		</QueryClientProvider>,
		document.getElementById("popup")
	);
});
