import Footer from "./footer"
import Header from "./header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-h-screen min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto flex h-full w-full max-w-screen-lg flex-1 flex-col overflow-y-auto px-4 py-8 md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
