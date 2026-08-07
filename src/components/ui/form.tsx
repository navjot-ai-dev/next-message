import { useState } from "react"

export function Form() {
  const [value, setValue] = useState("")

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}