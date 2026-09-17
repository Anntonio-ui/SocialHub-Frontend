import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  CalendarDays,
  FileText,
  Loader2,
  Save,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import AlertModal from './AlertModal'

function PostModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    postDate: '',
  })

  const [errors, setErrors] = useState({})

  const [alert, setAlert] = useState({
    open: false,
    title: '',
    message: '',
    type: 'warning',
  })

  // =========================================================
  // CARGAR DATOS AL ABRIR
  // =========================================================
  useEffect(() => {
    if (!open) return

    if (initialData) {
      setForm({
        title: initialData.title ?? '',
        content: initialData.content ?? '',
        postDate: initialData.postDate ?? '',
      })
    } else {
      setForm({
        title: '',
        content: '',
        postDate: '',
      })
    }

    setErrors({})

    setAlert({
      open: false,
      title: '',
      message: '',
      type: 'warning',
    })
  }, [open, initialData])

  // =========================================================
  // ACTUALIZAR CAMPOS
  // =========================================================
  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: '',
      }))
    }
  }

  // =========================================================
  // OBTENER FECHA LOCAL DE HOY yyyy-MM-dd
  // =========================================================
  const getTodayLocal = () => {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // =========================================================
  // VALIDACIONES FRONTEND
  // =========================================================
  const validateForm = () => {
    const newErrors = {}

    const title = form.title.trim()
    const content = form.content.trim()

    if (!title) {
      newErrors.title = 'El título es obligatorio.'
    } else if (title.length < 3) {
      newErrors.title =
        'El título debe tener al menos 3 caracteres.'
    } else if (title.length > 150) {
      newErrors.title =
        'El título no puede superar los 150 caracteres.'
    }

    if (!content) {
      newErrors.content = 'El contenido es obligatorio.'
    } else if (content.length < 5) {
      newErrors.content =
        'El contenido debe tener al menos 5 caracteres.'
    } else if (content.length > 2000) {
      newErrors.content =
        'El contenido no puede superar los 2000 caracteres.'
    }

    if (!form.postDate) {
      newErrors.postDate =
        'La fecha de publicación es obligatoria.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // =========================================================
  // ENVIAR FORMULARIO
  // =========================================================
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    const today = getTodayLocal()

    // Fecha pasada
    if (form.postDate < today) {
      setAlert({
        open: true,
        title: 'Fecha no válida',
        message:
          'La fecha de publicación no puede estar en el pasado. Selecciona la fecha actual o una fecha futura.',
        type: 'warning',
      })

      return
    }

    await onSubmit({
      title: form.title.trim(),
      content: form.content.trim(),
      postDate: form.postDate,
    })
  }

  // =========================================================
  // CERRAR CON ESC
  // =========================================================
  useEffect(() => {
    if (!open) return undefined

    const handleEscape = (event) => {
      if (
        event.key === 'Escape' &&
        !loading &&
        !alert.open
      ) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open, loading, alert.open, onClose])

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            {/* Fondo */}
            <motion.button
              type="button"
              aria-label="Cerrar modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!loading && !alert.open) {
                  onClose()
                }
              }}
              className="absolute inset-0 cursor-default bg-[#02040b]/80 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 16,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
                y: 10,
              }}
              transition={{
                duration: 0.22,
              }}
              className="relative z-10 w-full max-w-[650px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#090e1d] shadow-[0_30px_100px_rgba(0,0,0,.65)]"
            >
              {/* Decoración */}
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/[0.08] blur-[100px]" />

              <div className="pointer-events-none absolute -left-24 bottom-[-150px] h-72 w-72 rounded-full bg-violet-500/[0.07] blur-[110px]" />

              {/* Header */}
              <div className="relative flex items-start justify-between border-b border-white/[0.07] px-6 py-6 md:px-7">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.07]">
                      <FileText
                        size={15}
                        className="text-cyan-300"
                      />
                    </span>

                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
                      Content Studio
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                    {initialData
                      ? 'Editar publicación'
                      : 'Nueva publicación'}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {initialData
                      ? 'Actualiza la información de la publicación.'
                      : 'Comparte nuevo contenido con tu comunidad.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-500 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Formulario */}
              <form
                onSubmit={handleSubmit}
                className="relative px-6 py-6 md:px-7"
              >
                <div className="space-y-5">

                  {/* Título */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="post-title"
                        className="text-xs font-semibold text-slate-300"
                      >
                        Título
                      </label>

                      <span className="text-[10px] text-slate-600">
                        {form.title.length}/150
                      </span>
                    </div>

                    <input
                      id="post-title"
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      maxLength={150}
                      disabled={loading}
                      placeholder="Ej. Introducción a Spring Boot"
                      className={`h-12 w-full rounded-2xl border bg-black/10 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 disabled:opacity-50 ${
                        errors.title
                          ? 'border-red-400/30 focus:border-red-400/50'
                          : 'border-white/[0.07] focus:border-cyan-300/25 focus:bg-cyan-300/[0.02]'
                      }`}
                    />

                    {errors.title && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-red-300">
                        <AlertCircle size={13} />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Contenido */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="post-content"
                        className="text-xs font-semibold text-slate-300"
                      >
                        Contenido
                      </label>

                      <span className="text-[10px] text-slate-600">
                        {form.content.length}/2000
                      </span>
                    </div>

                    <textarea
                      id="post-content"
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      maxLength={2000}
                      disabled={loading}
                      rows={6}
                      placeholder="Escribe el contenido de tu publicación..."
                      className={`w-full resize-none rounded-2xl border bg-black/10 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 disabled:opacity-50 ${
                        errors.content
                          ? 'border-red-400/30 focus:border-red-400/50'
                          : 'border-white/[0.07] focus:border-cyan-300/25 focus:bg-cyan-300/[0.02]'
                      }`}
                    />

                    {errors.content && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-red-300">
                        <AlertCircle size={13} />
                        {errors.content}
                      </p>
                    )}
                  </div>

                  {/* Fecha */}
                  <div>
                    <label
                      htmlFor="post-date"
                      className="mb-2 block text-xs font-semibold text-slate-300"
                    >
                      Fecha de publicación
                    </label>

                    <div className="relative">
                      <CalendarDays
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                      />

                      <input
                        id="post-date"
                        type="date"
                        name="postDate"
                        value={form.postDate}
                        onChange={handleChange}
                        disabled={loading}
                        className={`h-12 w-full rounded-2xl border bg-black/10 pl-11 pr-4 text-sm text-slate-300 outline-none transition disabled:opacity-50 ${
                          errors.postDate
                            ? 'border-red-400/30 focus:border-red-400/50'
                            : 'border-white/[0.07] focus:border-violet-300/25'
                        }`}
                      />
                    </div>

                    {errors.postDate && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-red-300">
                        <AlertCircle size={13} />
                        {errors.postDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="h-11 rounded-xl border border-white/[0.07] bg-white/[0.035] px-5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-5 text-sm font-bold text-[#04101a] shadow-[0_10px_30px_rgba(34,211,238,.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(34,211,238,.2)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={16} />

                        {initialData
                          ? 'Guardar cambios'
                          : 'Publicar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================
          MODAL DE ADVERTENCIA
      ===================================================== */}
      <AlertModal
        open={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttonText="Entendido"
        onClose={() =>
          setAlert((current) => ({
            ...current,
            open: false,
          }))
        }
      />
    </>
  )
}

export default PostModal