/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { capitalize } from "@/lib/utils";

export type RecipePDFProps = {
   recipe: {
      title: string;
      description?: string;
      cuisine?: string;
      category?: string;
      imageUrl?: string | null;
      prepTime?: string | number;
      cookTime?: string | number;
      servings?: string | number;
      ingredients: { item: string; amount: string; category?: string }[];
      instructions: {
         step: number;
         title: string;
         instruction: string;
         tip?: string;
      }[];
      nutrition?: {
         calories?: string | number;
         protein?: string | number;
         carbs?: string | number;
         fat?: string | number;
      } | null;
      tips?: string[] | null;
      substitutions?: {
         original: string;
         alternatives: string[];
      }[] | null;
   };
};

const styles = StyleSheet.create({
   page: {
      paddingTop: 32,
      paddingBottom: 48,
      paddingHorizontal: 36,
      fontSize: 10,
      fontFamily: "Helvetica",
      color: "#292524",
      backgroundColor: "#ffffff",
   },
   // Header / Branding
   brandHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 10,
      marginBottom: 14,
      borderBottomWidth: 1.5,
      borderBottomColor: "#f0c4bd",
   },
   brandLogo: {
      fontSize: 13,
      fontFamily: "Helvetica-Bold",
      color: "#d13228",
      letterSpacing: 1.5,
   },
   brandTagline: {
      fontSize: 8,
      color: "#78716c",
      textTransform: "uppercase",
      letterSpacing: 0.8,
   },

   // Recipe Main Title Section
   titleSection: {
      marginBottom: 14,
   },
   recipeImageContainer: {
      width: "100%",
      height: 160,
      borderRadius: 8,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#e7e5e4",
      marginBottom: 10,
   },
   recipeImage: {
      width: "100%",
      height: 160,
      objectFit: "cover",
   },
   badgeRow: {
      flexDirection: "row",
      marginBottom: 8,
   },
   badge: {
      backgroundColor: "#fff5f2",
      borderWidth: 1,
      borderColor: "#f0c4bd",
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginRight: 6,
   },
   badgeText: {
      fontSize: 8.5,
      fontFamily: "Helvetica-Bold",
      color: "#d13228",
   },
   title: {
      fontSize: 22,
      fontFamily: "Helvetica-Bold",
      color: "#1c1917",
      marginBottom: 6,
      lineHeight: 1.2,
   },
   description: {
      fontSize: 9.5,
      color: "#57534e",
      lineHeight: 1.4,
   },

   // Metadata stats bar (Total time, Servings, Calories)
   statsBar: {
      flexDirection: "row",
      backgroundColor: "#fafaf9",
      borderWidth: 1,
      borderColor: "#e7e5e4",
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
   },
   statItem: {
      flex: 1,
      alignItems: "center",
      borderRightWidth: 1,
      borderRightColor: "#e7e5e4",
   },
   statItemLast: {
      flex: 1,
      alignItems: "center",
   },
   statLabel: {
      fontSize: 7.5,
      color: "#78716c",
      textTransform: "uppercase",
      marginBottom: 2,
      letterSpacing: 0.5,
   },
   statValue: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      color: "#d13228",
   },

   // Section Headings
   sectionHeading: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      color: "#1c1917",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      paddingBottom: 4,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#e7e5e4",
   },

   // Two-column overview layout (Ingredients & Nutrition on Left/Overview)
   twoColumnRow: {
      flexDirection: "row",
      marginBottom: 16,
   },
   leftColumn: {
      flex: 3,
      marginRight: 16,
   },
   rightColumn: {
      flex: 2,
   },

   // Ingredients List
   ingredientCategoryTitle: {
      fontSize: 8.5,
      fontFamily: "Helvetica-Bold",
      color: "#78716c",
      textTransform: "uppercase",
      marginTop: 6,
      marginBottom: 4,
      letterSpacing: 0.5,
   },
   ingredientRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 3.5,
      borderBottomWidth: 0.5,
      borderBottomColor: "#f5f5f4",
   },
   ingredientName: {
      fontSize: 9,
      color: "#292524",
      flex: 1,
   },
   ingredientAmount: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: "#d13228",
      textAlign: "right",
   },

   // Nutrition Card
   nutritionCard: {
      backgroundColor: "#fffdf8",
      borderWidth: 1,
      borderColor: "#f0c4bd",
      borderRadius: 8,
      padding: 10,
   },
   nutritionTitle: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: "#1c1917",
      marginBottom: 6,
      textTransform: "uppercase",
   },
   nutritionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
   },
   nutritionPill: {
      width: "50%",
      paddingVertical: 4,
   },
   nutritionLabel: {
      fontSize: 7.5,
      color: "#78716c",
      textTransform: "uppercase",
   },
   nutritionValue: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: "#292524",
   },

   // Instructions Section
   instructionContainer: {
      marginBottom: 14,
   },
   instructionStep: {
      flexDirection: "row",
      marginBottom: 10,
   },
   stepBadge: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: "#d13228",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      marginTop: 1,
   },
   stepNumber: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: "#ffffff",
   },
   stepContent: {
      flex: 1,
   },
   stepTitle: {
      fontSize: 10.5,
      fontFamily: "Helvetica-Bold",
      color: "#1c1917",
      marginBottom: 3,
   },
   stepText: {
      fontSize: 9,
      color: "#44403c",
      lineHeight: 1.45,
   },
   stepTipCard: {
      backgroundColor: "#fff8f5",
      borderLeftWidth: 2.5,
      borderLeftColor: "#d13228",
      borderRadius: 4,
      padding: 5,
      marginTop: 4,
   },
   stepTipText: {
      fontSize: 8,
      color: "#78350f",
      lineHeight: 1.35,
   },

   // Tips & Tricks Box
   tipsCard: {
      backgroundColor: "#fff8f5",
      borderWidth: 1,
      borderColor: "#f0c4bd",
      borderRadius: 8,
      padding: 10,
      marginBottom: 14,
   },
   tipsHeader: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: "#d13228",
      marginBottom: 6,
      textTransform: "uppercase",
   },
   tipItem: {
      fontSize: 8.5,
      color: "#44403c",
      marginBottom: 4,
      lineHeight: 1.35,
   },

   // Substitutions Section
   substitutionsCard: {
      backgroundColor: "#fafaf9",
      borderWidth: 1,
      borderColor: "#e7e5e4",
      borderRadius: 8,
      padding: 10,
      marginBottom: 14,
   },
   substitutionsHeader: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: "#1c1917",
      marginBottom: 6,
      textTransform: "uppercase",
   },
   subItem: {
      marginBottom: 4,
   },
   subOriginal: {
      fontSize: 8.5,
      fontFamily: "Helvetica-Bold",
      color: "#d13228",
   },
   subAlternatives: {
      fontSize: 8,
      color: "#57534e",
   },

   // Footer
   footer: {
      position: "absolute",
      bottom: 20,
      left: 36,
      right: 36,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: "#f5f5f4",
      paddingTop: 8,
   },
   footerText: {
      fontSize: 8,
      color: "#a8a29e",
   },
});

export function RecipePDF({ recipe }: RecipePDFProps) {
   const prep = parseInt(String(recipe.prepTime ?? 0), 10) || 0;
   const cook = parseInt(String(recipe.cookTime ?? 0), 10) || 0;
   const totalTime = prep + cook;

   // Categorize ingredients if category is provided
   const ingredientsByCategory = recipe.ingredients.reduce<
      Record<string, { item: string; amount: string }[]>
   >((acc, ing) => {
      const cat = ing.category ? capitalize(ing.category) : "All Ingredients";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ing);
      return acc;
   }, {});

   return (
      <Document>
         <Page size="A4" style={styles.page}>
            {/* Top Brand Header */}
            <View style={styles.brandHeader}>
               <Text style={styles.brandLogo}>SERVD</Text>
               <Text style={styles.brandTagline}>Your Personal AI Chef</Text>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
               <View style={styles.badgeRow}>
                  {recipe.cuisine && (
                     <View style={styles.badge}>
                        <Text style={styles.badgeText}>{capitalize(recipe.cuisine)}</Text>
                     </View>
                  )}
                  {recipe.category && (
                     <View style={styles.badge}>
                        <Text style={styles.badgeText}>{capitalize(recipe.category)}</Text>
                     </View>
                  )}
               </View>

               <Text style={styles.title}>{recipe.title}</Text>

               {recipe.description && (
                  <Text style={styles.description}>{recipe.description}</Text>
               )}

               {recipe.imageUrl ? (
                  <View style={styles.recipeImageContainer}>
                     <Image
                        src={recipe.imageUrl}
                        style={styles.recipeImage}
                     />
                  </View>
               ) : null}
            </View>

            {/* Stats Bar */}
            <View style={styles.statsBar}>
               <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Prep Time</Text>
                  <Text style={styles.statValue}>
                     {prep > 0 ? `${prep} min` : "—"}
                  </Text>
               </View>

               <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Cook Time</Text>
                  <Text style={styles.statValue}>
                     {cook > 0 ? `${cook} min` : "—"}
                  </Text>
               </View>

               <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Time</Text>
                  <Text style={styles.statValue}>
                     {totalTime > 0 ? `${totalTime} min` : "—"}
                  </Text>
               </View>

               <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Servings</Text>
                  <Text style={styles.statValue}>{recipe.servings ?? "—"}</Text>
               </View>

               <View style={styles.statItemLast}>
                  <Text style={styles.statLabel}>Calories</Text>
                  <Text style={styles.statValue}>
                     {recipe.nutrition?.calories
                        ? `${recipe.nutrition.calories} kcal`
                        : "—"}
                  </Text>
               </View>
            </View>

            {/* Ingredients & Nutrition Row */}
            <View style={styles.twoColumnRow}>
               {/* Left: Ingredients */}
               <View style={styles.leftColumn}>
                  <Text style={styles.sectionHeading}>Ingredients</Text>

                  {Object.entries(ingredientsByCategory).map(
                     ([cat, items], catIdx) => (
                        <View key={catIdx} style={{ marginBottom: 6 }}>
                           {Object.keys(ingredientsByCategory).length > 1 && (
                              <Text style={styles.ingredientCategoryTitle}>
                                 {cat}
                              </Text>
                           )}
                           {items.map((ing, i) => (
                              <View key={i} style={styles.ingredientRow}>
                                 <Text style={styles.ingredientName}>
                                    • {capitalize(ing.item)}
                                 </Text>
                                 <Text style={styles.ingredientAmount}>
                                    {ing.amount}
                                 </Text>
                              </View>
                           ))}
                        </View>
                     )
                  )}
               </View>

               {/* Right: Nutrition Overview */}
               <View style={styles.rightColumn}>
                  {recipe.nutrition ? (
                     <View style={styles.nutritionCard}>
                        <Text style={styles.nutritionTitle}>
                           Nutrition / Serving
                        </Text>
                        <View style={styles.nutritionGrid}>
                           <View style={styles.nutritionPill}>
                              <Text style={styles.nutritionLabel}>Calories</Text>
                              <Text style={styles.nutritionValue}>
                                 {recipe.nutrition.calories ?? "—"}
                              </Text>
                           </View>
                           <View style={styles.nutritionPill}>
                              <Text style={styles.nutritionLabel}>Protein</Text>
                              <Text style={styles.nutritionValue}>
                                 {recipe.nutrition.protein ?? "—"}
                              </Text>
                           </View>
                           <View style={styles.nutritionPill}>
                              <Text style={styles.nutritionLabel}>Carbs</Text>
                              <Text style={styles.nutritionValue}>
                                 {recipe.nutrition.carbs ?? "—"}
                              </Text>
                           </View>
                           <View style={styles.nutritionPill}>
                              <Text style={styles.nutritionLabel}>Fat</Text>
                              <Text style={styles.nutritionValue}>
                                 {recipe.nutrition.fat ?? "—"}
                              </Text>
                           </View>
                        </View>
                     </View>
                  ) : null}

                  {/* Substitutions preview in right column if space allows */}
                  {recipe.substitutions && recipe.substitutions.length > 0 && (
                     <View style={[styles.substitutionsCard, { marginTop: 8 }]}>
                        <Text style={styles.substitutionsHeader}>
                           Substitutions
                        </Text>
                        {recipe.substitutions.slice(0, 3).map((sub, i) => (
                           <View key={i} style={styles.subItem}>
                              <Text style={styles.subOriginal}>
                                 Instead of {capitalize(sub.original)}:
                              </Text>
                              <Text style={styles.subAlternatives}>
                                 {sub.alternatives.map(capitalize).join(", ")}
                              </Text>
                           </View>
                        ))}
                     </View>
                  )}
               </View>
            </View>

            {/* Step-by-Step Instructions */}
            <View style={styles.instructionContainer}>
               <Text style={styles.sectionHeading}>
                  Step-by-Step Instructions
               </Text>

               {(recipe.instructions ?? []).map((step) => (
                  <View
                     key={step.step}
                     style={styles.instructionStep}
                     wrap={false}
                  >
                     <View style={styles.stepBadge}>
                        <Text style={styles.stepNumber}>{step.step}</Text>
                     </View>
                     <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>{step.title}</Text>
                        <Text style={styles.stepText}>{step.instruction}</Text>
                        {step.tip && (
                           <View style={styles.stepTipCard}>
                              <Text style={styles.stepTipText}>
                                 Chef&apos;s Tip: {step.tip}
                              </Text>
                           </View>
                        )}
                     </View>
                  </View>
               ))}
            </View>

            {/* Chef's Tips & Tricks (if present) */}
            {recipe.tips && recipe.tips.length > 0 && (
               <View style={styles.tipsCard} wrap={false}>
                  <Text style={styles.tipsHeader}>
                     Chef&apos;s Tips & Tricks
                  </Text>
                  {recipe.tips.map((tip, i) => (
                     <Text key={i} style={styles.tipItem}>
                        • {tip}
                     </Text>
                  ))}
               </View>
            )}

            {/* Footer fixed on all pages */}
            <View style={styles.footer} fixed>
               <Text style={styles.footerText}>
                  Created with Servd • servd.app
               </Text>
               <Text
                  style={styles.footerText}
                  render={({ pageNumber, totalPages }) =>
                     `Page ${pageNumber} of ${totalPages}`
                  }
               />
            </View>
         </Page>
      </Document>
   );
}
