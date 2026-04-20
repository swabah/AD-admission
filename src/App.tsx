import { BrowserRouter, Routes, Route } from "react-router-dom";
import ApplyPage from "./pages/ApplyPage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/apply" element={<ApplyPage />} />
				<Route path="/admin" element={<AdminPage />} />
				<Route path="/" element={<ApplyPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
