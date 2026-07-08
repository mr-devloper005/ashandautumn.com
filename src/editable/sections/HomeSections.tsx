import Link from 'next/link'
import { ArrowRight, BookOpen, ChevronRight, Search, ShieldCheck, Star, UsersRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function contentOf(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function clean(value?: string) {
  return (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function excerpt(post?: SitePost | null, limit = 150) {
  const content = contentOf(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    post?.summary ||
    ''
  const text = clean(raw)
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text
}

function category(post?: SitePost | null) {
  const content = contentOf(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function pool(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

function SectionHead({ title, href, light = false }: { title: string; href?: string; light?: boolean }) {
  return (
    <div className="flex items-end justify-between gap-5 border-b-2 border-[#2d342d] pb-3">
      <h2 className={`flex items-center gap-3 text-3xl font-black tracking-normal ${light ? 'text-white' : 'text-[#11140f]'}`}>
        <BookOpen className="h-7 w-7" /> {title}
      </h2>
      {href ? (
        <Link href={href} className={`inline-flex items-center gap-1 text-sm font-black ${light ? 'text-white' : 'text-[#20281f]'}`}>
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}

function FeaturedCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group block overflow-hidden rounded-lg border-2 border-[#465447] bg-white shadow-[0_10px_24px_rgba(44,65,36,0.12)]">
      <div className="relative aspect-[16/13] overflow-hidden bg-[#edf1ea]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="p-6 text-center">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#356b1f]">{category(post)}</p>
        <h3 className="mt-3 text-2xl font-black leading-tight text-[#303030]">{post.title}</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-[#586356]">{excerpt(post, 180)}</p>
      </div>
    </Link>
  )
}

function CompactCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group flex gap-4 rounded-lg border-2 border-[#465447] bg-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-28 w-32 shrink-0 overflow-hidden bg-[#edf1ea]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute bottom-0 left-0 bg-[#11140f] px-2 py-1 text-xs font-black text-white">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="min-w-0 py-1">
        <h3 className="line-clamp-2 text-lg font-black leading-tight">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[#667160]">{excerpt(post, 96)}</p>
      </div>
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group block overflow-hidden rounded-lg bg-white p-3 shadow-[0_8px_24px_rgba(44,65,36,0.14)] transition duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden bg-[#edf1ea]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      </div>
      <div className="p-4 text-center">
        <h3 className="line-clamp-2 text-xl font-black leading-tight">{post.title}</h3>
        <p className="mt-2 text-xs font-bold text-[#7b8575]">{category(post)}</p>
      </div>
    </Link>
  )
}

function EditorialListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid grid-cols-[48px_minmax(0,1fr)] gap-4 border-b border-[#b9c7b3] py-5">
      <span className="text-3xl font-black text-[#8fbc7d]">{String(index + 1).padStart(2, '0')}</span>
      <span>
        <span className="text-xs font-black uppercase tracking-[0.16em] text-[#356b1f]">{category(post)}</span>
        <span className="mt-1 block line-clamp-2 text-lg font-black leading-tight group-hover:text-[#356b1f]">{post.title}</span>
        <span className="mt-2 block line-clamp-2 text-sm font-semibold leading-6 text-[#667160]">{excerpt(post, 100)}</span>
      </span>
    </Link>
  )
}

function HorizontalBusinessCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group flex min-w-[320px] max-w-[420px] shrink-0 snap-start gap-4 rounded-lg border-2 border-[#465447] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#edf1ea]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-lg font-black leading-tight">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[#667160]">{excerpt(post, 90)}</p>
      </div>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = pool(posts, timeSections)
  const hero = all[0]
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Explore ${SITE_CONFIG.name}`

  return (
    <section className="leaf-wave bg-white">
      <div className={`relative z-10 grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center ${container}`}>
        <div>
          <h1 className="text-5xl font-black leading-[1.02] tracking-normal text-[#0d130c] sm:text-6xl">
            {heroTitle}
          </h1>
          <form action="/search" className="mt-8 flex max-w-xl overflow-hidden rounded-sm border-2 border-[#465447] bg-white shadow-[8px_8px_0_#dbead3]">
            <label className="flex min-w-0 flex-1 items-center gap-3 px-4">
              <Search className="h-5 w-5 text-[#356b1f]" />
              <input name="q" placeholder="Search articles, companies, topics" className="min-w-0 flex-1 bg-transparent py-4 text-sm font-bold outline-none placeholder:text-[#7c8976]" />
            </label>
            <button className="bg-[#2f651b] px-6 text-sm font-black text-white transition hover:brightness-110">Search</button>
          </form>
        </div>
        <div className="relative">
          {hero ? <FeaturedCard post={hero} href={postHref(primaryTask, hero, primaryRoute)} /> : null}
          <div className="absolute -bottom-5 -left-5 hidden rounded-sm bg-[#2f651b] px-5 py-4 text-sm font-black text-white shadow-xl sm:block">Updated reading and listing hub</div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = pool(posts, timeSections).slice(1, 11)
  if (!all.length) return null
  const feature = all[0]
  const side = all.slice(1, 5)
  const list = all.slice(5, 10)

  return (
    <section className="bg-[#e6efe2]">
      <div className={`py-16 ${container}`}>
        <SectionHead title="Featured" href={primaryRoute} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <FeaturedCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} />
          <div className="grid gap-4 sm:grid-cols-2">
            {side.map((post, index) => (
              <CompactCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>
        {list.length ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg bg-white p-6 shadow-[0_8px_24px_rgba(44,65,36,0.12)]">
              <h3 className="text-2xl font-black">Editor's List</h3>
              {list.map((post, index) => <EditorialListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
            <div className="leaf-wave rounded-lg bg-[#f8fbf4] p-8">
              <h3 className="max-w-xl text-3xl font-black leading-tight">A curated knowledge repository for value-based information exchange <BookOpen className="inline h-7 w-7" /></h3>
              <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-[#596756]">Read guides, compare businesses, and follow topics with a layout built for scanning, saving, and deeper reading.</p>
              <div className="mt-7 grid gap-5 sm:grid-cols-3">
                {[
                  ['Authoritative', ShieldCheck],
                  ['Useful', Star],
                  ['For everyone', UsersRound],
                ].map(([label, Icon]) => {
                  const TypedIcon = Icon as typeof ShieldCheck
                  return <div key={String(label)} className="relative z-10 font-black"><TypedIcon className="mb-2 h-8 w-8 text-[#465447]" />{String(label)}</div>
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = pool(posts, timeSections)
  const articleSet = all.slice(0, 8)
  const businessSet = all.slice(8, 18).length ? all.slice(8, 18) : all.slice(0, 10)
  const sliderPosts = [...businessSet, ...businessSet]
  if (!all.length) return null

  return (
    <>
      <section className="bg-white">
        <div className={`py-16 ${container}`}>
          <SectionHead title="Finance And Business" href={primaryRoute} />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {articleSet.map((post) => <ImageFirstCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
          </div>
        </div>
      </section>
      <section className="overflow-hidden bg-[#e6efe2]">
        <div className={`py-16 ${container}`}>
          <SectionHead title="Highlights" href="/listing" />
          <div className="mt-8 overflow-hidden">
            <div className="editable-auto-slider flex w-max gap-5">
              {sliderPosts.map((post, index) => <HorizontalBusinessCard key={`${post.id || post.slug}-${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-white">
      <div className={`grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center ${container}`}>
        <div>
          <h2 className="font-serif text-3xl font-black leading-tight text-[#356b1f] sm:text-4xl">Welcome to {SITE_CONFIG.name}!</h2>
          <p className="mt-5 max-w-xl text-2xl font-black leading-tight text-[#356b1f]">
            Share a guide, add a business, or publish useful information for readers who want clear answers.
          </p>
        </div>
        <div className="rounded-lg border-2 border-[#465447] bg-[#f8fbf4] p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <input aria-label="Name" placeholder="Name" className="rounded-full border border-[#c9d4c3] bg-white px-5 py-3 text-sm font-bold outline-none focus:border-[#356b1f]" />
            <input aria-label="Email" placeholder="Email" className="rounded-full border border-[#c9d4c3] bg-white px-5 py-3 text-sm font-bold outline-none focus:border-[#356b1f]" />
          </div>
          <Link href="/create" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#465447] px-6 py-3 text-sm font-black uppercase text-white transition hover:bg-[#2f651b]">
            Request access <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
