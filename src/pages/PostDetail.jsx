import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  MessageCircle,
  MessageSquarePlus,
  Pencil,
  RefreshCw,
  Trash2,
  UserRound,
} from 'lucide-react'

import api from '../services/api'
import CommentModal from '../components/CommentModal'
import AlertModal from '../components/AlertModal'
import ConfirmModal from '../components/ConfirmModal'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [commentModalOpen, setCommentModalOpen] =
    useState(false)

  const [savingComment, setSavingComment] =
    useState(false)

  const [selectedComment, setSelectedComment] =
    useState(null)

  const [commentToDelete, setCommentToDelete] =
    useState(null)

  const [deletingComment, setDeletingComment] =
    useState(false)

  const [alert, setAlert] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info',
  })

  // =========================================================
  // CARGAR PUBLICACIÓN + COMENTARIOS
  // =========================================================
  const loadPostDetail = useCallback(async () => {
    try {
      setLoading(true)
      setError(false)

      const [postResponse, commentsResponse] =
        await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ])

      setPost(postResponse.data)
      setComments(commentsResponse.data)
    } catch (err) {
      console.error(
        'Error cargando detalle de publicación:',
        err,
      )

      setError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadPostDetail()
  }, [loadPostDetail])

  // =========================================================
  // ABRIR CREAR COMENTARIO
  // =========================================================
  const openCreateComment = () => {
    setSelectedComment(null)
    setCommentModalOpen(true)
  }

  // =========================================================
  // ABRIR EDITAR COMENTARIO
  // =========================================================
  const openEditComment = (comment) => {
    setSelectedComment(comment)
    setCommentModalOpen(true)
  }

  // =========================================================
  // CERRAR MODAL COMENTARIO
  // =========================================================
  const closeCommentModal = () => {
    if (savingComment) {
      return
    }

    setCommentModalOpen(false)
    setSelectedComment(null)
  }

  // =========================================================
  // CREAR COMENTARIO
  // =========================================================
  const createComment = async (formData) => {
    try {
      setSavingComment(true)

      await api.post(
        `/posts/${id}/comments`,
        formData,
      )

      const [postResponse, commentsResponse] =
        await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ])

      setPost(postResponse.data)
      setComments(commentsResponse.data)

      setCommentModalOpen(false)
      setSelectedComment(null)

      setAlert({
        open: true,
        title: 'Comentario publicado',
        message:
          'Tu comentario fue agregado correctamente a la publicación.',
        type: 'success',
      })
    } catch (err) {
      console.error(
        'Error creando comentario:',
        err,
      )

      const backendMessage =
        err.response?.data?.message ||
        'No fue posible publicar el comentario.'

      setAlert({
        open: true,
        title: 'No se pudo publicar',
        message: backendMessage,
        type: 'error',
      })
    } finally {
      setSavingComment(false)
    }
  }

  // =========================================================
  // EDITAR COMENTARIO
  // =========================================================
  const updateComment = async (formData) => {
    if (!selectedComment) {
      return
    }

    try {
      setSavingComment(true)

      await api.put(
        `/posts/${id}/comments/${selectedComment.id}`,
        formData,
      )

      const [postResponse, commentsResponse] =
        await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ])

      setPost(postResponse.data)
      setComments(commentsResponse.data)

      setCommentModalOpen(false)
      setSelectedComment(null)

      setAlert({
        open: true,
        title: 'Comentario actualizado',
        message:
          'Los cambios fueron guardados correctamente.',
        type: 'success',
      })
    } catch (err) {
      console.error(
        'Error actualizando comentario:',
        err,
      )

      const backendMessage =
        err.response?.data?.message ||
        'No fue posible actualizar el comentario.'

      setAlert({
        open: true,
        title: 'No se pudo actualizar',
        message: backendMessage,
        type: 'error',
      })
    } finally {
      setSavingComment(false)
    }
  }

  // =========================================================
  // SOLICITAR ELIMINAR COMENTARIO
  // =========================================================
  const openDeleteComment = (comment) => {
    setCommentToDelete(comment)
  }

  // =========================================================
  // CERRAR CONFIRMACIÓN
  // =========================================================
  const closeDeleteComment = () => {
    if (deletingComment) {
      return
    }

    setCommentToDelete(null)
  }

  // =========================================================
  // ELIMINAR COMENTARIO
  // =========================================================
  const deleteComment = async () => {
    if (!commentToDelete) {
      return
    }

    try {
      setDeletingComment(true)

      await api.delete(
        `/posts/${id}/comments/${commentToDelete.id}`,
      )

      const [postResponse, commentsResponse] =
        await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ])

      setPost(postResponse.data)
      setComments(commentsResponse.data)

      setCommentToDelete(null)

      setAlert({
        open: true,
        title: 'Comentario eliminado',
        message:
          'El comentario fue eliminado correctamente de la publicación.',
        type: 'success',
      })
    } catch (err) {
      console.error(
        'Error eliminando comentario:',
        err,
      )

      const backendMessage =
        err.response?.data?.message ||
        'No fue posible eliminar el comentario.'

      setCommentToDelete(null)

      setAlert({
        open: true,
        title: 'No se pudo eliminar',
        message: backendMessage,
        type: 'error',
      })
    } finally {
      setDeletingComment(false)
    }
  }

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="flex min-h-[650px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-2 border-white/10 border-t-cyan-300" />

          <p className="mt-4 text-sm text-slate-400">
            Cargando publicación...
          </p>
        </div>
      </div>
    )
  }

  // =========================================================
  // ERROR
  // =========================================================
  if (error || !post) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[650px] items-center justify-center"
      >
        <div className="w-full max-w-lg rounded-[28px] border border-red-400/10 bg-red-400/[0.025] p-8 text-center">
          <FileText
            size={34}
            className="mx-auto text-red-300"
          />

          <h1 className="mt-5 text-xl font-bold text-white">
            No fue posible cargar la publicación
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            La publicación puede no existir o el servidor
            no se encuentra disponible.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06]"
            >
              Volver
            </button>

            <button
              type="button"
              onClick={loadPostDetail}
              className="flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-bold text-[#04101a]"
            >
              <RefreshCw size={15} />
              Reintentar
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pb-8"
      >
        {/* NAVEGACIÓN */}
        <button
          type="button"
          onClick={() => navigate('/posts')}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:border-cyan-300/10 hover:bg-white/[0.05] hover:text-white"
        >
          <ArrowLeft size={15} />
          Volver a publicaciones
        </button>

        {/* PUBLICACIÓN */}
        <article className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.025]">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-cyan-400/[0.07] blur-[110px]" />

          <div className="pointer-events-none absolute left-[40%] top-[-180px] h-72 w-72 rounded-full bg-violet-500/[0.06] blur-[110px]" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-lg border border-cyan-300/10 bg-cyan-300/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Post #{post.id}
              </span>

              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays size={14} />
                {post.postDate}
              </span>

              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <MessageCircle size={14} />
                {post.commentCount ?? comments.length}{' '}
                comentarios
              </span>
            </div>

            <h1 className="mt-7 max-w-4xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white md:text-4xl">
              {post.title}
            </h1>

            <p className="mt-6 max-w-5xl whitespace-pre-wrap text-[15px] leading-8 text-slate-400">
              {post.content}
            </p>
          </div>
        </article>

        {/* COMENTARIOS */}
        <section className="mt-5 overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.025]">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
            <div>
              <div className="flex items-center gap-2">
                <MessageCircle
                  size={16}
                  className="text-violet-300"
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-300">
                  Community Discussion
                </span>
              </div>

              <h2 className="mt-2 text-xl font-bold text-white">
                Comentarios
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 text-xs font-semibold text-slate-400">
                {comments.length}{' '}
                {comments.length === 1
                  ? 'comentario'
                  : 'comentarios'}
              </span>

              <button
                type="button"
                onClick={openCreateComment}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-300 to-cyan-300 px-4 text-xs font-bold text-[#04101a] shadow-[0_10px_25px_rgba(139,92,246,.1)] transition hover:-translate-y-0.5"
              >
                <MessageSquarePlus size={15} />
                Nuevo comentario
              </button>
            </div>
          </div>

          {/* LISTA */}
          <div className="p-5 md:p-7">
            {comments.length === 0 ? (
              <div className="flex min-h-[230px] items-center justify-center rounded-[24px] border border-dashed border-white/[0.08] bg-black/[0.06]">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025]">
                    <MessageCircle
                      size={23}
                      className="text-slate-700"
                    />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-300">
                    Aún no hay comentarios
                  </h3>

                  <p className="mt-2 text-xs text-slate-600">
                    Sé el primero en participar en la conversación.
                  </p>

                  <button
                    type="button"
                    onClick={openCreateComment}
                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-violet-300/10 bg-violet-300/[0.06] px-4 text-xs font-semibold text-violet-300 transition hover:bg-violet-300/[0.1]"
                  >
                    <MessageSquarePlus size={14} />
                    Escribir comentario
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment, index) => (
                  <motion.article
                    key={comment.id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    className="group rounded-[22px] border border-white/[0.06] bg-black/[0.08] p-5 transition hover:border-violet-300/10 hover:bg-white/[0.025]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/[0.07]">
                        <UserRound
                          size={17}
                          className="text-violet-300"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-200">
                              {comment.username}
                            </p>

                            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-700">
                              Comentario #{comment.id}
                            </p>
                          </div>

                          {/* ACCIONES */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditComment(comment)
                              }
                              title="Editar comentario"
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-slate-600 transition hover:border-cyan-300/15 hover:bg-cyan-300/[0.06] hover:text-cyan-300"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openDeleteComment(comment)
                              }
                              title="Eliminar comentario"
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-slate-600 transition hover:border-red-300/15 hover:bg-red-400/[0.06] hover:text-red-300"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-500">
                          {comment.review}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </motion.div>

      {/* CREAR / EDITAR */}
      <CommentModal
        open={commentModalOpen}
        onClose={closeCommentModal}
        onSubmit={
          selectedComment
            ? updateComment
            : createComment
        }
        saving={savingComment}
        initialData={selectedComment}
      />

      {/* CONFIRMAR ELIMINACIÓN */}
      <ConfirmModal
        open={Boolean(commentToDelete)}
        onClose={closeDeleteComment}
        onConfirm={deleteComment}
        loading={deletingComment}
        title="¿Eliminar comentario?"
        message={
          commentToDelete
            ? `El comentario de ${commentToDelete.username} será eliminado permanentemente.`
            : ''
        }
        confirmText="Eliminar comentario"
      />

      {/* AVISOS */}
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

export default PostDetail