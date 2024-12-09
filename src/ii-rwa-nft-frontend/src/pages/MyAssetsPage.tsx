import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { RWAAsset, RWAAssetMotoko } from "../types/rwa";
import { Link, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import { useBackend } from "../services/Actors";
import { useInternetIdentity } from "ic-use-internet-identity";
import { Button } from "../components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/popover"


const assets: RWAAsset[] = [
	{
		id: "1",
		name: "Downtown Apartment",
		type: "Real Estate",
		value: 250000,
		change: 5.2,
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
	{
		id: "2",
		name: "Gold Bullion",
		type: "Precious Metals",
		value: 50000,
		change: -1.8,
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
	{
		id: "3",
		name: "Corporate Bonds",
		type: "Fixed Income",
		value: 100000,
		change: 0.5,
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
	{
		id: "4",
		name: "Vintage Car Collection",
		type: "Collectibles",
		value: 750000,
		change: 12.3,
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
];
const assetsMotoko: RWAAssetMotoko[] = [
	{
		id: "1",
		owner: "2vxsx-fae",
		metadata: {
			name: "Downtown Apartment",
			type: "Real Estate",
			value: 250000,
			description: "A luxury apartment in downtown Manhattan.",
			image: "/placeholder.svg?height=100&width=200",
		}
	},
	{
		id: "2",
		owner: "2vxsx-fae",
		metadata: {
			name: "Gold Bullion",
			type: "Precious Metals",
			value: 50000,
			description: "A 1kg gold bar.",
			image: "/placeholder.svg?height=100&width=200",
		}
	},
	{
		id: "3",
		owner: "2vxsx-fae",
		metadata: {
			name: "Corporate Bonds",
			type: "Fixed Income",
			value: 100000,
			description: "Bonds issued by a Fortune 500 company.",
			image: "/placeholder.svg?height=100&width=200",
		}
	},
	{
		id: "4",
		owner: "2vxsx-fae",
		metadata: {
			name: "Vintage Car Collection",
			type: "Collectibles",
			value: 750000,
			description: "A collection of vintage cars from the 1950s.",
			image: "/placeholder.svg?height=100&width=200",
		}
	},
];

// (vec {record {id="1234"; owner=principal "2vxsx-fae"; metadata=record {value=500000; name="Toyota Supra"; description="Toyota Supra '90 Full Modif"; metadata_type="Car"; image="https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/jawapos/2019/11/1998-toyota-supra-for-499-999.jpg"}}})

export default function MyAssetsPage() {
	const { identity } = useInternetIdentity();
	const { actor: backend } = useBackend();
	const [assets, setAssets] = useState<string>();

	const { principal } = useParams();

	useEffect(() => {
		console.log("running useEffect")
		if (identity && backend && principal) {
		// if (backend && principal) {
			console.log("before running getMyAssets")
			backend.getMyAssets(principal).then((assets) => {
				console.log("assets")
				setAssets(JSON.stringify(assets, (key, value) => (typeof value === "bigint" ? value.toString() : value), 2));
			});
		}
	}, [backend, identity, principal]);

	const transferHandle = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const assetId = (event.currentTarget.elements.namedItem("asset_id") as HTMLInputElement).value;
		const recipient = (event.currentTarget.elements.namedItem("recipient") as HTMLInputElement).value;
		if (identity && backend && recipient) {
			backend.transferAsset(assetId, recipient).then((result) => {
				console.log("Transfer result: ", result);
				window.location.reload();
			});
		}
	};
	
	const burnHandle = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const assetId = (event.currentTarget.elements.namedItem("asset_id") as HTMLInputElement).value;
		if (identity && backend && assetId) {
			backend.burnAsset(assetId).then((result) => {
				console.log("Burn result: ", result);
				window.location.reload();
			});
		}
	}

	useEffect(() => {
        const timeout = setTimeout(() => {
            if (!identity) {
                window.location.href = "/";
            }
        }, 5000);

        return () => clearTimeout(timeout);
	}, [identity]);

	return (
		<div className="min-h-screen bg-black text-white p-8">
			<h1 className="text-3xl font-bold mb-8">My RWA Portfolio - {principal}</h1>
			<div className="my-4 w-full flex justify-between">
				<Link className="px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-gray-800 text-white hover:bg-gray-700" to="/">
					Back
				</Link>
				<Link className="px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-600 text-white hover:bg-blue-700" to="/my-assets/mint">
					Mint new asset
				</Link>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{assets ? (assets && JSON.parse(assets).map((asset: RWAAssetMotoko) => (
					<Card key={asset.id} className="bg-gray-900 border-gray-800">
						<CardHeader className="pb-4">
							<img src={asset.metadata.image} alt={asset.metadata.name} width={200} height={100} className="w-full h-40 object-cover rounded-t-lg" />
						</CardHeader>
						<CardContent>
							<CardTitle className="text-xl mb-2">{asset.metadata.name}</CardTitle>
							<div className="flex justify-between items-center mb-2">
								<Badge variant="secondary">{asset.metadata.type}</Badge>
								<span className="text-lg font-semibold">${asset.metadata.value.toLocaleString()}</span>
							</div>
							<Badge variant="secondary">{asset.metadata.description}</Badge>
							<div className="flex justify-end items-center mb-2 mt-4 w-full gap-4">
								<Popover>
									<PopoverTrigger>
										<Button variant="outline">Transfer</Button>
									</PopoverTrigger>
									<PopoverContent>
										<div>
											<h2 className="text-xl mb-4">Transfer Asset</h2>
											<form action="#" onSubmit={transferHandle}>
												<input
													type="text"
													className="border p-2 mb-4 w-full"
													placeholder="Enter recipient"
													name="recipient"
												/>
												<input type="hidden" value={asset.id} name="asset_id"/>
												<div className="flex justify-end">
													<Button
														variant="outline"
														type="submit"
														onClick={(e) => {
															if (!window.confirm("Are you sure you want to transfer this asset?")) {
																e.preventDefault();
															}
														}}
													>
														Transfer
													</Button>
												</div>
											</form>
										</div>
									</PopoverContent>
								</Popover>
								
								<form action="#" onSubmit={burnHandle}>
									<input type="hidden" value={asset.id} name="asset_id"/>
									<Button
										variant="outlineError"
										type="submit"
										onClick={(e) => {
											if (!window.confirm("Are you sure you want to burn this asset?")) {
												e.preventDefault();
											}
										}}
									>
										Burn
									</Button>
								</form>
							</div>
							{/* <div className={`text-sm ${asset.change >= 0 ? "text-green-400" : "text-red-400"}`}>
								{asset.change >= 0 ? "▲" : "▼"} {Math.abs(asset.change)}%
							</div> */}
						</CardContent>
					</Card>
				))) : (
					<div className="text-center w-full col-span-12 font-semibold">You have no portfolio!</div>
				)}
			</div>
		</div>
	);
}
