export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  /** Starred by the current user. Toggled optimistically by useToggleFavorite. */
  favorite: boolean;
}
