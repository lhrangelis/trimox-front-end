"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./Button";

/**
 * Confirmação para ações difíceis de desfazer (suspender conta, enviar comunicado…).
 * Usa o <dialog> nativo: foco preso, Esc fecha e o resto da página fica inerte.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  destructive,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={titleId}
      className="m-auto w-[min(440px,calc(100vw-32px))] rounded-2xl border border-line bg-surface p-6 text-graphite backdrop:bg-graphite/40"
    >
      <h2 id={titleId} className="text-lg font-bold tracking-[-0.02em]">
        {title}
      </h2>
      <div className="mt-2 text-body">{children}</div>
      <div className="mt-6 flex flex-wrap justify-end gap-2.5">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant={destructive ? "danger" : "primary"}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
