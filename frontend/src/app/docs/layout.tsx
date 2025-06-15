
// filepath: /Users/julianstosse/Developer/zuma/frontend/src/app/docs/layout.tsx
import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24"> {/* pt-24 to offset fixed navbar */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
