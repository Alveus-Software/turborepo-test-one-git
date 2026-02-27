import { getModuleWithChildren } from "@/lib/actions/module.actions";
import { getUserWithPermissions } from "@/lib/actions/user.actions";
import Link from "next/link";
import { getIcon } from "@repo/lib/utils/icons";
import { ArrowRight, FolderOpen } from "lucide-react";

import PlatformsParentPagePackage from "@repo/dashboard/platforms-parent/page"

export default async function PlatformsParentPage() {
  return(
    <PlatformsParentPagePackage/>
  )
}