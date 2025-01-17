import { FernRegistry } from "@fern-fern/registry";
import { PackagePath } from "../../commons/PackagePath";
import { ENDPOINTS_NAMESPACE } from "./constants";
import { usePackageItemPath } from "./usePackageItemPath";

export function useEndpointPath({
    environmentId,
    packagePath,
    endpointId,
}: {
    environmentId: FernRegistry.EnvironmentId;
    packagePath: PackagePath;
    endpointId: string;
}): string {
    return usePackageItemPath({ environmentId, packagePath, namespace: ENDPOINTS_NAMESPACE, itemName: endpointId });
}
