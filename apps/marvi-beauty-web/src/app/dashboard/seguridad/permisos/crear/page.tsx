'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getModulesHierarchy } from '@repo/lib/actions/module.actions'
import { createPermission } from '@repo/lib/actions/permission.actions';
import { type ModuleWithChildren, type NewPermissionPayload } from '@repo/lib/utils/definitions';
import { toast } from 'sonner';
import PermissionForm from '@repo/components/dashboard/permisos/permission-form';

import CreatePermissionPagePackage from "@repo/dashboard/seguridad/permisos/crear/page"

export default function CreatePermissionPage() {
  return (
    <CreatePermissionPagePackage/>
  )
}