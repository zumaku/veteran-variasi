"use client";

import React, { useState, useTransition } from "react";
import { Category } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteCategoryAction } from "../actions";
import { useRouter } from "next/navigation";

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      startTransition(async () => {
        const result = await deleteCategoryAction(id);
        if (result.success) {
          router.refresh();
        } else {
          alert(result.message || "Gagal menghapus kategori");
        }
      });
    }
  };

  return (
    <div className="rounded-md border bg-white dark:bg-zinc-950">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Kategori</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Belum ada kategori.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell className="truncate max-w-[300px]">
                  {category.description || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link
                            href={`/dashboard/admin/categories/${category.slug}/edit`}
                            className="flex items-center"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
                          onClick={() => handleDelete(category.id)}
                          disabled={isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
