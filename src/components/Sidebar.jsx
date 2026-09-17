import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Newspaper,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react'

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    label: 'Publicaciones',
    icon: Newspaper,
    path: '/posts',
  },
]

function SidebarContent({ onNavigate }) {
  return (
    <>
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-violet-500/10 blur-[80px]" />

      {/* Logo */}
      <div className="relative flex items-center gap-3 px-2 py-3">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-violet-500/20">
          <Zap
            size={21}
            className="text-cyan-300"
            strokeWidth={2.3}
          />

          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#080c1a] bg-emerald-400" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold tracking-tight text-white">
              SocialHub
            </h1>

            <Sparkles
              size={13}
              className="text-violet-300"
            />
          </div>

          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
            Community Platform
          </p>
        </div>
      </div>

      {/* Estado */}
      <div className="relative mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Estado del sistema
          </span>

          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            Online
          </span>
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
        </div>
      </div>

      {/* Navegación */}
      <nav className="relative mt-7 flex-1">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
          Navegación
        </p>

        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <motion.div
                key={item.label}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
              >
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-3.5 py-3 text-left text-sm font-medium transition ${
                      isActive
                        ? 'border-cyan-300/10 bg-gradient-to-r from-cyan-400/[0.12] to-violet-500/[0.06] text-white'
                        : 'border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]" />
                      )}

                      <Icon
                        size={18}
                        className={
                          isActive
                            ? 'text-cyan-300'
                            : 'text-slate-500'
                        }
                      />

                      <span>{item.label}</span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            )
          })}
        </div>
      </nav>

      {/* Perfil */}
      <div className="relative border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white/[0.035]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
            <Users
              size={18}
              className="text-violet-300"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-200">
              Administrador
            </p>

            <p className="truncate text-xs text-slate-500">
              SocialHub Workspace
            </p>
          </div>

          <div className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
      </div>
    </>
  )
}

function Sidebar({ mobileOpen = false, onMobileClose = () => {} }) {
  return (
    <>
      {/* Sidebar escritorio */}
      <aside className="fixed bottom-4 left-4 top-4 z-40 hidden w-[260px] flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#080c1a]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl lg:flex">
        <SidebarContent />
      </aside>

      {/* Sidebar móvil */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              onClick={onMobileClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 32,
              }}
              className="fixed bottom-3 left-3 top-3 z-[60] flex w-[min(300px,calc(100vw-24px))] flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#080c1a]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-2xl lg:hidden"
            >
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Cerrar menú de navegación"
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                <X size={18} />
              </button>

              <SidebarContent onNavigate={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar