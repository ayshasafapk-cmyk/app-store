"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
    const { cartItems } = useCart();
    const items = cartItems.length;




    return (
        <div className="flex justify-start">
            <h1 className="text-4x1 front-bold p-2 text-yellow-798">E-commerse</h1>
            <div className="flex p-5">

                <ShoppingCart />
                <p>{cartItems.length}</p>
            </div>
        </div>

    );
}
