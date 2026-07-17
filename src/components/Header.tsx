
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
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const isLoginPage = pathname === '/login';

  return (
    <header className="relative z-10 max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
      {/* Lado Esquerdo - Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <PawPrint className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-headline font-bold tracking-tighter text-foreground">
            Vet <span className="text-primary italic">IA</span>
          </h1>
        </Link>
      </div>

      {/* Ações do Usuário e Tema (Direita) */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        {!isUserLoading && (
          user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-accent/50 border border-border/50 transition-all">
                  <User className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground rounded-[1.5rem] w-64 p-3 shadow-2xl">
                <DropdownMenuLabel className="px-4 py-3 space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sessão Ativa</p>
                  <p className="text-[10px] font-bold truncate opacity-80">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border mx-1" />
                <DropdownMenuItem asChild className="rounded-xl px-4 py-3 focus:bg-accent cursor-pointer mt-1">
                  <Link href="/profile" className="flex items-center gap-3 w-full">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl px-4 py-3 focus:bg-accent cursor-pointer">
                  <Link href="/" className="flex items-center gap-3 w-full">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Painel Inicial</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border mx-1" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl px-4 py-3 text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer mt-1">
                  <LogOut className="w-4 h-4 mr-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Sair da Conta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isLoginPage && (
              <Link href="/login">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-transparent">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )
          )
        )}
      </div>
    </header>
  );
}
