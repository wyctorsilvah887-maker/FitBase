
"use client";

import { Wind, User, LogOut, LogIn, LayoutDashboard, UserPlus } from "lucide-react";
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
  const isRegisterPage = pathname === '/register';

  return (
    <header className="relative z-50 max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
      {/* Lado Esquerdo - Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
             <Wind className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tighter text-foreground uppercase">
            Clima <span className="text-primary italic">IA</span>
          </h1>
        </Link>
      </div>

      {/* Ações do Usuário e Tema (Direita) */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        {!isUserLoading && (
          user && !user.isAnonymous ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-2xl h-11 w-11 p-0 hover:bg-accent/50 border-2 border-border/50 transition-all overflow-hidden relative group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <User className="w-5 h-5 text-muted-foreground group-hover:text-primary relative z-10" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-2 border-border text-popover-foreground rounded-[2rem] w-64 p-3 shadow-2xl animate-in fade-in zoom-in duration-300">
                <DropdownMenuLabel className="px-4 py-4 space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Especialista Clima IA</p>
                  <p className="text-[11px] font-bold truncate opacity-80">{user.email}</p>
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
                    <span className="text-[10px] font-black uppercase tracking-widest">Painel Técnico</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border mx-1" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl px-4 py-3 text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer mt-1">
                  <LogOut className="w-4 h-4 mr-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Encerrar Sessão</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isLoginPage && !isRegisterPage && (
              <div className="flex gap-2">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest hover:bg-accent">
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-xl h-10 px-6 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Começar Agora
                  </Button>
                </Link>
              </div>
            )
          )
        )}
      </div>
    </header>
  );
}
