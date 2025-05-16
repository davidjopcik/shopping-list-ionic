export interface ShoppingItem {
    id: number;
    name: string;
    purchased: boolean;
    selected?: boolean;
    category?: string
}

export interface ShoppingList {
    id: number;
    name: string;
    owner: string;
    items: ShoppingItem[];
}