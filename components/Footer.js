import Link from "next/link";
<<<<<<< HEAD
import { motion } from "framer-motion";

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.footer
      className="footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="footer-cols">
        <motion.div variants={itemVariants}>
          <h4>Clothify</h4>
          <p>Your everyday fashion partner.</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h4>Help</h4>
          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link href="/faq">FAQ</Link>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link href="/returns">Returns</Link>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link href="/shipping">Shipping</Link>
          </motion.div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h4>Account</h4>
          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link href="/login">Login</Link>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link href="/register">Register</Link>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link href="/wishlist">My Wishlist</Link>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link href="/orders">Track Orders</Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
=======

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cols">
        <div>
          <h4>Clothify</h4>
          <p>Your everyday fashion partner.</p>
        </div>
        <div>
          <h4>Help</h4>
          <Link href="/faq">FAQ</Link>
          <Link href="/returns">Returns</Link>
          <Link href="/shipping">Shipping</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <Link href="/orders">Track Orders</Link>
        </div>
      </div>
    </footer>
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
  );
}
