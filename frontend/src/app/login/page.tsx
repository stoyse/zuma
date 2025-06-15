import LoginForm from '@/components/login/LoginForm';
import PublicNavbar from "@/components/PublicNavbar"; // Importiere die PublicNavbar

export default function LoginPage() {
  return (
    <div>
      <PublicNavbar /> {/* Füge die PublicNavbar hier ein */}
      <main style={{ paddingTop: "80px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 80px - 78px)" }}> {/* Füge Padding hinzu und zentriere den Inhalt */}
        <LoginForm />
      </main>
    </div>
  );
}
