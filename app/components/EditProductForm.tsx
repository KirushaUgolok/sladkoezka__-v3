'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Product, Category } from '../../lib/db'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Swal from 'sweetalert2'

interface EditProductFormProps {
  product: Product;
  categories: Category[];
  onSave: (updatedProduct: Product) => void;
  onCancel: () => void;
}

export default function EditProductForm({ product, categories, onSave, onCancel }: EditProductFormProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProduct(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }))
  }

  const handleCategoryChange = (value: string) => {
    setEditedProduct(prev => ({ ...prev, category_id: value === 'none' ? undefined : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editedProduct.category_id) {
      Swal.fire({
        title: 'Внимание',
        text: 'Категория не выбрана. Вы уверены, что хотите продолжить?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Да, продолжить',
        cancelButtonText: 'Отмена'
      }).then((result) => {
        if (result.isConfirmed) {
          onSave(editedProduct)
        }
      })
    } else {
      onSave(editedProduct)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Название</Label>
        <Input
          id="name"
          name="name"
          value={editedProduct.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          name="description"
          value={editedProduct.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Цена</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={editedProduct.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="image">URL изображения</Label>
        <Input
          id="image"
          name="image"
          value={editedProduct.image}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="category_id">Категория</Label>
        <Select
          value={editedProduct.category_id || 'none'}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Без категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

