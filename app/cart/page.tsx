"use client";


import { useCart } from "@/context/CartContext";
import { ProductCart } from "@/component/ProductCart";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";




export default function CartPage() {


    const { cartItems } = useCart();
    const supabase = createClient();
    const router = useRouter();

    async function placeOrder() {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const total = 0;
        const { data: order, error } = await supabase
            .from("orders")
            .insert({ user_id: user.id, total })
            .select()
            .single();

        await supabase.from("order_items").insert(
            cartItems.map((item) => ({
                order_id: order.id,
                product_id: item.id,
                quantity: 1,
                price: item.price, // snapshot the current price
            })),
        );


    }


    return (
        <div className="flex gap-2"><button onClick={() => placeOrder()}>Place Order</button>
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

