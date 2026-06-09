"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function AdminPage() {
    const supabase = createClient();

    const [products, setProducts] = useState<any[]>([]);

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("id", { ascending: false });

        if (!error) {
            setProducts(data || []);
        }
    }

    function resetForm() {
        setTitle("");
        setPrice("");
        setImageFile(null);
        setPreview(null);
        setEditingId(null);

        const input = document.getElementById(
            "image-input"
        ) as HTMLInputElement;

        if (input) {
            input.value = "";
        }
    }

    function handleImageChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0] ?? null;

        setImageFile(file);
        setPreview(
            file ? URL.createObjectURL(file) : null
        );
    }

    function handleEdit(product: any) {
        setEditingId(product.id);
        setTitle(product.title);
        setPrice(product.price.toString());

        if (product.image_path) {
            const { data } = supabase.storage
                .from("product-images")
                .getPublicUrl(product.image_path);

            setPreview(data.publicUrl);
        }
    }

    async function handleDelete(product: any) {
        const confirmed = window.confirm(
            `Delete "${product.title}"?`
        );

        if (!confirmed) return;

        try {
            if (product.image_path) {
                await supabase.storage
                    .from("product-images")
                    .remove([product.image_path]);
            }

            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", product.id);

            if (error) throw error;

            setMessage({
                type: "success",
                text: "Product deleted successfully.",
            });

            fetchProducts();
        } catch (err: any) {
            setMessage({
                type: "error",
                text: err.message,
            });
        }
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        if (!title || !price) {
            setMessage({
                type: "error",
                text: "Title and price are required.",
            });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            if (editingId) {
                let updatedData: any = {
                    title,
                    price: parseFloat(price),
                };

                if (imageFile) {
                    const fileExt =
                        imageFile.name.split(".").pop();

                    const filePath = `products/${Date.now()}.${fileExt}`;

                    const { error: uploadError } =
                        await supabase.storage
                            .from("product-images")
                            .upload(filePath, imageFile);

                    if (uploadError) {
                        throw uploadError;
                    }

                    updatedData.image_path = filePath;
                }

                const { error } = await supabase
                    .from("products")
                    .update(updatedData)
                    .eq("id", editingId);

                if (error) throw error;

                setMessage({
                    type: "success",
                    text: "Product updated successfully!",
                });
            } else {
                if (!imageFile) {
                    throw new Error(
                        "Please select an image."
                    );
                }

                const fileExt =
                    imageFile.name.split(".").pop();

                const filePath = `products/${Date.now()}.${fileExt}`;

                const { error: uploadError } =
                    await supabase.storage
                        .from("product-images")
                        .upload(filePath, imageFile);

                if (uploadError) {
                    throw uploadError;
                }

                const { error } = await supabase
                    .from("products")
                    .insert({
                        title,
                        price: parseFloat(price),
                        image_path: filePath,
                    });

                if (error) throw error;

                setMessage({
                    type: "success",
                    text: "Product added successfully!",
                });
            }

            resetForm();
            fetchProducts();
        } catch (err: any) {
            setMessage({
                type: "error",
                text: err.message,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Product Admin
                    </h1>

                    <Link
                        href="/"
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Back to Products
                    </Link>
                </div>

                {/* FORM */}

                <div className="bg-white dark:bg-gray-900 border rounded-2xl p-6 mb-10">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Product Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg px-4 py-3 bg-transparent"
                                placeholder="Product title"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Price
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) =>
                                    setPrice(
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg px-4 py-3 bg-transparent"
                                placeholder="Price"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Product Image
                            </label>

                            {preview && (
                                <div className="mb-4">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-48 w-full object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <input
                                id="image-input"
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />
                        </div>

                        {message && (
                            <div
                                className={`p-3 rounded-lg ${message.type ===
                                    "success"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-5 py-3 rounded-lg disabled:opacity-50"
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Product"
                                        : "Add Product"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={
                                        resetForm
                                    }
                                    className="bg-gray-500 text-white px-5 py-3 rounded-lg"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* PRODUCTS */}

                <div>
                    <h2 className="text-2xl font-bold mb-6">
                        Products
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {products.map((product) => {
                            const { data } =
                                supabase.storage
                                    .from(
                                        "product-images"
                                    )
                                    .getPublicUrl(
                                        product.image_path
                                    );

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-gray-900 border rounded-xl overflow-hidden"
                                >
                                    <img
                                        src={
                                            data.publicUrl
                                        }
                                        alt={
                                            product.title
                                        }
                                        className="w-full h-56 object-cover"
                                    />

                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg">
                                            {
                                                product.title
                                            }
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                            $
                                            {
                                                product.price
                                            }
                                        </p>

                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        product
                                                    )
                                                }
                                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        product
                                                    )
                                                }
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {products.length === 0 && (
                            <p className="text-gray-500">
                                No products found.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}