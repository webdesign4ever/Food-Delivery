import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "./button"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"

interface MultiSelectOption {
    label: string
    value: string
}

interface MultiSelectProps {
    options: MultiSelectOption[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    className?: string
    disabledOptions?: string[]
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange, placeholder, className, disabledOptions = [] }) => {

    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const isPlaceholder = selected.length === 0

    const handleItemClick = (value: string) => {
        if (disabledOptions.includes(value)) return // Prevent selection if disabled
        const updated = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value]
        onChange(updated)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button ref={buttonRef} variant="outline"
                    className={cn(
                        "w-full justify-start font-normal",
                        isPlaceholder ? "text-muted-foreground" : "text-foreground",
                        className
                    )}
                >
                    <span className="truncate text-left w-full">
                        {selected.length > 0
                            ? options.filter(opt => selected.includes(opt.value)).map(opt => opt.label).join(", ")
                            : placeholder}
                    </span>
                    {open ? (
                        <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    ) : (
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="max-h-64 overflow-y-auto p-2" style={{ width: buttonRef.current?.offsetWidth || undefined, }}>
                {options.map((option) => {
                    const isChecked = selected.includes(option.value)
                    const isDisabled = disabledOptions.includes(option.value)
                    return (
                        <div
                            key={option.value}
                            className={cn(
                                "flex items-center space-x-2 py-1 px-1 rounded hover:bg-accent",
                                isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            )}
                            onClick={() => handleItemClick(option.value)}
                        >
                            <Checkbox
                                checked={isChecked}
                                disabled={isDisabled}
                                onClick={(e) => e.stopPropagation()} // prevent double toggle
                                onCheckedChange={() => handleItemClick(option.value)}
                            />
                            <span className="text-sm font-normal">{option.label}</span>
                        </div>
                    )
                })}
            </PopoverContent>
        </Popover >
    )
}
