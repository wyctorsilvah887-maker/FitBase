
"use client";

import { PawPrint, User, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <header className="relative z-10 max-w-7xl mx-auto px-6 py-10 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2 group cursor-pointer">
        <PawPrint className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-headline font-bold tracking-tighter text-white">
          Vet <span className="text-primary italic">IA</span>
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {!isUserLoading && (
          user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-white/5 border border-white/5">
                  <User className="w-5 h-5 text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-900 text-white rounded-2xl w-56 p-2">
                <DropdownMenuLabel className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-900" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl px-3 py-2.5 text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Sair da Conta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary hover:bg-transparent">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </Link>
          )
        )}
      </div>
    </header>
  );
}
