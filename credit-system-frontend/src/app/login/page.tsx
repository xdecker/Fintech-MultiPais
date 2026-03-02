import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted/40 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-muted/40">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Iniciar sesión
          </CardTitle>

          <CardDescription>
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
