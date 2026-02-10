import { HeroHeader } from "@/components/header";
import { AppointmentHistoryList } from "@/components/historial/appointments/appointment-history-list";

export default function AppointmentHistoryPage() {
  return (
    <>
      <HeroHeader />

      <main className="pt-8 relative min-h-screen bg-custom-bg-primary text-custom-text-primary">
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-24">

          {/* Encabezado */}
          <header className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-medium text-custom-text-primary">
              Historial de citas
            </h1>
            <p className="mt-4 text-sm text-custom-text-secondary">
              Aquí puedes consultar todas las citas que has realizado
            </p>
          </header>

          {/* Contenido */}
          <AppointmentHistoryList />

        </section>
      </main>
    </>
  );
}
