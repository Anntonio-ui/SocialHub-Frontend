import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from 'lucide-react'

function AlertModal({
  open,
  onClose,
  title = 'Aviso',
  message = '',
  type = 'warning',
  buttonText = 'Entendido',
}) {
  const variants = {
    warning: {
      icon: AlertTriangle,
      iconClass: 'text-amber-300',
      iconBackground: 'bg-amber-300/[0.08]',
      iconBorder: 'border-amber-300/15',
      glow: 'bg-amber-400/[0.08]',
    },

    error: {
      icon: XCircle,
      iconClass: 'text-red-300',
      iconBackground: 'bg-red-300/[0.08]',
      iconBorder: 'border-red-300/15',
      glow: 'bg-red-400/[0.08]',
    },

    success: {
      icon: CheckCircle2,
      iconClass: 'text-emerald-300',
      iconBackground: 'bg-emerald-300/[0.08]',
      iconBorder: 'border-emerald-300/15',
      glow: 'bg-emerald-400/[0.08]',
    },

    info: {
      icon: Info,
      iconClass: 'text-cyan-300',
      iconBackground: 'bg-cyan-300/[0.08]',
      iconBorder: 'border-cyan-300/15',
      glow: 'bg-cyan-400/[0.08]',
    },
  }

  const currentVariant =
    variants[type] ?? variants.warning

  const Icon = currentVariant.icon

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">

          {/* Fondo */}
          <motion.button
            type="button"
            aria-label="Cerrar aviso"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#02040b]/85 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 18,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            transition={{
              duration: 0.22,
            }}
            role="alertdialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#090e1d] shadow-[0_30px_100px_rgba(0,0,0,.7)]"
          >
            {/* Glow */}
            <div
              className={`pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full ${currentVariant.glow} blur-[90px]`}
            />

            <div className="relative p-6 md:p-7">

              {/* Cerrar */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-600 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Icono */}
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border ${currentVariant.iconBorder} ${currentVariant.iconBackground}`}
              >
                <Icon
                  size={28}
                  strokeWidth={1.8}
                  className={currentVariant.iconClass}
                />
              </div>

              {/* Texto */}
              <div className="mt-5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-600">
                  SocialHub
                </p>

                <h2 className="mt-3 text-xl font-bold tracking-tight text-white">
                  {title}
                </h2>

                <p className="mx-auto mt-3 max-w-[340px] text-sm leading-6 text-slate-400">
                  {message}
                </p>
              </div>

              {/* Botón */}
              <button
                type="button"
                onClick={onClose}
                autoFocus
                className="mt-7 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-5 text-sm font-bold text-[#04101a] shadow-[0_10px_30px_rgba(34,211,238,.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(34,211,238,.2)]"
              >
                {buttonText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AlertModal