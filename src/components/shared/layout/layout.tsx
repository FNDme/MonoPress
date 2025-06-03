import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-screen-lg flex-1 px-4 py-8 md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
