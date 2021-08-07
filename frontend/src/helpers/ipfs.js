import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { NFTStorage } from "nft.storage";

// IMPORTANT: This token will be public and visible to anyone which is
// a major security risk. It's done this way just for test purposes
// and finish the hackathon on time to avoid having server-side code
export const web3storage = new Web3Storage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGVlZERFNzg2YTg1OTAwNTE3YzAxMzI5NjBiQzViMEI0NTUyMjA0NTEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MjgyODM2NzU2NTYsIm5hbWUiOiJ3ZWIzY29taWNzLXVuc2FmZS10b2tlbiJ9.fETAvyzLAvGhNK3tPCCEcYdVCRuPCiDSd2W5HPbUrwI",
});

// IMPORTANT: This token will be public and visible to anyone which is
// a major security risk. It's done this way just for test purposes
// and finish the hackathon on time to avoid having server-side code
export const nftStorage = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgyN2QyMkRFMEJFOGYzZDhDNzkxRkY2NWMzOEZkQTEyRjYxQzQ0NDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyODI4OTkyNzUzOSwibmFtZSI6IndlYjNjb21pY3MtdW5zYWZlLWtleSJ9.SdvDfo2Uq6H6j1CrX1EdyTqpo7KboJp1tj67IgUidZY",
});
