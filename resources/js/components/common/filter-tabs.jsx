"use client"

import { Button } from "@/components/ui/button"

export default function FilterTabs({ active, topics, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((item) => (
        <Button
          key={item.value}
          size="sm"
          variant={active === item.value ? "default" : "outline"}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  )
}
