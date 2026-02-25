"use client"

import { motion } from "framer-motion"

type StaggerTextProps = {
  text: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  className?: string
  staggerDelay?: number
  once?: boolean
}

const containerVariants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: {
      staggerChildren: staggerDelay,
    },
  }),
}

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
}

export function StaggerText({
  text,
  as: Tag = "h1",
  className,
  staggerDelay = 0.08,
  once = true,
}: StaggerTextProps) {
  const words = text.split(" ")

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        className="inline"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.5 }}
        custom={staggerDelay}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.25em]"
            variants={wordVariants}
            aria-hidden="true"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  )
}
