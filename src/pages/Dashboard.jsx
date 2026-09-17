import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  MessageCircle,
  Newspaper,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import api from '../services/api'

function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(false)

      const response = await api.get('/dashboard')
      setDashboard(response.data)
    } catch (err) {
      console.error('Error cargando dashboard:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-cyan-300" />

          <p className="mt-5 text-sm font-medium text-slate-300">
            Sincronizando SocialHub
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Obteniendo métricas de la comunidad...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <div className="max-w-md rounded-[28px] border border-red-400/10 bg-red-400/[0.04] p-8 text-center">
          <Activity className="mx-auto text-red-300" size={32} />

          <h2 className="mt-5 text-xl font-semibold text-white">
            No pudimos conectar con SocialHub
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Verifica que el servidor Spring Boot se encuentre disponible.
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.1]"
          >
            <RefreshCw size={15} />
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const mostCommented = dashboard?.mostCommentedPost
  const mostInteractive = dashboard?.mostInteractivePost
  const latestPosts = dashboard?.latestPosts ?? []

  const metrics = [
    {
      label: 'Publicaciones',
      value: dashboard?.totalPosts ?? 0,
      icon: Newspaper,
      description: 'Contenido publicado',
      accent: 'cyan',
    },
    {
      label: 'Comentarios',
      value: dashboard?.totalComments ?? 0,
      icon: MessageCircle,
      description: 'Conversaciones activas',
      accent: 'violet',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="pb-8"
    >
      {/* Header */}
      <header className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.025] px-6 py-7 md:px-8 md:py-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-[90px]" />
        <div className="pointer-events-none absolute right-48 top-[-140px] h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-[100px]" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.07]">
                <Sparkles size={13} className="text-cyan-300" />
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Community Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">
              Bienvenido a{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                SocialHub
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Una vista completa de las publicaciones, conversaciones e
              interacción de tu comunidad.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/[0.07] bg-black/10 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                Estado
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
                <span className="text-xs font-semibold text-emerald-300">
                  API conectada
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              title="Actualizar Dashboard"
              className="flex h-[54px] w-[54px] items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-slate-400 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-cyan-300"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* Métricas */}
      <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon

          return (
            <motion.article
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-5"
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-[60px] ${
                  metric.accent === 'cyan'
                    ? 'bg-cyan-400/10'
                    : 'bg-violet-500/10'
                }`}
              />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {metric.label}
                  </p>

                  <p className="mt-3 text-4xl font-bold tracking-tight text-white">
                    {metric.value}
                  </p>

                  <p className="mt-2 text-xs text-slate-600">
                    {metric.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                    metric.accent === 'cyan'
                      ? 'border-cyan-300/10 bg-cyan-300/[0.07] text-cyan-300'
                      : 'border-violet-300/10 bg-violet-400/[0.07] text-violet-300'
                  }`}
                >
                  <Icon size={19} />
                </div>
              </div>
            </motion.article>
          )
        })}

        {/* Más comentada */}
        <article className="relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-5">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-[60px]" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Más comentada
              </p>

              <TrendingUp size={18} className="text-blue-300" />
            </div>

            <p className="mt-4 truncate text-base font-semibold text-white">
              {mostCommented?.title ?? 'Sin publicaciones'}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <MessageCircle size={14} />

              <span>
                {mostCommented?.commentCount ?? 0} comentarios
              </span>
            </div>
          </div>
        </article>

        {/* Mayor interacción */}
        <article className="relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.07] to-cyan-400/[0.035] p-5">
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Mayor interacción
              </p>

              <Activity size={18} className="text-violet-300" />
            </div>

            <p className="mt-4 truncate text-base font-semibold text-white">
              {mostInteractive?.title ?? 'Sin publicaciones'}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <Sparkles size={14} />

              <span>
                {mostInteractive?.commentCount ?? 0} interacciones
              </span>
            </div>
          </div>
        </article>
      </section>

      {/* Contenido inferior */}
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">

        {/* Últimas publicaciones */}
        <article className="rounded-[28px] border border-white/[0.07] bg-white/[0.025] p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Live Feed
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Últimas publicaciones
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
              <Newspaper size={17} className="text-slate-400" />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {latestPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.08] px-5 py-10 text-center">
                <Newspaper
                  size={25}
                  className="mx-auto text-slate-700"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Todavía no existen publicaciones.
                </p>
              </div>
            ) : (
              latestPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + index * 0.06 }}
                  className="group flex items-center gap-4 rounded-2xl border border-transparent bg-white/[0.025] p-4 transition hover:border-white/[0.07] hover:bg-white/[0.045]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.055] text-sm font-bold text-cyan-300">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-200">
                      {post.title}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={12} />
                        {post.postDate}
                      </span>

                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} />
                        {post.commentCount ?? 0}
                      </span>
                    </div>
                  </div>

                  <ArrowUpRight
                    size={16}
                    className="text-slate-700 transition group-hover:text-cyan-300"
                  />
                </motion.div>
              ))
            )}
          </div>
        </article>

        {/* Community Pulse */}
        <article className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#080d1c]/70 p-6">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-500/10 blur-[90px]" />
          <div className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-cyan-400/[0.07] blur-[90px]" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/10 bg-emerald-300/[0.05] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live
            </span>

            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-slate-600">
              Community Pulse
            </p>

            <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
              Tu comunidad está
              <span className="block bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                conectada.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Las métricas se sincronizan directamente con SocialHub API.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-2xl font-bold text-white">
                  {dashboard?.totalPosts ?? 0}
                </p>
                <p className="mt-1 text-[11px] text-slate-600">
                  Posts
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-2xl font-bold text-white">
                  {dashboard?.totalComments ?? 0}
                </p>
                <p className="mt-1 text-[11px] text-slate-600">
                  Comments
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </motion.div>
  )
}

export default Dashboard