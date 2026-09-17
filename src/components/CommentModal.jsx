import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  MessageCircle,
  Save,
  Send,
  UserRound,
  X,
} from 'lucide-react'

function CommentModal({
  open,
  onClose,
  onSubmit,
  saving = false,
  initialData = null,
}) {
  const [form, setForm] = useState({
    username: '',
    review: '',
  })

  const [errors, setErrors] = useState({})

  // Si recibimos initialData estamos editando.
  const editing = Boolean(initialData)

  // =========================================================
  // CARGAR / REINICIAR FORMULARIO
  // =========================================================
  useEffect(() => {
    if (!open) return

    if (initialData) {
      setForm({
        username: initialData.username ?? '',
        review: initialData.review ?? '',
      })
    } else {
      setForm({
        username: '',
        review: '',
      })
    }

    setErrors({})
  }, [open, initialData])

  // =========================================================
  // CERRAR CON ESC
  // =========================================================
  useEffect(() => {
    if (!open) return

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !saving) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose, saving])

  // =========================================================
  // CAMBIOS
  // =========================================================
  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
  }

  // =========================================================
  // VALIDACIONES
  // =========================================================
  const validate = () => {
    const newErrors = {}

    const username = form.username.trim()
    const review = form.review.trim()

    if (!username) {
      newErrors.username =
        'El nombre de usuario es obligatorio.'
    } else if (username.length < 2) {
      newErrors.username =
        'El nombre debe tener al menos 2 caracteres.'
    } else if (username.length > 80) {
      newErrors.username =
        'El nombre no puede superar los 80 caracteres.'
    }

    if (!review) {
      newErrors.review =
        'El comentario es obligatorio.'
    } else if (review.length < 2) {
      newErrors.review =
        'El comentario debe tener al menos 2 caracteres.'
    } else if (review.length > 500) {
      newErrors.review =
        'El comentario no puede superar los 500 caracteres.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // =========================================================
  // ENVIAR
  // =========================================================
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    await onSubmit({
      username: form.username.trim(),
      review: form.review.trim(),
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">

          {/* BACKDROP */}
          <motion.button
            type="button"
            aria-label="Cerrar modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!saving) {
                onClose()
              }
            }}
            className="absolute inset-0 cursor-default bg-[#02040b]/85 backdrop-blur-md"
          />

          {/* MODAL */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 12,
            }}
            transition={{
              duration: 0.22,
            }}
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#090e1d] shadow-[0_30px_100px_rgba(0,0,0,.7)]"
          >
            {/* DECORACIÓN */}
            <div
              className={`pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full ${
                editing
                  ? 'bg-cyan-500/[0.09]'
                  : 'bg-violet-500/[0.09]'
              } blur-[100px]`}
            />

            <div className="pointer-events-none absolute -left-24 bottom-[-130px] h-64 w-64 rounded-full bg-cyan-400/[0.06] blur-[100px]" />

            <form
              onSubmit={handleSubmit}
              className="relative"
            >
              {/* HEADER */}
              <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                      editing
                        ? 'border-cyan-300/10 bg-cyan-400/[0.07]'
                        : 'border-violet-300/10 bg-violet-400/[0.07]'
                    }`}
                  >
                    {editing ? (
                      <Save
                        size={19}
                        className="text-cyan-300"
                      />
                    ) : (
                      <MessageCircle
                        size={19}
                        className="text-violet-300"
                      />
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-[9px] font-semibold uppercase tracking-[0.28em] ${
                        editing
                          ? 'text-cyan-300'
                          : 'text-violet-300'
                      }`}
                    >
                      {editing
                        ? 'Comment Management'
                        : 'Community Discussion'}
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-white">
                      {editing
                        ? 'Editar comentario'
                        : 'Nuevo comentario'}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-600 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={16} />
                </button>
              </div>

              {/* BODY */}
              <div className="space-y-5 p-6">

                {/* USUARIO */}
                <div>
                  <label
                    htmlFor="comment-username"
                    className="mb-2 block text-xs font-medium text-slate-400"
                  >
                    Nombre de usuario
                  </label>

                  <div className="relative">
                    <UserRound
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      id="comment-username"
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      disabled={saving}
                      maxLength={80}
                      autoComplete="off"
                      placeholder="Ej. Antonio"
                      className={`h-12 w-full rounded-xl border bg-black/[0.12] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 ${
                        errors.username
                          ? 'border-red-400/40 focus:border-red-400/60'
                          : 'border-white/[0.07] focus:border-violet-300/30'
                      }`}
                    />
                  </div>

                  {errors.username && (
                    <p className="mt-2 text-xs text-red-300">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* COMENTARIO */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="comment-review"
                      className="text-xs font-medium text-slate-400"
                    >
                      Comentario
                    </label>

                    <span className="text-[10px] text-slate-700">
                      {form.review.length}/500
                    </span>
                  </div>

                  <textarea
                    id="comment-review"
                    name="review"
                    value={form.review}
                    onChange={handleChange}
                    disabled={saving}
                    maxLength={500}
                    rows={6}
                    placeholder="Comparte tu opinión con la comunidad..."
                    className={`w-full resize-none rounded-xl border bg-black/[0.12] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 ${
                      errors.review
                        ? 'border-red-400/40 focus:border-red-400/60'
                        : 'border-white/[0.07] focus:border-violet-300/30'
                    }`}
                  />

                  {errors.review && (
                    <p className="mt-2 text-xs text-red-300">
                      {errors.review}
                    </p>
                  )}
                </div>

                {/* INFORMACIÓN */}
                <div className="rounded-xl border border-cyan-300/[0.07] bg-cyan-300/[0.025] px-4 py-3">
                  <p className="text-xs leading-5 text-slate-600">
                    {editing
                      ? 'Los cambios se guardarán en este comentario sin modificar su relación con la publicación.'
                      : 'El comentario quedará asociado a esta publicación y actualizará automáticamente su contador de interacciones.'}
                  </p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] px-6 py-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={onClose}
                  className="h-11 rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-300 to-cyan-300 px-5 text-sm font-bold text-[#04101a] shadow-[0_10px_30px_rgba(139,92,246,.12)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#04101a]/20 border-t-[#04101a]" />

                      {editing
                        ? 'Guardando...'
                        : 'Publicando...'}
                    </>
                  ) : editing ? (
                    <>
                      <Save size={15} />
                      Guardar cambios
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Publicar comentario
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CommentModal