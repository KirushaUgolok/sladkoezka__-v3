'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Category } from '../../lib/db'

interface EditCategoryFormProps {
  category: Category;
  onSave: (updatedCategory: Category) => void;
  onCancel: () => void;
}

export default function EditCategoryForm({ category, onSave, onCancel }: EditCategoryFormProps) {
  const [editedCategory, setEditedCategory] = useState<Category>(category)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedCategory(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedCategory)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Название категории</Label>
        <Input
          id="name"
          name="name"
          value={editedCategory.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="bg-white text-amber-500 hover:bg-amber-50"
        >
          Отменить
        </Button>
        <Button 
          type="submit"
          className="bg-green-500 text-white hover:bg-green-600"
        >
          Сохранить
        </Button>
      </div>
    </form>
  )
}

