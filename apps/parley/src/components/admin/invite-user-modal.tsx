'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { inviteUser } from '@/lib/actions/invite_user.actions'
import { UserPlus, Mail, Loader2 } from 'lucide-react'

export function InviteUserModal() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e:  React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Por favor ingresa un correo electrónico')
      return
    }

    setIsLoading(true)

    const result = await inviteUser(email.trim().toLowerCase())

    if (result.success) {
      toast.success(result.data?. message || 'Invitación enviada')
      setEmail('')
      setOpen(false)
    } else {
      toast.error(result.error || 'Error al enviar invitación')
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/*<Button className="flex items-center gap-2 bg-[#F6E7B8] text-[#3A2A00] hover:bg-[#EAD9A5] focus:ring-2 focus:ring-[#C9A23F] transition-colors">
          <UserPlus className="h-4 w-4" />
          Invitar Usuario
        </Button> */}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#FFF9F0] border border-[#E6DFD3] rounded-lg shadow-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#3C3A36]">
            <Mail className="h-5 w-5 text-[#8BB174]" />
            Invitar Nuevo Usuario
          </DialogTitle>
          <DialogDescription className="text-[#7C7769]">
            Ingresa el correo electrónico del usuario que deseas invitar. Recibirá un enlace para crear su cuenta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#3C3A36]">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
              className="bg-[#F5F1E8] border border-[#D1C7B7] placeholder-[#A49F94] text-[#3C3A36] focus:ring-2 focus:ring-[#C9A23F]"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
<Button
  type="button"
  variant="outline"
  onClick={() => setOpen(false)}
  disabled={isLoading}
  className="text-[#3A2A00] border border-[#D1C7B7] bg-[#F5F1E8] 
             hover:!bg-[#EAD9A5] hover:!text-[#3A2A00] 
             focus:ring-2 focus:ring-[#C9A23F] transition-colors"
>
  Cancelar
</Button>


            <Button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="flex items-center gap-2 bg-[#8BB174] text-white hover:bg-[#7AA063] focus:ring-2 focus:ring-[#6F9356] transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Enviar Invitación
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
