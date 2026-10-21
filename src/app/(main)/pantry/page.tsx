/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import {
   Plus,
   Trash2,
   Pencil,
   Check,
   X,
   ChefHat,
   Loader2,
   Package,
   ScanSearch,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import {
   getPantryItems,
   deletePantryItem,
   updatePantryItem,
} from "@/actions/pantry.actions";
import AddToPantryModal from "@/components/AddToPantryModal";

type PantryItem = {
   id: string;
   name: string;
   quantity: string | null;
   createdAt: Date | string;
};

export default function PantryPage() {
   const [items, setItems] = useState<PantryItem[]>([]);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [editValues, setEditValues] = useState({
      name: "",
      quantity: "",
   });
   const [isModalOpen, setIsModalOpen] = useState(false);

   const openModal = useCallback(() => {
      setIsModalOpen(true);
   }, []);

   const closeModal = useCallback(() => {
      setIsModalOpen(false);
   }, []);

   // Fetch pantry items
   const {
      loading: loadingItems,
      data: itemsData,
      fn: fetchItems,
   } = useFetch(getPantryItems);

   // Delete pantry item
   const {
      loading: deleting,
      data: deleteData,
      fn: deleteItem,
   } = useFetch(deletePantryItem);

   // Update pantry item
   const {
      loading: updating,
      data: updateData,
      fn: updateItem,
   } = useFetch(updatePantryItem);

   useEffect(() => {
      void fetchItems();
   }, [fetchItems]);

   // Update the list when pantry data arrives
   useEffect(() => {
      if (itemsData?.items) {
         setItems(itemsData.items);
      }
   }, [itemsData]);

   // Refresh after deleting an item
   useEffect(() => {
      if (deleteData?.success && !deleting) {
         toast.success(deleteData.message || "Item removed from your pantry");
         void fetchItems();
      }
   }, [deleteData, deleting, fetchItems]);

   // Refresh after updating an item
   useEffect(() => {
      if (updateData?.success && !updating) {
         toast.success(updateData.message || "Ingredient updated");
         setEditingId(null);
         setEditValues({ name: "", quantity: "" });
         void fetchItems();
      }
   }, [updateData, updating, fetchItems]);

   const handleDelete = async (itemId: string) => {
      const formData = new FormData();
      formData.append("itemId", itemId);
      await deleteItem(formData);
   };

   const startEdit = (item: PantryItem) => {
      setEditingId(item.id);
      setEditValues({
         name: item.name,
         quantity: item.quantity ?? "",
      });
   };

   const cancelEdit = () => {
      setEditingId(null);
      setEditValues({ name: "", quantity: "" });
   };

   const saveEdit = async () => {
      if (!editingId) return;

      if (!editValues.name.trim()) {
         toast.error("Ingredient name cannot be empty");
         return;
      }

      const formData = new FormData();
      formData.append("itemId", editingId);
      formData.append("name", editValues.name.trim());
      formData.append("quantity", editValues.quantity.trim());

      await updateItem(formData);
   };

   const handleModalSuccess = useCallback(() => {
      void fetchItems();
   }, [fetchItems]);

   return (
      <main className="min-h-screen bg-[#fffdf8] px-4 pb-16 pt-12 text-stone-900 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-8">
               <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                     <Package
                        className="mt-1 size-16 shrink-0 text-[#d13228]"
                        strokeWidth={1.8}
                        aria-hidden="true"
                     />

                     <div>
                        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                           My Pantry
                        </h1>
                        <p className="mt-1 text-sm text-stone-600 sm:text-base">
                           Your ingredients, ready for something delicious.
                        </p>
                     </div>
                  </div>

                  <Button
                     onClick={openModal}
                     className="hidden gap-2 bg-[#d13228] text-white hover:bg-[#b92820] sm:inline-flex"
                  >
                     <Plus className="h-4 w-4" />
                     Add ingredient
                  </Button>
               </div>

               <Button
                  onClick={openModal}
                  className="mt-5 w-full gap-2 bg-[#d13228] text-white hover:bg-[#b92820] sm:hidden"
               >
                  <Plus className="h-4 w-4" />
                  Add ingredient
               </Button>
            </div>

            {/* Recipe discovery card */}
            {items.length > 0 && (
               <Link
                  href="/pantry/recipes"
                  className="group mb-10 block overflow-hidden rounded-2xl border border-orange-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-900/5"
               >
                  <div className="flex flex-col sm:flex-row">
                     <div className="flex flex-1 items-center gap-5 p-6 sm:p-8">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#d13228] transition-transform duration-300 group-hover:scale-105">
                           <ChefHat className="h-8 w-8" strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0">
                           <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#d13228]">
                              Make something delicious
                           </p>
                           <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                              What can I cook today?
                           </h2>
                           <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                              Turn the ingredients you already have into your
                              next favourite meal. Discover recipes made for
                              your pantry.
                           </p>
                           <p className="mt-3 text-sm font-medium text-stone-500">
                              You have{" "}
                              <span className="font-semibold text-stone-900">
                                 {items.length}{" "}
                                 {items.length === 1
                                    ? "ingredient"
                                    : "ingredients"}
                              </span>{" "}
                              ready to use.
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between gap-4 border-t border-orange-100 bg-orange-50/70 px-6 py-5 sm:w-56 sm:flex-col sm:items-start sm:justify-center sm:border-l sm:border-t-0 sm:px-7">
                        <div>
                           <p className="font-semibold text-stone-900">
                              Find your next meal
                           </p>
                           <p className="mt-1 text-sm text-stone-600">
                              Explore recipe ideas
                           </p>
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d13228] text-white transition-transform duration-300 group-hover:translate-x-1">
                           <span className="text-xl leading-none">→</span>
                        </div>
                     </div>
                  </div>
               </Link>
            )}

            {/* Pantry items heading */}
            <div className="mb-5 flex items-center justify-between gap-3">
               <h2 className="text-xl font-semibold text-stone-900">
                  Your ingredients
               </h2>

               {!loadingItems && (
                  <Badge
                     variant="outline"
                     className="rounded-full border-stone-200 px-3 py-1 text-sm font-normal text-stone-600"
                  >
                     {items.length} {items.length === 1 ? "item" : "items"}
                  </Badge>
               )}
            </div>

            {/* Loading state */}
            {loadingItems && (
               <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white py-20">
                  <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#d13228]" />
                  <p className="text-sm text-stone-500">
                     Loading your pantry...
                  </p>
               </div>
            )}

            {/* Ingredients grid */}
            {!loadingItems && items.length > 0 && (
               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                     <article
                        key={item.id}
                        className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-orange-200 hover:shadow-sm"
                     >
                        {editingId === item.id ? (
                           <div className="space-y-3">
                              <input
                                 autoFocus
                                 value={editValues.name}
                                 onChange={(event) =>
                                    setEditValues((current) => ({
                                       ...current,
                                       name: event.target.value,
                                    }))
                                 }
                                 placeholder="Ingredient name"
                                 className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#d13228] focus:ring-2 focus:ring-orange-100"
                              />

                              <input
                                 value={editValues.quantity}
                                 onChange={(event) =>
                                    setEditValues((current) => ({
                                       ...current,
                                       quantity: event.target.value,
                                    }))
                                 }
                                 placeholder="Quantity (e.g. 2 cups)"
                                 className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#d13228] focus:ring-2 focus:ring-orange-100"
                              />

                              <div className="flex gap-2">
                                 <Button
                                    size="sm"
                                    onClick={saveEdit}
                                    disabled={updating}
                                    className="flex-1 bg-[#d13228] hover:bg-[#b92820]"
                                 >
                                    {updating ? (
                                       <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                       <Check className="h-4 w-4" />
                                    )}
                                    Save
                                 </Button>

                                 <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEdit}
                                    disabled={updating}
                                    className="flex-1"
                                 >
                                    <X className="h-4 w-4" />
                                    Cancel
                                 </Button>
                              </div>
                           </div>
                        ) : (
                           <>
                              <div className="flex items-start justify-between gap-3">
                                 <div className="min-w-0">
                                    <h3 className="break-words font-semibold capitalize text-stone-900">
                                       {item.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-stone-500">
                                       {item.quantity?.trim() ||
                                          "Quantity not specified"}
                                    </p>
                                 </div>

                                 <div className="flex shrink-0 gap-1">
                                    <button
                                       type="button"
                                       onClick={() => startEdit(item)}
                                       aria-label={`Edit ${item.name}`}
                                       className="rounded-lg p-2 text-stone-500 transition hover:bg-orange-50 hover:text-[#d13228]"
                                    >
                                       <Pencil className="h-4 w-4" />
                                    </button>

                                    <button
                                       type="button"
                                       onClick={() =>
                                          void handleDelete(item.id)
                                       }
                                       disabled={deleting}
                                       aria-label={`Delete ${item.name}`}
                                       className="rounded-lg p-2 text-stone-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                    >
                                       <Trash2 className="h-4 w-4" />
                                    </button>
                                 </div>
                              </div>

                              <div className="mt-5 border-t border-stone-100 pt-3 text-xs text-stone-400">
                                 Added{" "}
                                 {new Date(item.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                       day: "numeric",
                                       month: "short",
                                       year: "numeric",
                                    },
                                 )}
                              </div>
                           </>
                        )}
                     </article>
                  ))}
               </div>
            )}

            {/* Empty state */}
            {!loadingItems && items.length === 0 && (
               <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center sm:px-12">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-[#d13228]">
                     <Package className="h-8 w-8" />
                  </div>

                  <h3 className="text-xl font-semibold text-stone-900">
                     Your pantry is empty
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
                     Add ingredients manually or scan a photo with AI. Then
                     discover recipes you can make with what you have.
                  </p>

                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                     <Button
                        onClick={openModal}
                        className="gap-2 bg-[#d13228] hover:bg-[#b92820]"
                     >
                        <Plus className="h-4 w-4" />
                        Add ingredients
                     </Button>

                     <Button
                        variant="outline"
                        onClick={openModal}
                        className="gap-2 border-stone-200"
                     >
                        <ScanSearch className="h-4 w-4" />
                        Scan with AI
                     </Button>
                  </div>
               </div>
            )}
         </div>

         <AddToPantryModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSuccess={handleModalSuccess}
         />
      </main>
   );
}
