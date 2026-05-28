import { ArrowUpRight } from 'lucide-react'

export default function GlowButton({
  href,
  children,
  variant = 'primary',
  icon = false,
  onClick,
  download,
}) {
  const cls = variant === 'secondary' ? 'btn-secondary' : 'btn-primary'

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        {...(download ? { download } : {})}
      >
        {children}
        {icon ? <ArrowUpRight className="h-4 w-4" /> : null}
      </a>
    )
  }

  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
      {icon ? <ArrowUpRight className="h-4 w-4" /> : null}
    </button>
  )
}
