import Link from "next/link"
import { getCategoriesForFooter } from "@/lib/database/services/supabase-categories"
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react"

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const categories = await getCategoriesForFooter(4)

  return (
    <footer className="w-full bg-white border-t border-border">
      {/* Main Footer */}
      <div className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 md:grid-cols-5 mb-12">
            {/* Brand Column */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-lg font-bold text-foreground">PartyVilla</span>
              </div>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Your premier destination for premium party supplies and celebration essentials.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a href="https://www.facebook.com/share/1Ghcdcide2" className="text-foreground/60 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/party_.villa" className="text-foreground/60 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://youtube.com/@partyvilla-n1f?si=yccgBo8uk02oXjRC" className="text-foreground/60 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Quick Links</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/" className="text-foreground/70 hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-foreground/70 hover:text-primary transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-foreground/70 hover:text-primary transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="text-foreground/70 hover:text-primary transition-colors">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Categories</h3>
              <ul className="space-y-2.5 text-sm">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/category/${category.slug}`} className="text-foreground/70 hover:text-primary transition-colors">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Contact</h3>
              <div className="space-y-3 text-sm">
                <a href="mailto:partyvilla.store@gmail.com" className="flex items-start gap-3 text-foreground/70 hover:text-primary transition-colors group">
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                  <span className="break-all">partyvilla.store@gmail.com</span>
                </a>
                <div className="flex items-start gap-3 text-foreground/70">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Shop no. 15, Hong kong Arcade, Near Shiva Complex, Maharashtra - 410206</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Newsletter</h3>
              <p className="text-sm text-foreground/60">Subscribe for updates and exclusive offers</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button className="px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50"></div>

          {/* Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-foreground/50">
              © {currentYear} PartyVilla. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-foreground/50">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Return Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

