import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { StaffProvider } from "./context/staffContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<StaffProvider>
			<BrowserRouter>
				<Toaster />
				<App />
			</BrowserRouter>
		</StaffProvider>
	</React.StrictMode>,
);
