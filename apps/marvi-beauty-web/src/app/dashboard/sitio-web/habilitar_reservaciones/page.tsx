"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, CheckCircle, XCircle, Save, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Switch } from "@repo/ui/switch";
import { Label } from "@repo/ui/label";
import { toggleReservations, areReservationsEnabled } from "@repo/lib/actions/configuration.actions";
import { getUserWithPermissions } from "@repo/lib/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@repo/lib/supabase/client";

import ReservasConfigPagePackage from "@repo/dashboard/sitio-web/habilitar_reservaciones/page"

export default function ReservasConfigPage() {
  return (
    <ReservasConfigPagePackage/>
  )
}