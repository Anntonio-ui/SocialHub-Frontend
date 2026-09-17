import { useState } from 'react'
import { Menu, Zap } from 'lucide-react'
import Sidebar from '../components/Sidebar'

function MainLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050816]">

      {/* Fondo ambiental */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[18%] top-[-180px] h-[420px] w-[420px] rounded-full bg-cyan-400/[0.045] blur-[120px]" />

        <div className="absolute right-[-120px] top-[10%] h-[420px] w-[420px] rounded-full bg-violet-500/[0.055] blur-[130px]" />

        <div className="absolute bottom-[-200px] left-[45%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.04] blur-[140px]" />
      </div>

      {/* Grid decorativo */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)',
          backgroundSize: '55px 55px',
        }}
      />

      {/* Navegación escritorio + móvil */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Header móvil */}
      <header className="relative z-30 px-4 pt-4 lg:hidden">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between rounded-[22px] border border-white/[0.08] bg-[#080c1a]/90 px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-xl">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-violet-500/20">
              <Zap
                size={18}
                className="text-cyan-300"
                strokeWidth={2.3}
              />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                SocialHub
              </p>

              <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                Community Platform
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú de navegación"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-300 transition hover:border-cyan-300/20 hover:bg-cyan-400/[0.08] hover:text-cyan-300"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative min-h-screen px-4 py-4 sm:px-5 sm:py-5 lg:ml-[276px] lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          {children}
        </div>
      </main>

    </div>
  )
}

export default MainLayout