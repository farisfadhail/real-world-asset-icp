import { useInternetIdentity } from "ic-use-internet-identity";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { BarChart3, Globe, Lock, Coins, Banknote } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useBackend } from "../services/Actors";

export default function LandingPage() {
	const { isLoggingIn, login, clear, identity } = useInternetIdentity();
	const { actor: backend } = useBackend();
	const [principal, setPrincipal] = useState<string>();

	const displayNone = () => {
		if (identity) {
			return "hidden";
		} else if (isLoggingIn) {
			return <>Logging in</>;
		}
		return "";
	};

	useEffect(() => {
		if (identity && backend && !principal) {
			backend.whoami().then((p) => setPrincipal(p.toString()));
		}
	}, [backend, identity, principal]);

	return (
		<div className="flex flex-col min-h-screen bg-black text-white">
			<header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
				<a className="flex items-center justify-center" href="#">
					<Coins className="h-6 w-6" />
					<span className="ml-2 text-2xl font-bold">RWA Chain</span>
				</a>
				<nav className="mx-auto flex gap-4 sm:gap-6">
					<a className="text-sm font-medium hover:underline underline-offset-4" href="#features">
						Features
					</a>
					<a className="text-sm font-medium hover:underline underline-offset-4" href="#about">
						About
					</a>
					<a className="text-sm font-medium hover:underline underline-offset-4" href="#contact">
						Contact
					</a>
				</nav>
				<div>
					{identity ? (
						<div className="flex gap-4">
							<Button className="bg-transparent hover:bg-blue-700 text-white border border-blue-600" variant="outline" onClick={clear}>
								Logout
							</Button>
							<Link className={`px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-transparent hover:bg-blue-700 text-white border border-blue-600 ${principal == undefined ? "cursor-not-allowed" : ""}`} 
								to={`/my-assets/${principal}`}
							>
								My Assets
							</Link>
						</div>
					) : (
						<Button className="bg-transparent hover:bg-blue-700 text-white border border-blue-600" variant="outline" onClick={login}>
							Login
						</Button>
					)}
				</div>
			</header>
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-black to-gray-900">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">Welcome to RWA Blockchain</h1>
								<p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">Bridging the gap between real-world assets and blockchain technology. Secure, transparent, and efficient.</p>
							</div>
							<div>
								{identity ? ("") : (
									<Button className="mr-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={login}>
										Get Started
									</Button>
								)}
								<Button className="bg-transparent hover:bg-blue-700 text-white border border-blue-600" variant="outline">
									Learn More
								</Button>
							</div>
						</div>
					</div>
				</section>
				<section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
					<div className="container px-4 md:px-6">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Understanding RWA</h2>
						<div className="max-w-3xl mx-auto text-gray-400 space-y-6">
							<p>
								Real World Assets (RWA) represent tangible or intangible assets that exist in the physical world but are tokenized on a blockchain. This innovative approach bridges the gap between traditional finance and the
								digital realm of cryptocurrencies.
							</p>
							<p>
								By tokenizing real-world assets such as real estate, commodities, art, or even intellectual property, RWAs bring increased liquidity, fractional ownership, and global accessibility to traditionally illiquid
								markets.
							</p>
							<p>
								Our RWA Blockchain platform leverages cutting-edge technology to ensure secure, transparent, and efficient management of these tokenized assets, opening up new possibilities for investors and asset owners
								alike.
							</p>
						</div>
					</div>
				</section>
				<section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-black">
					<div className="container px-4 md:px-6">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
							<div className="flex flex-col items-center space-y-2 border border-gray-700 p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900">
								<Globe className="h-12 w-12 mb-2 text-blue-400" />
								<h3 className="text-xl font-bold">Global Accessibility</h3>
								<p className="text-gray-400 text-center">Access real-world assets from anywhere in the world</p>
							</div>
							<div className="flex flex-col items-center space-y-2 border border-gray-700 p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900">
								<Lock className="h-12 w-12 mb-2 text-green-400" />
								<h3 className="text-xl font-bold">Enhanced Security</h3>
								<p className="text-gray-400 text-center">Blockchain-level security for your real-world assets</p>
							</div>
							<div className="flex flex-col items-center space-y-2 border border-gray-700 p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900">
								<BarChart3 className="h-12 w-12 mb-2 text-purple-400" />
								<h3 className="text-xl font-bold">Transparent Tracking</h3>
								<p className="text-gray-400 text-center">Real-time tracking and valuation of your assets</p>
							</div>
							<div className="flex flex-col items-center space-y-2 border border-gray-700 p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900">
								<Banknote className="h-12 w-12 mb-2 text-yellow-400" />
								<h3 className="text-xl font-bold">Fractional Ownership</h3>
								<p className="text-gray-400 text-center">Invest in high-value assets with minimal capital</p>
							</div>
						</div>
					</div>
				</section>
				<section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-t from-black to-gray-900">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join the RWA Revolution</h2>
								<p className="mx-auto max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Be part of the future of asset management. Sign up for updates and early access.</p>
							</div>
							<div className="w-full max-w-sm space-y-2">
								<form className="flex space-x-2">
									<Input className="max-w-lg flex-1 bg-gray-800 border-gray-700 text-white" placeholder="Enter your email" type="email" />
									<Button className="bg-blue-600 hover:bg-blue-700 text-white" type="submit">
										Subscribe
									</Button>
								</form>
								<p className="text-xs text-gray-500 dark:text-gray-400">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
							</div>
						</div>
					</div>
				</section>
			</main>
			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
				<p className="text-xs text-gray-500 dark:text-gray-400">© 2024 RWA Chain. All rights reserved.</p>
				<nav className="sm:ml-auto flex gap-4 sm:gap-6">
					<a className="text-xs hover:underline underline-offset-4" href="#">
						Terms of Service
					</a>
					<a className="text-xs hover:underline underline-offset-4" href="#">
						Privacy
					</a>
				</nav>
			</footer>
		</div>
	);
}
