"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, ArrowLeft, User, LogIn, UserPlus } from "lucide-react";
import { Button } from "@repo/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ConfirmationStepProps {
  appointmentDetails: {
    slotId: string;
    dateTime: Date;
    professional?: {
      name?: string;
      email?: string;
    } | null;
  };
  clientInfo: {
    full_name: string;
    email: string;
    phone: string;
  };
  user: any;
  onBack: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  professionalCode?: string;
  hasTempData?: boolean;
}

export default function ConfirmationStep({ 
  appointmentDetails, 
  clientInfo, 
  user, 
  onBack, 
  onConfirm,
  isLoading = false,
  professionalCode,
  hasTempData = false
}: ConfirmationStepProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();

  // Verificar si hay datos temporales cuando el componente se monta
  useEffect(() => {
    if (hasTempData && !user) {
      // TOAST CON COLORES CONSISTENTES
      toast.info("Tienes una reserva pendiente. Inicia sesión para confirmarla.", {
        style: {
          backgroundColor: '#e8f4fd', 
          border: '1px solid #bbdefb',
          color: '#1565c0', 
        },
        icon: <AlertCircle className="w-5 h-5 text-[#1565c0]" />,
      });
    }
  }, [hasTempData, user]);

  const handleConfirm = async () => {
    if (!user) {
      // Esto no debería pasar ahora porque el botón de confirmar está oculto
      // TOAST DE ERROR CON COLORES CONSISTENTES
      toast.error("Debes iniciar sesión para confirmar la cita", {
        style: {
          backgroundColor: '#fdeaea', 
          border: '1px solid #ffcdd2',
          color: '#c62828',
        },
        icon: <AlertCircle className="w-5 h-5 text-[#c62828]" />,
      });
      return;
    }

    setIsConfirming(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error al confirmar:", error);
      toast.error("Error al confirmar la cita", {
        style: {
          backgroundColor: '#fdeaea',
          border: '1px solid #ffcdd2', 
          color: '#c62828', 
        },
        icon: <AlertCircle className="w-5 h-5 text-[#c62828]" />,
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#f5efe6] p-6 shadow-sm">
      {/* Título - Cambia según si hay usuario o no */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            user ? "bg-[#e8f5e8]" : "bg-[#e8f4fd]"
          }`}>
            {user ? (
              <CheckCircle className="w-6 h-6 text-[#2e7d32]" />
            ) : (
              <User className="w-6 h-6 text-[#1565c0]" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-serif font-semibold text-neutral-900">
              {user ? "¡Último paso!" : "¡Ya casi terminas!"}
            </h2>
            <p className="text-neutral-600 mt-1">
              {user 
                ? "Confirma tu reserva para completar el proceso"
                : "Solo necesitas crear una cuenta o iniciar sesión para confirmar tu cita"}
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          user 
            ? "bg-[#e8f4fd] border-[#bbdefb]" 
            : "bg-[#f5efe6] border-[#e6dcc9]"
        }`}>
          <p className={`text-sm flex items-center gap-2 ${
            user ? "text-[#1565c0]" : "text-[#c6a365]"
          }`}>
            <AlertCircle className="w-4 h-4" />
            {user 
              ? "Revisa que todos los datos en el panel de resumen sean correctos antes de confirmar."
              : `Tu cita con ${clientInfo.full_name} está lista. Los datos se guardarán automáticamente.`}
          </p>
        </div>
      </div>

      {/* Contenido principal - Cambia según si hay usuario o no */}
      <div className="space-y-6">
        {!user ? (
          // Vista para usuarios NO autenticados
          <div className="space-y-6">

            {/* PANEL */}
            <div className="bg-[#f5efe6] border-[#e6dcc9] border rounded-lg p-5">
              <h4 className="text-lg font-serif font-semibold text-[#a48349] mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Elige cómo continuar
              </h4>
              <p className="text-sm text-[#c6a365] mb-6">
                Para proteger tu reserva y que puedas gestionarla después, necesitas una cuenta.
                Es rápido y seguro.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Botón de Iniciar Sesión - actualizado a colores de tu paleta */}
                <Button 
                  onClick={() => {
                    // Guardar datos actuales antes de redirigir
                    const tempData = {
                      slotId: appointmentDetails.slotId,
                      clientInfo,
                      profesionalCode: professionalCode,
                      dateTime: appointmentDetails.dateTime.toISOString(),
                      timestamp: new Date().toISOString(),
                    };
                    localStorage.setItem('temp_appointment', JSON.stringify(tempData));
                    localStorage.setItem('pending_appointment', "true");
                    
                    router.push(`/auth/login?redirect=/cliente-cita/${professionalCode}&from_appointment=true`);
                  }}
                  variant="outline"
                  className="w-full border-[#c6a365] text-[#a48349] hover:bg-[#f5efe6] hover:text-[#b59555] hover:border-[#b59555] h-12 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Ya tengo cuenta
                </Button>

                {/* Botón de Registrarse - actualizado a colores de tu paleta */}
                <Button 
                  onClick={() => {
                    // Guardar datos actuales antes de redirigir
                    const tempData = {
                      slotId: appointmentDetails.slotId,
                      clientInfo,
                      profesionalCode: professionalCode,
                      dateTime: appointmentDetails.dateTime.toISOString(),
                      timestamp: new Date().toISOString(),
                    };
                    localStorage.setItem('temp_appointment', JSON.stringify(tempData));
                    localStorage.setItem('pending_appointment', "true");
                    
                    router.push(`/auth/sign-up?redirect=/cliente-cita/${professionalCode}&from_appointment=true`);
                  }}
                  className="w-full bg-[#c6a365] hover:bg-[#b59555] text-white h-12 transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Crear cuenta nueva
                </Button>
              </div>

              <p className="text-xs text-[#a48349] mt-4 text-center">
                Al crear una cuenta aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        ) : (
          // Vista para usuarios autenticados
          <>
            {/* Información importante simplificada */}
            <div className="bg-[#f5efe6] border border-[#e6dcc9] rounded-lg p-4">
              <h4 className="text-sm font-semibold text-[#c6a365] mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Información importante
              </h4>
              <ul className="space-y-2 text-sm text-[#c6a365]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#c6a365] mt-0.5 flex-shrink-0" />
                  <span>Recibirás un correo de confirmación en <strong>{clientInfo.email}</strong></span>
                </li>
                {hasTempData && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#c6a365] mt-0.5 flex-shrink-0" />
                    <span>Usando los datos de tu reserva temporal</span>
                  </li>
                )}
              </ul>
            </div>
          </>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3 pt-6">
          {/* Botón "Volver para revisar" - SIEMPRE visible */}
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 border-[#e6dcc9] text-neutral-700 hover:bg-[#f5efe6] hover:text-neutral-900"
            disabled={isConfirming || isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver para revisar
          </Button>
          
          {/* Botón "Confirmar Reserva" - SOLO visible si hay usuario autenticado */}
          {user && (
            <Button
              onClick={handleConfirm}
              disabled={isConfirming || isLoading}
              className="flex-1 bg-[#2e7d32] hover:bg-[#1b5e20] text-white shadow-sm hover:shadow-md transition-shadow"
            >
              {isConfirming || isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar Reserva
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}