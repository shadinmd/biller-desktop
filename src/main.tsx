import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { UserProvider } from "./context/userContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<UserProvider>
			<BrowserRouter>
				<Toaster />
				<App />
			</BrowserRouter>
		</UserProvider>
	</React.StrictMode>,
);
