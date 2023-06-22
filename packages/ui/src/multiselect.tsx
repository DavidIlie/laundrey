"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";

import { Badge } from "./badge";
import { Command, CommandGroup, CommandItem } from "./command";

type Element = Record<"value" | "label", string>;

const MultiSelect: React.FC<{
   data: Element[];
   onChange: (...event: any[]) => void;
   value: string[] | undefined;
}> = ({ data, onChange, value: propValue = [] }) => {
   const inputRef = React.useRef<HTMLInputElement>(null);
   const [open, setOpen] = React.useState(false);
   const [inputValue, setInputValue] = React.useState("");

   const value = propValue.map((prop) => ({
      value: prop,
      label: data.filter((s) => s.value === prop)[0]!.label,
   }));

   const handleUnselect = (element: Element) => {
      onChange(propValue.filter((s) => s !== element.value));
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
         if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "") {
               onChange(() => {
                  const newSelected = [...propValue];
                  newSelected.pop();
                  return newSelected;
               });
            }
         }
         if (e.key === "Escape") {
            input.blur();
         }
      }
   };

   const selectables = data.filter(
      (element) => !propValue.includes(element.value),
   );

   return (
      <Command
         onKeyDown={handleKeyDown}
         className="overflow-visible dark:bg-gray-800"
      >
         <div className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <div className="flex flex-wrap gap-1">
               {value.map((element) => {
                  return (
                     <Badge key={element.value} variant="secondary">
                        {element.label}
                        <button
                           className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                           onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                 handleUnselect(element);
                              }
                           }}
                           onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                           }}
                           onClick={() => handleUnselect(element)}
                        >
                           <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                     </Badge>
                  );
               })}
               <CommandPrimitive.Input
                  ref={inputRef}
                  value={inputValue}
                  onValueChange={setInputValue}
                  onBlur={() => setOpen(false)}
                  onFocus={() => setOpen(true)}
                  className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
               />
            </div>
         </div>
         <div className="relative">
            {open && selectables.length > 0 ? (
               <div className="absolute top-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                  <CommandGroup className="h-full overflow-auto">
                     {selectables.map((element) => {
                        return (
                           <CommandItem
                              key={element.value}
                              onMouseDown={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                              }}
                              onSelect={() => {
                                 setInputValue("");
                                 onChange([...propValue, element.value]);
                              }}
                           >
                              {element.label}
                           </CommandItem>
                        );
                     })}
                  </CommandGroup>
               </div>
            ) : null}
         </div>
      </Command>
   );
};

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
