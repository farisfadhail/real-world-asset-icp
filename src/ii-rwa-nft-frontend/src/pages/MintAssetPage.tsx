import { Link } from "react-router";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Textarea } from "../components/textarea";
import { useBackend } from "../services/Actors";
import { useInternetIdentity } from "ic-use-internet-identity";
import { useEffect, useState } from "react";

export default function MintAssetPage() {
    const { identity } = useInternetIdentity();
    const { actor: backend } = useBackend();
    const [principal, setPrincipal] = useState<string>();

	const mintHandle = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
        const assetId = (event.currentTarget.elements.namedItem("asset_id") as HTMLInputElement).value;
        const type = (event.currentTarget.elements.namedItem("type") as HTMLInputElement).value;
        const name = (event.currentTarget.elements.namedItem("name") as HTMLInputElement).value;
        const description = (event.currentTarget.elements.namedItem("description") as HTMLInputElement).value;
        const image = (event.currentTarget.elements.namedItem("image") as HTMLInputElement).value;
        const value = (event.currentTarget.elements.namedItem("value") as HTMLInputElement).value;
        if (identity && backend && principal && assetId && type && name && description && image && value) {
            try {
                await backend.mintAsset(assetId, principal, type, name, description, image, BigInt(value));
                window.location.href = `/my-assets/${principal}`;
            } catch (error) {
                console.error(error);
            }
        }

        console.log(assetId, type, name, description, image, value);
	};

    useEffect(() => {
		if (identity && backend && !principal) {
			backend.whoami().then((p) => setPrincipal(p.toString()));
		}
	}, [backend, identity, principal]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!identity) {
                window.location.href = "/";
            }
        }, 5000);

        return () => clearTimeout(timeout);
	}, [identity]);

	// id : Text, owner : Text, metadata_type : Text, metadata_name : Text, metadata_description : Text, metadata_image : Text, metadata_value : Nat

	return (
		<>
			<div className="min-h-screen bg-black text-white grid grid-cols-6 p-8">
				<div className="col-start-2 col-span-4">
					<h1 className="text-3xl font-bold">Mint an Asset</h1>
					<p className="text-lg">Mint a new asset on the blockchain.</p>
					<form action="#" onSubmit={mintHandle} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="assetId">Asset Unique Identifier</Label>
                            <Input type="text" placeholder="Enter unique value of your asset" name="asset_id" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Asset Type</Label>
                            <Input type="text" placeholder="Enter your asset type" name="type" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Asset Name</Label>
                            <Input type="text" placeholder="Enter your asset name" name="name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Asset Description</Label>
                            <Textarea placeholder="Type your asset description here." name="description" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Asset Image</Label>
                            <Input type="text" placeholder="Enter your asset link image" name="image" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Asset Value (price in USD)</Label>
                            <Input 
                                type="text" 
                                placeholder="Enter your asset value" 
                                name="value" 
                                pattern="\d*" 
                                title="Please enter a valid number"
                            />
                        </div>
                        <div className="space-x-4">
                            <Button type="submit" className="mt-4">Mint Asset</Button>
                            <Link className={`px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-red-600 bg-transparent hover:bg-red-700 hover:text-white ${principal == undefined ? "cursor-not-allowed" : ""}`} 
                                to={`/my-assets/${principal}`}
                            >
                                Cancel
                            </Link>
                        </div>
					</form>
				</div>
			</div>
		</>
	);
}
