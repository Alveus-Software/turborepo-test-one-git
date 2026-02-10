"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAvailableAppointment } from "@repo/lib/actions/appointment.actions";
import { AppointmentForm } from "@repo/components/dashboard/citas/appointment-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateAppointmentPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleCreate(values: {
    appointment_datetime: string;
    notes: string;
  }) {
    setLoading(true);
    setServerError(null);

    const result = await createAvailableAppointment(values);

    setLoading(false);

    if (!result.success) {
      toast.error(result.message ?? "No se pudo crear el espacio disponible");
      setServerError(result.message ?? "Error inesperado");
      return;
    }

    toast.success("Espacio disponible creado correctamente");
    router.push("/dashboard/citas/gestion");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/dashboard/citas/gestion"
        className="inline-flex items-center text-custom-text-tertiary hover:text-custom-accent-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
      </Link>

      <h1 className="text-2xl font-bold text-custom-text-primary">
        Crear espacio disponible
      </h1>

      <AppointmentForm
        onSubmit={handleCreate}
        loading={loading}
        serverError={serverError}
      />
    </div>
  );
}