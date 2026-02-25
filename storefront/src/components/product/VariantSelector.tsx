"use client"

import { cn } from "@/lib/utils"

type Option = {
  id: string
  title: string
  values: { id: string; value: string }[]
}

type VariantSelectorProps = {
  options: Option[]
  selected: Record<string, string>
  onChange: (optionTitle: string, value: string) => void
}

const COLOR_MAP: Record<string, string> = {
  "Berkeley Blue": "bg-[#003262]",
  "California Gold": "bg-[#FDB515]",
  White: "bg-white border-charcoal/20",
  Black: "bg-charcoal",
}

export function VariantSelector({
  options,
  selected,
  onChange,
}: VariantSelectorProps) {
  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id}>
          <label className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/60 mb-3 block">
            {option.title}
            {selected[option.title] && (
              <span className="ml-2 text-charcoal normal-case tracking-normal">
                — {selected[option.title]}
              </span>
            )}
          </label>

          <div className="flex flex-wrap gap-2">
            {option.values.map((val) => {
              const isColor = option.title === "Color"
              const isActive = selected[option.title] === val.value
              const colorClass = COLOR_MAP[val.value]

              if (isColor && colorClass) {
                return (
                  <button
                    key={val.id}
                    onClick={() => onChange(option.title, val.value)}
                    className={cn(
                      "w-10 h-10 border-2 transition-all duration-200",
                      colorClass,
                      isActive
                        ? "border-berkeley-blue ring-2 ring-berkeley-blue/20 ring-offset-2"
                        : "border-transparent hover:border-charcoal/30"
                    )}
                    title={val.value}
                  />
                )
              }

              return (
                <button
                  key={val.id}
                  onClick={() => onChange(option.title, val.value)}
                  className={cn(
                    "min-w-[3rem] px-4 py-2.5 text-xs font-body tracking-[0.15em] uppercase border transition-all duration-200",
                    isActive
                      ? "bg-berkeley-blue text-off-white border-berkeley-blue"
                      : "bg-transparent text-charcoal/70 border-charcoal/15 hover:border-berkeley-blue hover:text-berkeley-blue"
                  )}
                >
                  {val.value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
