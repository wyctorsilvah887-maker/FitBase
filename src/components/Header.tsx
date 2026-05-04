
"use client";

import { PawPrint, User, LogOut, LogIn, LayoutDashboard } from "lucide-react";
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
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <header className="relative z-10 max-w-7xl mx-auto px-6 py-10 flex items-center justify-end">
      {/* Logo Centralizada */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <PawPrint className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-headline font-bold tracking-tighter text-white">
            Vet <span className="text-primary italic">IA</span>
          </h1>
        </Link>
      </div>

      {/* Ações do Usuário (Direita) */}
      <div className="flex items-center gap-4">
        {!isUserLoading && (
          user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-white/5 border border-white/5 transition-all">
                  <User className="w-5 h-5 text-zinc-400 group-hover:text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-900 text-white rounded-[1.5rem] w-64 p-3 shadow-2xl">
                <DropdownMenuLabel className="px-4 py-3 space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">Sessão Ativa</p>
                  <p className="text-[10px] font-bold truncate text-zinc-400">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-900 mx-1" />
                <DropdownMenuItem asChild className="rounded-xl px-4 py-3 focus:bg-white/5 cursor-pointer mt-1">
                  <Link href="/profile" className="flex items-center gap-3 w-full">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl px-4 py-3 focus:bg-white/5 cursor-pointer">
                  <Link href="/" className="flex items-center gap-3 w-full">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Painel Inicial</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-900 mx-1" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl px-4 py-3 text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer mt-1">
                  <LogOut className="w-4 h-4 mr-3" />
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
