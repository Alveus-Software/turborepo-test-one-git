"use client";

import { useEffect, useState } from "react";

export type AppointmentFormValues = {
  appointment_datetime: string; 
  notes: string;
};

type Props = {
  initialValues?: Partial<AppointmentFormValues>;
  loading?: boolean;
  serverError?: string | null;
  onSubmit: (values: AppointmentFormValues) => void;
};

export function AppointmentForm({
  initialValues = {},
  serverError = null,
  loading = false,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<AppointmentFormValues>({
    appointment_datetime: initialValues.appointment_datetime || "",
    notes: initialValues.notes || "",
  });

  const [localDateTime, setLocalDateTime] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicializar localDateTime si hay un valor inicial
  useEffect(() => {
    if (initialValues.appointment_datetime) {
      try {
        // Convertir UTC a fecha local para mostrar en el input
        const utcDate = new Date(initialValues.appointment_datetime);
        const localDateString = formatDateForInput(utcDate);
        setLocalDateTime(localDateString);
      } catch (error) {
        console.error("Error inicializando fecha:", error);
      }
    }
  }, [initialValues.appointment_datetime]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "appointment_datetime") {
      // Guardar la fecha local para mostrar
      setLocalDateTime(value);
      
      // Convertir a UTC inmediatamente y guardar en values
      try {
        if (value) {
          // 1. Crear fecha desde el input local
          const localDate = new Date(value);
          
          // 2. Convertir a UTC ISO string
          const utcISOString = localDate.toISOString();
          
          // 3. Actualizar values con la UTC
          setValues(prev => ({ ...prev, appointment_datetime: utcISOString }));
          } else {
          setValues(prev => ({ ...prev, appointment_datetime: "" }));
        }
      } catch (error) {
        console.error("Error convirtiendo fecha:", error);
      }
    } else {
      setValues(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.appointment_datetime) {
      next.appointment_datetime = "La fecha y hora del espacio es obligatoria";
    } else {
      const selectedDate = new Date(values.appointment_datetime);
      const now = new Date();
      if (selectedDate <= now) {
        next.appointment_datetime = "Debe ser una fecha y hora futura";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Asegurar que tenemos UTC antes de enviar
    if (localDateTime && !values.appointment_datetime) {
      try {
        const localDate = new Date(localDateTime);
        const utcISOString = localDate.toISOString();
        setValues(prev => ({ ...prev, appointment_datetime: utcISOString }));
      } catch (error) {
        console.error("Error final convirtiendo fecha:", error);
        setErrors(prev => ({ 
          ...prev, 
          appointment_datetime: "Fecha inválida" 
        }));
        return;
      }
    }
    
    if (!validate()) return;
    
    onSubmit(values);
  };

  // Función para formatear fecha al formato del input
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Calcular fechas mínima y máxima
  const today = new Date();
  const minDate = formatDateForInput(today);
  
  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateString = formatDateForInput(maxDate);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-custom-bg-secondary border border-custom-border-secondary rounded-lg p-4 md:p-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-custom-text-secondary">
          Fecha y hora de la cita disponible *
        </label>
        
        <div className="relative">
          <input
            type="datetime-local"
            name="appointment_datetime"
            value={localDateTime}  
            onChange={handleChange}
            min={minDate}
            max={maxDateString}
            className="w-full bg-custom-bg-tertiary border border-custom-border-primary rounded-lg px-4 py-4 text-custom-text-primary text-base md:text-sm md:py-3 focus:outline-none focus:ring-2 focus:ring-custom-accent-primary/50 focus:border-custom-accent-primary/50 transition-all appearance-none"
            style={{ WebkitAppearance: 'none', minHeight: '56px' }}
          />
          
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-6 h-6 text-custom-text-tertiary md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        {errors.appointment_datetime && (
          <p className="text-sm text-red-400 mt-2">{errors.appointment_datetime}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-custom-text-secondary">Notas</label>
        <textarea
          name="notes"
          rows={4}
          value={values.notes}
          onChange={handleChange}
          className="w-full bg-custom-bg-tertiary border border-custom-border-primary rounded-lg px-4 py-4 text-custom-text-primary text-base md:text-sm md:py-3 focus:outline-none focus:ring-2 focus:ring-custom-accent-primary/50 focus:border-custom-accent-primary/50 transition-all resize-none"
          placeholder="Notas internas sobre este espacio disponible..."
          style={{ minHeight: '120px' }}
        />
      </div>

      {serverError && (
        <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded">
          {serverError}
        </div>
      )}

      <div className="flex justify-end border-t border-custom-border-secondary pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-4 md:py-3 bg-custom-accent-primary hover:bg-custom-accent-secondary text-gray-900 rounded-lg font-medium text-base md:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
          style={{ minHeight: '56px' }}
        >
          {loading ? "Guardando..." : "Crear espacio disponible"}
        </button>
      </div>
    </form>
  );
}