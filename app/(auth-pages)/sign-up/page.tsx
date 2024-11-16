"use client";

import { signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fetchCountries } from "@/utils/supabase/fetchCountries";
import { Message } from "postcss/lib/result";

interface Country {
  country_code: string;
  country_name: string;
}

export default function Signup(props: { searchParams: Message }) {
  const { searchParams } = props;
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const getCountries = async () => {
      const data = await fetchCountries();
      setCountries(data);
    };

    getCountries();
  }, []);

  const handleCountryChange = (code: string) => {
    const country = countries.find((c) => c.country_code === code);
    if (country) {
      setSelectedCountry(country.country_name);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (selectedCountry) {
      formData.append("country", selectedCountry);
    }

    await signUpAction(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 className="text-2xl font-medium">Sign up</h1>
      <p className="text-sm text-foreground">
        Already have an account?{" "}
        <Link className="text-primary font-medium underline" href="/sign-in">
          Sign in
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />

        <Label htmlFor="Username">Username</Label>
        <Input
          type="text"
          name="Username"
          placeholder="Your Username"
          minLength={6}
          required
        />

        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          minLength={6}
          required
        />

        <div className="space-y-1">
          <label htmlFor="country" className="text-sm font-medium leading-none">
            Country
          </label>
          <Select onValueChange={handleCountryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.country_code} value={country.country_code}>
                  <div className="flex items-center">
                
                    {country.country_name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <SubmitButton pendingText="Signing up...">Sign up</SubmitButton>
        
      </div>
    </form>
  );
}
