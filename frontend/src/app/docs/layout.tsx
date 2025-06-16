// filepath: /Users/julianstosse/Developer/zuma/frontend/src/app/docs/layout.tsx
import PublicNavbar from "@/components/PublicNavbar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <PublicNavbar />
      <main style={{ paddingTop: "100px", paddingBottom: "4rem" }}>
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
}
