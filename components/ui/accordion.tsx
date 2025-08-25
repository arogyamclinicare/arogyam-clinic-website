"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function Accordion({
  type = "single",
  collapsible = false,
  className,
  children,
  ...props
}: {
  type?: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());

  const toggleItem = React.useCallback((value: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        if (type === "single") {
          newSet.clear();
        }
        newSet.add(value);
      }
      return newSet;
    });
  }, [type]);

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({
  value,
  className,
  children,
  ...props
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("border rounded-lg", className)} data-value={value} {...props}>
      {children}
    </div>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);
  
  if (!context || !item) {
    throw new Error("AccordionTrigger must be used within AccordionItem");
  }

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between p-4 text-left transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      onClick={() => context.toggleItem(item.value)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </button>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);
  
  if (!context || !item) {
    throw new Error("AccordionContent must be used within AccordionItem");
  }

  const isOpen = context.openItems.has(item.value);

  if (!isOpen) return null;

  return (
    <div className={cn("pb-4 pt-0", className)} {...props}>
      <div className="px-4">{children}</div>
    </div>
  );
}

// Context for item value
const AccordionItemContext = React.createContext<{ value: string } | null>(null);

// Wrapper component to provide item context
function AccordionItemProvider({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      {children}
    </AccordionItemContext.Provider>
  );
}

// Enhanced AccordionItem that provides context
const AccordionItemWithContext = React.forwardRef<
  HTMLDivElement,
  { value: string; className?: string; children: React.ReactNode }
>(({ value, children, ...props }, _ref) => (
  <AccordionItemProvider value={value}>
    <AccordionItem value={value} {...props}>
      {children}
    </AccordionItem>
  </AccordionItemProvider>
));

AccordionItemWithContext.displayName = "AccordionItem";

export {
  Accordion,
  AccordionItemWithContext as AccordionItem,
  AccordionTrigger,
  AccordionContent,
};