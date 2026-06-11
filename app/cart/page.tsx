"use client";


import { useCart } from "@/context/CartContext";
import { ProductCart } from "@/component/ProductCart";
import Link from "next/link";




export default function CartPage() {


    const { cartItems } = useCart();

    return (
        <div className="flex gap-2">
            <Link href="/" className="flex gap-5 big colour:red ">back to the page

            </Link>

            {cartItems.map((item) => {


                return <ProductCart

                    key={item.id} id={item.id}
                    image_url={item.image_path}
                    title={item.name}
                    price={item.price}
                />


            })}

        </div>
    )

}

