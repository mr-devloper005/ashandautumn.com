'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle, UserRound } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(() => [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Search', href: '/search' },
  ], [])

  return (
    <header className="sticky top-0 z-50 text-[var(--editable-nav-text)] shadow-[0_8px_22px_rgba(27,50,18,0.12)]">
      <nav className="mx-auto flex min-h-[84px] w-full items-center gap-5 bg-[var(--editable-nav-bg)] px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-var(--editable-container))/2))]">
        <Link href="/" className="group flex shrink-0 items-center gap-3 pr-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f1e4] ring-2 ring-white/50 transition group-hover:scale-105">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="editable-display block max-w-[230px] truncate text-2xl font-black italic leading-none text-[#2d241f]">{SITE_CONFIG.name}</span>
          </span>
        </Link>

        <div className="hidden items-stretch gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center rounded-sm px-4 text-sm font-black uppercase transition ${
                  active ? 'bg-[#2f651b] text-white' : 'text-[#1e2b1c] hover:bg-white/22 hover:text-[#0f170d]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <form action="/search" className="mx-auto hidden min-w-0 flex-1 justify-center md:flex">
          <label className="flex w-full max-w-sm items-center gap-2 rounded-sm bg-white/88 px-4 py-2 shadow-inner transition focus-within:bg-white">
            <Search className="h-4 w-4 shrink-0 text-[#2f651b]" />
            <input
              name="q"
              type="search"
              placeholder="Search articles and businesses"
              className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[#607258]"
            />
          </label>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-sm bg-[#2f651b] px-4 py-2 text-xs font-black uppercase text-white transition hover:brightness-110 sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Create
              </Link>
              <span className="hidden max-w-[150px] items-center gap-2 truncate rounded-sm bg-white/80 px-3 py-2 text-xs font-black text-[#193414] sm:inline-flex">
                <UserRound className="h-3.5 w-3.5" /> {session.name || 'Member'}
              </span>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 px-3 py-2 text-xs font-black uppercase text-[#193414] transition hover:text-white sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 px-3 py-2 text-xs font-black uppercase text-[#193414] transition hover:text-white sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-sm bg-[#2f651b] px-4 py-2 text-xs font-black uppercase text-white transition hover:brightness-110 sm:inline-flex"
              >
                <UserPlus className="h-3.5 w-3.5" /> Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[#6e9660] bg-[var(--editable-nav-bg)] px-4 py-5 lg:hidden">
          <form action="/search" className="mb-5 flex items-center gap-2 border-b border-[var(--slot4-accent)]/30 pb-2">
            <Search className="h-4 w-4 text-[var(--slot4-accent)]" />
            <input name="q" type="search" placeholder="Search articles and businesses" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[#607258]" />
          </form>
          {session ? <p className="mb-3 rounded-sm bg-white/75 px-4 py-3 text-sm font-black">Signed in as {session.name || 'Member'}</p> : null}
          <div className="grid gap-1">
            {[...navItems, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border-l-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                    active
                      ? 'border-[var(--slot4-accent)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-accent)]'
                      : 'border-transparent text-[var(--slot4-muted-text)] hover:border-[var(--slot4-accent)]/40 hover:bg-[var(--slot4-surface-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? <button type="button" onClick={() => { logout(); setOpen(false) }} className="border-l-2 border-transparent px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-[#193414] hover:bg-white/60">Logout</button> : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
