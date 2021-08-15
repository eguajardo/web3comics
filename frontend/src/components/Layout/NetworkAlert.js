import { contracts } from "../../helpers/contracts";
import { useEthers, getChainName } from "@usedapp/core";
import { useEffect, useState } from "react";

function NetworkAlert() {
  const { chainId } = useEthers();
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    if (!chainId) {
      return null;
    }
    const chainName =
      getChainName(chainId).toLowerCase() === "hardhat"
        ? "localhost"
        : getChainName(chainId).toLowerCase();
    console.log("chainName:", chainName);

    if (!contracts[chainName]) {
      setNetworkError(true);
    } else {
      setNetworkError(false);
    }
  }, [chainId]);

  return (
    <div>
      {networkError && (
        <div className="alert alert-danger top-alert text-center" role="alert">
          {`Unsupported chain, make sure you are connected to the supported network ${Object.keys(
            contracts
          )}`}
        </div>
      )}
    </div>
  );
}

export default NetworkAlert;
