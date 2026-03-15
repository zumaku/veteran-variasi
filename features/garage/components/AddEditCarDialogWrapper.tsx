"use client";

import { useState } from "react";
import { AddEditCarDialog } from "./AddEditCarDialog";

interface AddEditCarDialogWrapperProps {
  userId: number;
  children: React.ReactNode;
}

export function AddEditCarDialogWrapper({
  userId,
  children,
}: AddEditCarDialogWrapperProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <AddEditCarDialog open={open} onOpenChange={setOpen} userId={userId} />
    </>
  );
}
