export interface CategoryTranslation {
  name: string
}

export interface Category {
  id: string
  translations: {
    [key: string]: CategoryTranslation
  }
  createdAt: string
  updatedAt: string
  slug: string
}