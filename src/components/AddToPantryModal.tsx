/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Camera, Plus, X, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ImageUploader from "@/components/ImageUploader";
import {
   scanPantryImage,
   saveToPantry,
   addPantryItemManually,
} from "@/actions/pantry.actions";
import { toast } from "sonner";

type ScannedIngredient = {
   name: string;
   quantity?: string;
   confidence?: number;
};

type AddToPantryModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onSuccess?: () => void;
   defaultTab?: "scan" | "manual";
};

export default function AddToPantryModal({
   isOpen,
   onClose,
   onSuccess,
}: AddToPantryModalProps) {
   const [activeTab, setActiveTab] = useState<"scan" | "manual">("scan");
   const [selectedImage, setSelectedImage] = useState<File | null>(null);
   const [scannedIngredients, setScannedIngredients] = useState<
      ScannedIngredient[]
   >([]);
   const [manualItem, setManualItem] = useState({
      name: "",
      quantity: "",
   });

   const [scanning, setScanning] = useState(false);
   const [saving, setSaving] = useState(false);
   const [adding, setAdding] = useState(false);

   // Always open on the AI scan tab by default whenever the modal opens
   useEffect(() => {
      if (isOpen) {
         setActiveTab("scan");
      }
   }, [isOpen]);

   const busy = scanning || saving || adding;

   const resetModal = () => {
      setActiveTab("scan");
      setSelectedImage(null);
      setScannedIngredients([]);
      setManualItem({ name: "", quantity: "" });
   };

   const handleClose = () => {
      if (busy) return;

      resetModal();
      onClose();
   };

   // Handle image selection
   const handleImageSelect = (file: File | null) => {
      setSelectedImage(file);
      setScannedIngredients([]);
   };

   // Scan selected image
   const handleScan = async () => {
      if (!selectedImage) {
         toast.error("Choose a pantry image first");
         return;
      }

      setScanning(true);
      try {
         const formData = new FormData();
         formData.append("image", selectedImage);

         const result = await scanPantryImage(formData);

         const ingredients: ScannedIngredient[] = (
            result.ingredients ?? []
         ).map((ingredient) => ({
            name: ingredient.name ?? "",
            quantity: ingredient.quantity ?? "",
            confidence: ingredient.confidence,
         }));

         setScannedIngredients(ingredients);

         if (ingredients.length > 0) {
            toast.success(`Found ${ingredients.length} ingredients!`);
         } else {
            toast.info("No ingredients detected. Try another image.");
         }
      } catch (error) {
         toast.error(
            error instanceof Error ? error.message : "Couldn't scan this image",
         );
      } finally {
         setScanning(false);
      }
   };

   // Save scanned ingredients
   const handleSaveScanned = async () => {
      const ingredients = scannedIngredients
         .map((ingredient) => ({
            name: ingredient.name.trim(),
            quantity: ingredient.quantity?.trim() ?? "",
         }))
         .filter((ingredient) => ingredient.name.length > 0);

      if (ingredients.length === 0) {
         toast.error("Add at least one ingredient before saving");
         return;
      }

      setSaving(true);
      try {
         const formData = new FormData();
         formData.append("ingredients", JSON.stringify(ingredients));

         const result = await saveToPantry(formData);
         toast.success(result.message || "Ingredients saved to your pantry");
         resetModal();
         onClose();
         onSuccess?.();
      } catch (error) {
         toast.error(
            error instanceof Error
               ? error.message
               : "Failed to save ingredients",
         );
      } finally {
         setSaving(false);
      }
   };

   // Add an ingredient manually
   const handleAddManual = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const name = manualItem.name.trim();

      if (!name) {
         toast.error("Enter an ingredient name");
         return;
      }

      setAdding(true);
      try {
         const formData = new FormData();
         formData.append("name", name);
         formData.append("quantity", manualItem.quantity.trim());

         const result = await addPantryItemManually(formData);
         toast.success(result.message || "Ingredient added to your pantry");
         setManualItem({ name: "", quantity: "" });
         resetModal();
         onClose();
         onSuccess?.();
      } catch (error) {
         toast.error(
            error instanceof Error ? error.message : "Failed to add ingredient",
         );
      } finally {
         setAdding(false);
      }
   };

   // Remove a detected ingredient
   const removeIngredient = (index: number) => {
      setScannedIngredients((current) =>
         current.filter((_, ingredientIndex) => ingredientIndex !== index),
      );
   };

   // Update a detected ingredient
   const updateIngredient = (
      index: number,
      field: "name" | "quantity",
      value: string,
   ) => {
      setScannedIngredients((current) =>
         current.map((ingredient, ingredientIndex) =>
            ingredientIndex === index
               ? { ...ingredient, [field]: value }
               : ingredient,
         ),
      );
   };

   return (
      <Dialog
         open={isOpen}
         onOpenChange={(open) => {
            if (!open) handleClose();
         }}
      >
         <DialogContent className="max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-lg sm:w-full sm:max-w-2xl overflow-y-auto overflow-x-hidden rounded-[20px] border-2 border-black bg-[#fffdf8] p-5 text-stone-900 shadow-[7px_7px_0px_#000] sm:p-7">
            <DialogHeader>
               <DialogTitle className="text-2xl font-bold tracking-tight text-stone-900">
                  Add to your pantry
               </DialogTitle>
               <DialogDescription className="text-stone-600">
                  Scan ingredients with AI or add them manually.
               </DialogDescription>
            </DialogHeader>

            <Tabs
               value={activeTab}
               onValueChange={(value) =>
                  setActiveTab(value as "scan" | "manual")
               }
               className="mt-4"
            >
               <TabsList className="grid w-full grid-cols-2 rounded-xl bg-stone-100">
                  <TabsTrigger value="scan" disabled={busy} className="gap-2">
                     <Camera className="h-4 w-4" />
                     AI scan
                  </TabsTrigger>
                  <TabsTrigger value="manual" disabled={busy} className="gap-2">
                     <Plus className="h-4 w-4" />
                     Add manually
                  </TabsTrigger>
               </TabsList>

               {/* AI Scan */}
               <TabsContent value="scan" className="mt-6 space-y-6">
                  {scannedIngredients.length === 0 ? (
                     <div className="space-y-4">
                        <ImageUploader
                           image={selectedImage}
                           onImageSelect={handleImageSelect}
                           loading={scanning}
                        />

                        <Button
                           type="button"
                           onClick={handleScan}
                           disabled={!selectedImage || scanning}
                           className="h-12 w-full gap-2 bg-[#d13228] text-white hover:bg-[#b92820]"
                        >
                           {scanning ? (
                              <>
                                 <Loader2 className="h-5 w-5 animate-spin" />
                                 Analyzing image...
                              </>
                           ) : (
                              <>
                                 <Sparkles className="h-5 w-5" />
                                 Identify ingredients
                              </>
                           )}
                        </Button>
                     </div>
                  ) : (
                     <div className="space-y-4">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                           <div>
                              <h3 className="text-lg font-semibold text-stone-900">
                                 Review detected ingredients
                              </h3>
                              <p className="text-sm text-stone-600">
                                 Found {scannedIngredients.length} ingredients.
                                 Edit them before saving.
                              </p>
                           </div>

                           <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={saving || scanning}
                              onClick={() => setScannedIngredients([])}
                              className="gap-2 self-start border-stone-200"
                           >
                              <Camera className="h-4 w-4" />
                              Scan again
                           </Button>
                        </div>

                        <div className="max-h-72 space-y-3 overflow-y-auto overflow-x-hidden pr-1">
                           {scannedIngredients.map((ingredient, index) => (
                              <div
                                 key={index}
                                 className="flex flex-col gap-2.5 rounded-xl border border-stone-200 bg-white p-3 sm:flex-row sm:items-center"
                              >
                                 <input
                                    aria-label={`Ingredient ${index + 1} name`}
                                    value={ingredient.name}
                                    onChange={(event) =>
                                       updateIngredient(
                                          index,
                                          "name",
                                          event.target.value,
                                       )
                                    }
                                    placeholder="Ingredient name"
                                    className="min-w-0 flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#d13228] focus:ring-2 focus:ring-orange-100"
                                 />

                                 <div className="flex items-center gap-2">
                                    <input
                                       aria-label={`Ingredient ${index + 1} quantity`}
                                       value={ingredient.quantity ?? ""}
                                       onChange={(event) =>
                                          updateIngredient(
                                             index,
                                             "quantity",
                                             event.target.value,
                                          )
                                       }
                                       placeholder="Quantity"
                                       className="w-full flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#d13228] focus:ring-2 focus:ring-orange-100 sm:w-28"
                                    />

                                    {typeof ingredient.confidence ===
                                       "number" && (
                                       <Badge
                                          variant="outline"
                                          className="shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 font-medium"
                                       >
                                          {Math.round(
                                             ingredient.confidence * 100,
                                          )}
                                          %
                                       </Badge>
                                    )}

                                    <Button
                                       type="button"
                                       size="icon"
                                       variant="ghost"
                                       aria-label={`Remove ${ingredient.name || "ingredient"}`}
                                       onClick={() => removeIngredient(index)}
                                       className="shrink-0 text-stone-500 hover:bg-red-50 hover:text-red-600"
                                    >
                                       <X className="h-4 w-4" />
                                    </Button>
                                 </div>
                              </div>
                           ))}
                        </div>

                        <Button
                           type="button"
                           onClick={handleSaveScanned}
                           disabled={saving || scannedIngredients.length === 0}
                           className="h-12 w-full gap-2 bg-[#d13228] text-white hover:bg-[#b92820]"
                        >
                           {saving ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                           ) : (
                              <Check className="h-5 w-5" />
                           )}
                           {saving
                              ? "Saving ingredients..."
                              : `Save ${scannedIngredients.length} ingredients`}
                        </Button>
                     </div>
                  )}
               </TabsContent>

               {/* Manual Entry */}
               <TabsContent value="manual" className="mt-6">
                  <form onSubmit={handleAddManual} className="space-y-4">
                     <div>
                        <label
                           htmlFor="manual-ingredient-name"
                           className="mb-2 block text-sm font-medium text-stone-700"
                        >
                           Ingredient name
                        </label>
                        <input
                           id="manual-ingredient-name"
                           type="text"
                           required
                           maxLength={100}
                           value={manualItem.name}
                           onChange={(event) =>
                              setManualItem((current) => ({
                                 ...current,
                                 name: event.target.value,
                              }))
                           }
                           placeholder="e.g. Tomatoes"
                           disabled={adding}
                           className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#d13228] focus:ring-2 focus:ring-orange-100"
                        />
                     </div>

                     <div>
                        <label
                           htmlFor="manual-ingredient-quantity"
                           className="mb-2 block text-sm font-medium text-stone-700"
                        >
                           Quantity{" "}
                           <span className="font-normal text-stone-400">
                              (optional)
                           </span>
                        </label>
                        <input
                           id="manual-ingredient-quantity"
                           type="text"
                           maxLength={100}
                           value={manualItem.quantity}
                           onChange={(event) =>
                              setManualItem((current) => ({
                                 ...current,
                                 quantity: event.target.value,
                              }))
                           }
                           placeholder="e.g. 500 g, 2 cups, 3 pieces"
                           disabled={adding}
                           className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#d13228] focus:ring-2 focus:ring-orange-100"
                        />
                     </div>

                     <Button
                        type="submit"
                        disabled={adding}
                        className="h-12 w-full gap-2 bg-[#d13228] text-white hover:bg-[#b92820]"
                     >
                        {adding ? (
                           <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                           <Plus className="h-5 w-5" />
                        )}
                        {adding ? "Adding ingredient..." : "Add ingredient"}
                     </Button>
                  </form>
               </TabsContent>
            </Tabs>
         </DialogContent>
      </Dialog>
   );
}
