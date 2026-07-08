'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const footerLinks = [
    ['Home', '/'],
    ['About', '/about'],
    ['Contact', '/contact'],
    ['Search', '/search'],
    ...(session ? [['Create', '/create']] : [['Sign in', '/login'], ['Sign up', '/signup']]),
  ]

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 text-center sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center justify-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/65 ring-2 ring-white">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="editable-display text-3xl font-black italic tracking-[0.01em] text-[#2d241f]">{SITE_CONFIG.name}</span>
        </Link>

        <div className="mx-auto mt-7 h-px max-w-4xl bg-white/60" />

        <div className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {footerLinks.map(([label, href]) => (
            <Link key={href} href={href} className="inline-flex items-center gap-2 text-sm font-black text-[#356b1f] transition hover:text-[#142311]">
              {label} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ))}
          {session ? (
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 text-sm font-black text-[#356b1f] transition hover:text-[#142311]">
              Logout <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="bg-[#8fbc7d] px-4 py-5 text-center text-sm font-bold text-[#11300d]">
        © {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
