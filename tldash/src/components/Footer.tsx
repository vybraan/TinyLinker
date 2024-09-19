export default function Footer() {
  return(
    <footer className="footer footer-center bg-base-300 text-base-content p-4">
      <aside>
        <p>Copyright © {new Date().getFullYear()} - All right reserved by <a className="font-bold lead prose" href="github.com/vybraan"> vybraan</a></p>
      </aside>
    </footer>
  );
}
