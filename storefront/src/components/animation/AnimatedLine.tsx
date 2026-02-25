"use client"

import { motion } from "framer-motion"

type AnimatedLineProps = {
  className?: string
  delay?: number
}

export function AnimatedLine({ className, delay = 0 }: AnimatedLineProps) {
  return (
    <div className={className}>
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-california-gold/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay,
        }}
        style={{ transformOrigin: "center" }}
      />
    </div>
  )
}
