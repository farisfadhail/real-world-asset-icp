import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import MyAssetsPage from "./pages/MyAssetsPage";
import MintAssetPage from "./pages/MintAssetPage";

export default function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/my-assets/:principal" element={<MyAssetsPage />} />
				<Route path="/my-assets/mint" element={<MintAssetPage />} />
			</Routes>
		</>
	);
}
