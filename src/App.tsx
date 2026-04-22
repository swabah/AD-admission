import { BrowserRouter, Routes, Route } from "react-router-dom";
import ApplyPage from "./pages/ApplyPage";
import NewAdmissionPage from "./pages/NewAdmissionPage";
import LocalAdmissionPage from "./pages/LocalAdmissionPage";
import LocateApplicationPage from "./pages/LocateApplicationPage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import AdminApplicationView from "./pages/AdminApplicationView";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<ApplyPage />} />
				<Route path="/apply" element={<ApplyPage />} />
				<Route path="/apply/new" element={<NewAdmissionPage />} />
				<Route path="/apply/local" element={<LocalAdmissionPage />} />
				<Route path="/locate" element={<LocateApplicationPage />} />
				<Route path="/admin" element={<AdminPage />} />
				<Route path="/admin/view/:id" element={<AdminApplicationView />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
