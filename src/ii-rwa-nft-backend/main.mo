import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";

actor {
    public type Asset = {
        id : Text;
        owner : Principal;
        metadata : Metadata;
    };

    public type Metadata = {
        name : Text;
        metadata_type : Text;
        value : Nat64;
        description : Text;
        image : Text;
    };

    type EventLog = {
        log_type : Text;
        asset : Text;
        from : Principal;
        to : ?Principal;
    };

    private stable var assets : [Asset] = [];
    private stable var eventLogs : [EventLog] = [];

    public shared func mintAsset(id : Text, owner : Text, metadata_type : Text, metadata_name : Text, metadata_description : Text, metadata_image : Text, metadata_value : Nat) : async (Nat, Text, ?Asset) {
        let caller = Principal.fromText(owner);
        // if (_caller == Principal.fromText("2vxsx-fae")) {
        //     return (403, "Unauthorized", null);
        // };

        if (Array.filter<Asset>(assets, func(Asset) = Asset.id == id).size() > 0) {
            return (409, "Asset already minted", null);
        };

        let newAsset = {
            id = id;
            owner = caller;
            metadata = {
                name = metadata_name;
                description = metadata_description;
                value = Nat64.fromNat(metadata_value);
                image = metadata_image;
                metadata_type = metadata_type;
            };
        };

        assets := Array.append<Asset>(assets, [newAsset]);

        let eventLog = {
            log_type = "Mint";
            asset = id;
            from = caller;
            to = null;
        };

        eventLogs := Array.append(eventLogs, [eventLog]);

        return (500, "Asset successfully tokenized", ?newAsset);
    };

    public shared (msg) func transferAsset(id : Text, newOwner : Text) : async (Nat, Text, ?Asset) {
        let caller = msg.caller;
        var Asset = await getAssetById(id);

        if (Asset.id == "") {
            return (404, "Asset not found", null);
        };

        if (Asset.owner != caller) {
            return (403, "Unauthorized", null);
        };

        let newOwnerParsed = Principal.fromText(newOwner);

        Asset := { Asset with owner = newOwnerParsed };

        assets := Array.map<Asset, Asset>(
            assets,
            func(a) {
                if (a.id == id) {
                    Asset;
                } else {
                    a;
                };
            },
        );

        let eventLog = {
            log_type = "Transfer";
            asset = id;
            from = caller;
            to = ?newOwnerParsed;
        };

        eventLogs := Array.append(eventLogs, [eventLog]);

        return (200, "Asset's ownership successfully transferred", ?Asset);
    };

    public shared (_msg) func getAssetById(id : Text) : async Asset {
        for (asset in assets.vals()) {
            if (asset.id == id) {
                return asset;
            };
        };

        return {
            id = "";
            owner = Principal.fromText("2vxsx-fae");
            metadata = {
                name = "";
                description = "";
                image = "";
                metadata_type = "";
                value = Nat64.fromNat(0);
            };
        };
    };

    // Fungsi untuk membakar token
    public shared (msg) func burnAsset(id : Text) : async (Nat, Text) {
        let caller = msg.caller;

        let Asset = await getAssetById(id);

        if (Asset.id == "") {
            return (404, "Asset not found");
        };

        if (Asset.owner != caller) {
            return (403, "Unauthorized");
        };

        assets := Array.filter<Asset>(assets, func(Asset) = Asset.id != id);

        let eventLog = {
            log_type = "Burn";
            asset = id;
            from = caller;
            to = null;
        };

        eventLogs := Array.append(eventLogs, [eventLog]);

        return (200, "Token has been burned");
    };

    public shared func getMyAssets(principal : Text) : async [Asset] {
        let caller = Principal.fromText(principal);
        let myAssets = Array.filter<Asset>(assets, func(Asset) = Asset.owner == caller);
        return myAssets;
    };

    public shared (msg) func getMyEventLogs() : async [EventLog] {
        let caller = msg.caller;
        let myEventLogs = Array.filter<EventLog>(eventLogs, func(EventLog) = EventLog.from == caller);
        return myEventLogs;
    };

    public shared func getAllAssets() : async [Asset] {
        return assets;
    };

    public shared func getAllEventLogs() : async [EventLog] {
        return eventLogs;
    };

    public shared (msg) func whoami() : async Principal {
        return msg.caller;
    };
};
