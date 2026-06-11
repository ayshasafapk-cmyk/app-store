
"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type Product = {
    id: number,
    name: string,
    price: number
    image_path: string
};



type CartContextType = {
    cartItems: Product[];

};

interface CartProviderProps {
    children: ReactNode;
}
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: CartProviderProps) {
    const sampleProducts: Product[] = [
        {
            id: 100,
            name: "Jackets",
            price: 200,
            image_path: "products/jacket.jpg"
        },
    ];
    const [cartItems, setCartItems] = useState<Product[]>(sampleProducts)

    return <CartContext.Provider
        value={{
            cartItems,
        }}

    >



        {children

        }
    </CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("Ctx");
    return ctx;


}
