"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AppLogo } from "../AppLogo";
import EmailInput from "../EmailInput";
import PasswordInput from "../PasswordInput";
import { signUpSchema } from "../validationSchema";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/app/stores/useUserStore";

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const { toast } = useToast();
  const router = useRouter();

  const { signUpFunction, isLoading } = useUserStore();

  const onSubmit = async (data: SignUpFormData) => {
    const res = await signUpFunction({
      email: data.email,
      password: data.password,
    });

    if (res.result) {
      toast({
        title: "Registro exitoso",
        description: "Has creado tu cuenta satisfactoriamente",
      });
      router.push("/tasks");
    } else if (res.error) {
      toast({
        title: res.error,
        description:
          "Este correo ya está registrado, por favor inicia sesión con un correo diferente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error al registrarse",
        description: "Ha ocurrido un error en el registro",
        variant: "destructive",
      });
    }
  };

  const handleErrorsToast = () => {
    const { errors } = methods.formState;
    const errorFields = ["email", "password", "confirmPassword"] as const;

    errorFields.forEach((field) => {
      if (errors[field]) {
        toast({
          title: "Error en la validación",
          description: errors[field]?.message?.toString(),
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div>
      <AppLogo />
      <Card className="w-full max-w-sm py-2">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit, handleErrorsToast)}>
            <CardHeader>
              <CardTitle className="text-[22px] font-bold">Registro</CardTitle>
              <CardDescription>
                Registrate gratis en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 mt-3">
              <EmailInput name="email" label="Correo electrónico" />
              <PasswordInput name="password" label="Contraseña" />
              <PasswordInput name="confirmPassword" label="confirmar contraseña" />
              <div className="mt-4 text-sm flex items-center justify-center gap-1">
                <span>¿Ya tienes una cuenta?</span>
                <Label className="text-primary">
                  <Link href="/">Iniciar sesión</Link>
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                {isLoading ? "Cargando..." : "Crear una cuenta"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
