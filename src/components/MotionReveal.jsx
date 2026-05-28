import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export default function MotionReveal({
  children,
  className,
  delay = 0,
  once = true,
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.18 }}
      transition={{ duration: 0.65, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
