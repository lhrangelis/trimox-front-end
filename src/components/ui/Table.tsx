import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

/**
 * Tabela semântica com rolagem horizontal no celular.
 * O design original usava <div> com grid, o que esconde cabeçalhos de leitores de tela.
 */
export function DataTable({
  label,
  minWidth = 760,
  head,
  children,
  footer,
  caption,
  className,
}: {
  label: string;
  minWidth?: number;
  head: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  caption?: ReactNode;
  className?: string;
}) {
  return (
    <section aria-label={label} className={cn("relative overflow-x-auto rounded-2xl border border-line bg-surface", className)}>
      {caption}
      <table className="tabular w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-line text-xs font-semibold text-muted">{head}</tr>
        </thead>
        <tbody>{children}</tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </section>
  );
}

export function Th({ className, ...rest }: ComponentProps<"th">) {
  return <th scope="col" className={cn("px-4 py-3 font-semibold first:pl-4", className)} {...rest} />;
}

export function Td({ className, ...rest }: ComponentProps<"td">) {
  return <td className={cn("px-4 py-1.5 align-middle", className)} {...rest} />;
}

export function Tr({ selected, className, ...rest }: ComponentProps<"tr"> & { selected?: boolean }) {
  return <tr className={cn("border-b border-line-soft last:border-b-0", selected && "bg-mint", className)} {...rest} />;
}

/** Botão que ocupa a primeira célula e seleciona a linha. */
export function RowButton({ selected, className, ...rest }: ComponentProps<"button"> & { selected: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn("flex min-h-11 w-full cursor-pointer items-center gap-2.5 text-left text-graphite", className)}
      {...rest}
    />
  );
}
