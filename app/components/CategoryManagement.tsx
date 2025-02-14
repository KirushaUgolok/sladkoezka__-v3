'use client'

import { useState } from 'react'
import { Category } from '../../lib/db'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pencil, Trash, Plus } from 'lucide-react'
import Swal from 'sweetalert2'

interface CategoryManagementProps {
  categories: Category[]
  onAddCategory: (name: string) => Promise<void>
  onUpdateCategory: (id: string, name: string) => Promise<void>
  onDeleteCategory: (id: string) => Promise<void>
}

export default function CategoryManagement({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}: CategoryManagementProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      await onAddCategory(newCategoryName.trim())
      setNewCategoryName('')
      setIsAddDialogOpen(false)
    }
  }

  const handleUpdateCategory = async () => {
    if (editingCategory && editingCategory.name.trim()) {
      await onUpdateCategory(editingCategory.id, editingCategory.name.trim())
      setEditingCategory(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    const result = await Swal.fire({
      title: 'Вы уверены?',
      text: "Это действие нельзя будет отменить!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да, удалить!',
      cancelButtonText: 'Отмена'
    })

    if (result.isConfirmed) {
      await onDeleteCategory(id)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900">
            Управление категориями
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-amber-50 border-amber-200">
          <DropdownMenuLabel className="text-amber-800">Категории</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categories.map((category) => (
            <DropdownMenuItem key={category.id} className="flex justify-between items-center text-amber-800">
              <span>{category.name}</span>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-amber-600 hover:text-amber-800 hover:bg-amber-200"
                  onClick={() => {
                    setEditingCategory(category)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-red-600 hover:text-red-800 hover:bg-red-100"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsAddDialogOpen(true)} className="text-green-600 hover:text-green-800 hover:bg-green-100">
            <Plus size={16} className="mr-2" />
            Добавить категорию
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-amber-50 border-amber-200">
          <DialogHeader>
            <DialogTitle className="text-amber-800">Добавить новую категорию</DialogTitle>
            <DialogDescription className="text-amber-600">
              Введите название для новой категории.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Название категории"
            className="bg-white border-amber-200 text-amber-800 placeholder-amber-400"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-white text-amber-800 hover:bg-amber-100">
              Отмена
            </Button>
            <Button onClick={handleAddCategory} className="bg-amber-500 text-white hover:bg-amber-600">
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-amber-50 border-amber-200">
          <DialogHeader>
            <DialogTitle className="text-amber-800">Редактировать категорию</DialogTitle>
            <DialogDescription className="text-amber-600">
              Измените название категории.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={editingCategory?.name || ''}
            onChange={(e) => setEditingCategory(prev => prev ? {...prev, name: e.target.value} : null)}
            placeholder="Название категории"
            className="bg-white border-amber-200 text-amber-800 placeholder-amber-400"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-white text-amber-800 hover:bg-amber-100">
              Отмена
            </Button>
            <Button onClick={handleUpdateCategory} className="bg-amber-500 text-white hover:bg-amber-600">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

