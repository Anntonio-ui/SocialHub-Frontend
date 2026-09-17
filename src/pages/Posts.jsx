import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import {
  CalendarDays,
  FileText,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import api from '../services/api'
import PostModal from '../components/PostModal'
import AlertModal from '../components/AlertModal'
import ConfirmModal from '../components/ConfirmModal'

function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [postToDelete, setPostToDelete] = useState(null)
  const [deletingPost, setDeletingPost] = useState(false)

  const [alert, setAlert] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info',
  })

  const navigate = useNavigate()

  // =========================================================
  // CARGAR PUBLICACIONES
  // =========================================================
  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(false)

      const response = await api.get('/posts')

      setPosts(response.data)
    } catch (err) {
      console.error('Error cargando publicaciones:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // BUSCAR PUBLICACIONES
  // =========================================================
  const searchPosts = async () => {
    try {
      setLoading(true)
      setError(false)

      const response = await api.get('/posts/search', {
        params: {
          query: search.trim(),
        },
      })

      setPosts(response.data)
    } catch (err) {
      console.error('Error buscando publicaciones:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // FILTRAR POR FECHA
  // =========================================================
  const filterPostsByDate = async () => {
    if (!date) {
      await loadPosts()
      return
    }

    try {
      setLoading(true)
      setError(false)

      const response = await api.get('/posts/filter', {
        params: {
          date,
        },
      })

      setPosts(response.data)
    } catch (err) {
      console.error('Error filtrando publicaciones:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // LIMPIAR FILTROS
  // =========================================================
  const resetFilters = async () => {
    setSearch('')
    setDate('')

    await loadPosts()
  }

  // =========================================================
  // CONVERTIR yyyy-MM-dd → dd/MM/yyyy
  // =========================================================
  const formatDateForApi = (value) => {
    if (!value) {
      return ''
    }

    const [year, month, day] = value.split('-')

    return `${day}/${month}/${year}`
  }

  // =========================================================
  // ABRIR MODAL CREAR
  // =========================================================
  const openCreatePost = () => {
    setSelectedPost(null)
    setModalOpen(true)
  }

  // =========================================================
  // ABRIR MODAL EDITAR
  // =========================================================
  const openEditPost = (post) => {
    setSelectedPost(post)
    setModalOpen(true)
  }

  // =========================================================
  // CERRAR MODAL
  // =========================================================
  const closePostModal = () => {
    if (saving) {
      return
    }

    setModalOpen(false)
    setSelectedPost(null)
  }

  // =========================================================
  // CREAR PUBLICACIÓN
  // =========================================================
  const createPost = async (formData) => {
    try {
      setSaving(true)

      const payload = {
        title: formData.title,
        content: formData.content,
        postDate: formatDateForApi(formData.postDate),
      }

      await api.post('/posts', payload)

      setModalOpen(false)
      setSelectedPost(null)
      setSearch('')
      setDate('')

      await loadPosts()

      setAlert({
        open: true,
        title: 'Publicación creada',
        message:
          'La publicación fue creada correctamente en SocialHub.',
        type: 'success',
      })
    } catch (err) {
      console.error('Error creando publicación:', err)

      const backendMessage =
        err.response?.data?.message ||
        'No fue posible crear la publicación.'

      setAlert({
        open: true,
        title: 'No se pudo crear',
        message: backendMessage,
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  // =========================================================
  // ACTUALIZAR PUBLICACIÓN
  // =========================================================
  const updatePost = async (formData) => {
    if (!selectedPost) {
      return
    }

    try {
      setSaving(true)

      const payload = {
        title: formData.title,
        content: formData.content,
        postDate: formatDateForApi(formData.postDate),
      }

      await api.put(
        `/posts/${selectedPost.id}`,
        payload,
      )

      setModalOpen(false)
      setSelectedPost(null)
      setSearch('')
      setDate('')

      await loadPosts()

      setAlert({
        open: true,
        title: 'Publicación actualizada',
        message:
          'Los cambios fueron guardados correctamente.',
        type: 'success',
      })
    } catch (err) {
      console.error(
        'Error actualizando publicación:',
        err,
      )

      const backendMessage =
        err.response?.data?.message ||
        'No fue posible actualizar la publicación.'

      setAlert({
        open: true,
        title: 'No se pudo actualizar',
        message: backendMessage,
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

// =========================================================
// SOLICITAR ELIMINAR PUBLICACIÓN
// =========================================================
const openDeletePost = (post) => {
  setPostToDelete(post)
}

// =========================================================
// CERRAR CONFIRMACIÓN
// =========================================================
const closeDeletePost = () => {
  if (deletingPost) {
    return
  }

  setPostToDelete(null)
}

// =========================================================
// ELIMINAR PUBLICACIÓN
// =========================================================
const deletePost = async () => {
  if (!postToDelete) {
    return
  }

  try {
    setDeletingPost(true)

    await api.delete(`/posts/${postToDelete.id}`)

    setPostToDelete(null)
    setSearch('')
    setDate('')

    await loadPosts()

    setAlert({
      open: true,
      title: 'Publicación eliminada',
      message:
        'La publicación y sus comentarios fueron eliminados correctamente.',
      type: 'success',
    })
  } catch (err) {
    console.error(
      'Error eliminando publicación:',
      err,
    )

    const backendMessage =
      err.response?.data?.message ||
      'No fue posible eliminar la publicación.'

    setPostToDelete(null)

    setAlert({
      open: true,
      title: 'No se pudo eliminar',
      message: backendMessage,
      type: 'error',
    })
  } finally {
    setDeletingPost(false)
  }
}

  // =========================================================
  // CARGA INICIAL
  // =========================================================
  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pb-8"
      >
        {/* =====================================================
            HEADER
        ===================================================== */}
        <header className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.025] px-6 py-7 md:px-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-[100px]" />

          <div className="pointer-events-none absolute right-40 top-[-150px] h-72 w-72 rounded-full bg-violet-500/[0.08] blur-[100px]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.07]">
                  <FileText
                    size={13}
                    className="text-cyan-300"
                  />
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  Content Management
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">
                Publicaciones
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Gestiona el contenido y las conversaciones de tu comunidad.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreatePost}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-3 text-sm font-bold text-[#04101a] shadow-[0_12px_35px_rgba(34,211,238,.12)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(34,211,238,.2)]"
            >
              <Plus
                size={17}
                strokeWidth={2.5}
              />

              Nueva publicación
            </button>
          </div>
        </header>

        {/* =====================================================
            BÚSQUEDA Y FILTROS
        ===================================================== */}
        <section className="mt-5 rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-4">
          <div className="flex flex-col gap-3 xl:flex-row">

            {/* BUSCADOR */}
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    searchPosts()
                  }
                }}
                placeholder="Buscar por título o contenido..."
                className="h-12 w-full rounded-2xl border border-white/[0.07] bg-black/10 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/20 focus:bg-cyan-300/[0.025]"
              />
            </div>

            {/* BUSCAR */}
            <button
              type="button"
              onClick={searchPosts}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.055] px-5 text-sm font-medium text-cyan-200 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.09]"
            >
              <Search size={16} />
              Buscar
            </button>

            {/* FECHA */}
            <div className="relative xl:w-[220px]">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="h-12 w-full rounded-2xl border border-white/[0.07] bg-black/10 pl-11 pr-4 text-sm text-slate-300 outline-none transition focus:border-violet-300/20"
              />
            </div>

            {/* FILTRAR */}
            <button
              type="button"
              onClick={filterPostsByDate}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-violet-300/10 bg-violet-300/[0.045] px-5 text-sm font-medium text-violet-200 transition hover:border-violet-300/20 hover:bg-violet-300/[0.08]"
            >
              <SlidersHorizontal size={16} />
              Filtrar
            </button>

            {/* LIMPIAR */}
            <button
              type="button"
              onClick={resetFilters}
              title="Limpiar filtros y actualizar publicaciones"
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-slate-500 transition hover:border-cyan-300/10 hover:bg-white/[0.055] hover:text-cyan-300 xl:w-12"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </section>

        {/* =====================================================
            CONTENIDO
        ===================================================== */}
        <section className="mt-5">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center rounded-[28px] border border-white/[0.07] bg-white/[0.02]">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-cyan-300" />

                <p className="mt-4 text-sm text-slate-400">
                  Cargando publicaciones...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[360px] items-center justify-center rounded-[28px] border border-red-400/10 bg-red-400/[0.025]">
              <div className="max-w-sm text-center">
                <FileText
                  size={30}
                  className="mx-auto text-red-300"
                />

                <h2 className="mt-4 text-lg font-semibold text-white">
                  No fue posible obtener las publicaciones
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Verifica que el servidor se encuentre disponible.
                </p>

                <button
                  type="button"
                  onClick={loadPosts}
                  className="mt-5 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08]"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center rounded-[28px] border border-dashed border-white/[0.08] bg-white/[0.01]">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025]">
                  <Search
                    size={24}
                    className="text-slate-700"
                  />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-300">
                  No se encontraron publicaciones
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Intenta cambiar los criterios de búsqueda.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Mostrar todas
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.06,
                  }}
                  className="group relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/[0.15] hover:bg-white/[0.04]"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-400/[0.05] blur-[60px]" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg border border-white/[0.06] bg-white/[0.035] px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-500">
                        POST #{post.id}
                      </span>

                      <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <MessageCircle size={13} />
                        {post.commentCount ?? 0}
                      </span>
                    </div>

                    <h2 className="mt-5 line-clamp-2 text-lg font-semibold leading-7 text-white">
                      {post.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 min-h-[66px] text-sm leading-[22px] text-slate-500">
                      {post.content}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <CalendarDays size={13} />
                        {post.postDate}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* EDITAR */}
                        <button
                          type="button"
                          onClick={() =>
                            openEditPost(post)
                          }
                          title="Editar publicación"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-slate-600 transition hover:border-violet-300/15 hover:bg-violet-300/[0.06] hover:text-violet-300"
                        >
                          <Pencil size={13} />
                        </button>
                        
                        <button
                        type="button"
                        onClick={() =>
                        openDeletePost(post)
                           }
                        title="Eliminar publicación"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-slate-600 transition hover:border-red-300/15 hover:bg-red-400/[0.06] hover:text-red-300"
                           >
                        <Trash2 size={13} />
                        </button>

                        {/* VER */}
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/posts/${post.id}`)
                          }
                          className="text-xs font-semibold text-cyan-300 transition group-hover:text-cyan-200"
                        >
                          Ver publicación →
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </motion.div>

      {/* =====================================================
          MODAL CREAR / EDITAR PUBLICACIÓN
      ===================================================== */}
      <PostModal
        open={modalOpen}
        onClose={closePostModal}
        onSubmit={
          selectedPost
            ? updatePost
            : createPost
        }
        initialData={selectedPost}
        loading={saving}
      />

      {/* =====================================================
          CONFIRMAR ELIMINACIÓN
      ===================================================== */}
      <ConfirmModal
        open={Boolean(postToDelete)}
        onClose={closeDeletePost}
        onConfirm={deletePost}
        loading={deletingPost}
        title="¿Eliminar publicación?"
        message={
          postToDelete
            ? `La publicación "${postToDelete.title}" y todos sus comentarios serán eliminados permanentemente.`
            : ''
        }
        confirmText="Eliminar publicación"
      />

      {/* =====================================================
          ALERTAS
      ===================================================== */}
      <AlertModal
        open={alert.open}
        onClose={() =>
          setAlert((current) => ({
            ...current,
            open: false,
          }))
        }
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </>
  )
}

export default Posts