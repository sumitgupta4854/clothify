import Link from "next/link";

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
      <div className="footer-bottom">
        <p>&copy; 2024 Clothify. All rights reserved.</p>
      </div>
    </footer>
  );
}
