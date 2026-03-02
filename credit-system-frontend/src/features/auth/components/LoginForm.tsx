"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLogin } from "../hooks/useLogin";
import { useForm } from "react-hook-form";
import clsx from "clsx";

type FormInputs = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const { handleLogin, loading, error } = useLogin();

  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
    reset,
  } = useForm<FormInputs>({});

  const onSubmit = (data: FormInputs) => {
    handleLogin(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          type="email"
          placeholder="correo@empresa.com"
          className={clsx("h-11", {
            "border-red-500": errors.email,
          })}
          {...register("email", { required: true })}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          className={clsx("h-11", {
            "border-red-500": errors.password,
          })}
          {...register("password", { required: true })}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Button */}
      <Button disabled={!isValid} className="w-full h-11 text-base font-medium">
        {loading ? "Cargando..." : "Ingresar"}
      </Button>
    </form>
  );
};
