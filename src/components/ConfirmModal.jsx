import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  LoaderCircle,
  Trash2,
  X,
} from 'lucide-react'

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">

          {/* BACKDROP */}
          <motion.button
            type="button"
            aria-label="Cerrar confirmación"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!loading) {
                onClose()
              }
            }}
            className="absolute inset-0 cursor-default bg-[#02040b]/90 backdrop-blur-md"
          />

          {/* MODAL */}
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
            className="relative z-10 w-full max-w-[450px] overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#090e1d] shadow-[0_30px_100px_rgba(0,0,0,.75)]"
          >
            {/* GLOW */}
            <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-red-500/[0.09] blur-[100px]" />

            <div className="relative p-6 md:p-7">

              {/* CERRAR */}
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={loading}
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-600 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={16} />
                </button>
              </div>

              {/* ICONO */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-red-300/15 bg-red-400/[0.07]">
                <AlertTriangle
                  size={28}
                  strokeWidth={1.8}
                  className="text-red-300"
                />
              </div>

              {/* TEXTO */}
              <div className="mt-5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-300/70">
                  Acción irreversible
                </p>

                <h2 className="mt-3 text-xl font-bold tracking-tight text-white">
                  {title}
                </h2>

                <p className="mx-auto mt-3 max-w-[350px] text-sm leading-6 text-slate-400">
                  {message}
                </p>
              </div>

              {/* ADVERTENCIA */}
              <div className="mt-6 rounded-xl border border-red-300/[0.07] bg-red-400/[0.025] px-4 py-3">
                <div className="flex items-start gap-3">
                  <Trash2
                    size={15}
                    className="mt-0.5 shrink-0 text-red-300/70"
                  />

                  <p className="text-xs leading-5 text-slate-600">
                    Una vez confirmada esta acción, el registro
                    será eliminado permanentemente de SocialHub.
                  </p>
                </div>
              </div>

              {/* BOTONES */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={onClose}
                  className="flex h-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {cancelText}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={onConfirm}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-300/10 bg-red-400/[0.1] px-4 text-sm font-semibold text-red-300 transition hover:border-red-300/20 hover:bg-red-400/[0.16] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={15}
                        className="animate-spin"
                      />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 size={15} />
                      {confirmText}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal