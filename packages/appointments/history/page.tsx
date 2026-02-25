import { HeroHeader } from "@repo/components/header";
import { AppointmentHistoryList } from "@repo/components/historial/appointments/appointment-history-list";

export default function AppointmentHistoryPagePackage() {
  return (
    <>
      <HeroHeader />

      <main className="pt-8 relative min-h-screen bg-[#faf8f3] text-neutral-700">
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-24">

          {/* Encabezado */}
          <header className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-[#c6a365]">
              Historial de citas
            </h1>
            <p className="mt-4 text-sm text-neutral-600">
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