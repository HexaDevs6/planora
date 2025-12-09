import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = ({ children, type = "single", collapsible = true, className }) => {
  const [openItems, setOpenItems] = React.useState([])

  const toggleItem = (value) => {
    if (type === "single") {
      setOpenItems(openItems.includes(value) ? (collapsible ? [] : [value]) : [value])
    } else {
      setOpenItems(
        openItems.includes(value)
          ? openItems.filter(item => item !== value)
          : [...openItems, value]
      )
    }
  }

  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          isOpen: openItems.includes(child.props.value),
          onToggle: () => toggleItem(child.props.value),
        })
      )}
    </div>
  )
}

const AccordionItem = ({ className, children, value, isOpen, onToggle }) => (
  <div className={cn("border-b border-border", className)}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { isOpen, onToggle })
    )}
  </div>
)

const AccordionTrigger = ({ className, children, isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className={cn(
      "flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:underline",
      className
    )}
  >
    {children}
    <ChevronDown
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        isOpen && "rotate-180"
      )}
    />
  </button>
)

const AccordionContent = ({ className, children, isOpen }) => (
  <div
    className={cn(
      "overflow-hidden transition-all duration-200",
      isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
    )}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </div>
)

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

