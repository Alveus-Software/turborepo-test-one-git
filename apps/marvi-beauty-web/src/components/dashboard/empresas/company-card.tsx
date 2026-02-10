"use client";

import { useState } from "react";
import type { Company } from "@repo/lib/actions/company.actions";
import {
  MapPin,
  Phone,
  Globe,
  MoreVertical,
  Calendar,
  Edit,
  Trash2,
  Smartphone,
  Users,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/popover";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";

interface CompanyCardProps {
  company: Company;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
  userPermissions?: string[];
}

export default function CompanyCard({
  company,
  onEdit,
  onDelete,
  userPermissions = [],
}: CompanyCardProps) {
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const canUpdate = userPermissions.includes("update:empresas");
  const canDelete = userPermissions.includes("delete:empresas");

  const handleCardClick = () => {
    // Podrías redirigir a una vista detallada de la plataforma si lo deseas
    // router.push(`/platforms/${platform.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPopoverOpen(false);
    router.push(`/dashboard/empresas-padre/empresas/editar/${company.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPopoverOpen(false);
    if (onDelete) onDelete(company);
  };

  const handlePopoverTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Función para formatear dirección
  const formatAddress = () => {
    const parts = [];
    if (company.street) parts.push(company.street);
    if (company.address_number) parts.push(company.address_number);
    if (company.colony) parts.push(company.colony);
    
    const address = parts.join(', ');
    const locationParts = [];
    if (company.city) locationParts.push(company.city);
    if (company.state) locationParts.push(company.state);
    if (company.zip_code) locationParts.push(company.zip_code);
    
    const location = locationParts.join(', ');
    
    return { address, location };
  };

  const { address, location } = formatAddress();

  // Determinar si es empresa padre (tiene empresas hijas)
  const childCompanies = company.child_companies || [];
  const isParentCompany = childCompanies.length > 0;

  return (
    <div
      className="bg-[#0A0F17] border border-gray-800 rounded-lg hover:shadow-lg hover:shadow-yellow-400/5 hover:border-yellow-400/30 transition-all cursor-pointer overflow-hidden relative"
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white line-clamp-2 mb-3">
              {company.name}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {company.rfc && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  RFC: {company.rfc}
                </span>
              )}
              
              {isParentCompany ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                  Empresa Padre
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                  Empresa Individual
                </span>
              )}
            </div>

            {/* Mostrar empresas hijas si es empresa padre */}
            {isParentCompany && (
              <div className="flex items-start gap-1 mb-3 text-sm text-gray-400">
                <Users className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-green-400">
                    Sucursales ({childCompanies.length}):
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {childCompanies.slice(0, 3).map((child) => (
                      <span
                        key={child.id}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-800/50 text-gray-300 border border-gray-700"
                      >
                        {child.name}
                        {child.rfc && <span className="ml-1 text-gray-500">({child.rfc})</span>}
                      </span>
                    ))}
                    {childCompanies.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-800/50 text-gray-400 border border-gray-700">
                        +{childCompanies.length - 3} más...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions Popover */}
          {(canUpdate || canDelete) && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className="p-2 hover:bg-yellow-400/10 rounded-lg transition-colors border border-gray-700 flex-shrink-0 ml-2"
                  onClick={handlePopoverTriggerClick}
                >
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-40 p-3 bg-[#0A0F17] border border-gray-700 rounded-lg shadow-lg"
                align="end"
              >
                <div className="space-y-1">
                  {canUpdate && (
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:bg-yellow-400/10 hover:text-yellow-400 rounded-md transition-colors"
                      onClick={handleEdit}
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                  )}

                  {canDelete && (
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-md transition-colors"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Información de la empresa */}
        <div className="space-y-3">
          {/* Dirección */}
          {(address || location) && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="text-gray-300">
                {address && <div className="line-clamp-1">{address}</div>}
                {location && <div className="text-xs text-gray-400 line-clamp-1">{location}</div>}
              </div>
            </div>
          )}

          {/* Teléfonos */}
          <div className="flex flex-wrap gap-4">
            {company.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-300">{company.phone}</span>
              </div>
            )}

            {company.cellphone && (
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-300">{company.cellphone}</span>
              </div>
            )}
          </div>

          {/* Website */}
          {company.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <a
                href={
                  company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 hover:underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>

        {/* Footer con fechas */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Creado: {new Date(company.created_at).toLocaleDateString("es-MX")}</span>
          </div>
          {company.updated_at !== company.created_at && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <Calendar className="w-3 h-3" />
              <span>Actualizado: {new Date(company.updated_at).toLocaleDateString("es-MX")}</span>
            </div>
          )}
        </div>

        {/* Botones de acción visibles (opcional - como alternativa al popover) */}
        {(canUpdate || canDelete) && (
          <div className="mt-4 pt-3 border-t border-gray-700 flex gap-2">
            {canUpdate && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex-1 bg-transparent border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
            )}
            {canDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                className="flex-1 bg-transparent border-red-400/30 text-red-400 hover:bg-red-400/10 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}