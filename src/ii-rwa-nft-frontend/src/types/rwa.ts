export interface RWAAsset {
  id: string;
  name: string;
  type: string;
  value: number;
  change: number;
  imageUrl: string;
}

export interface RWAAssetMotoko {
  id : string;
  owner : string;
  metadata : {
    name : string;
    type : string;
    value : number
    description : string;
    image : string;
  }
};


