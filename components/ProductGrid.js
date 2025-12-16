"use client";

import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

export default function ProductGrid({ products, layout = "scroll" }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className={layout === "grid" ? "product-grid" : "product-scroll"}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((p, index) => (
        <motion.div key={p.id} variants={itemVariants}>
          <ProductCard
            product={p}
            onViewDetails={() => {}} // Not used anymore
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
