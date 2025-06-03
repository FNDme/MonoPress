import ConfigPage from "@/components/pages/config-page"
import FeedPage from "@/components/pages/feed-page"
import ReaderPage from "@/components/pages/reader-page"
import SingleFeedPage from "@/components/pages/single-feed-page"
import { ThemeProvider } from "@/context/theme-context"
import { HashRouter, Route, Routes } from "react-router-dom"

import { RssProvider } from "./context/rss-context"

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <RssProvider>
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/reader/:url" element={<ReaderPage />} />
            <Route path="/feed/:url" element={<SingleFeedPage />} />
          </Routes>
        </RssProvider>
      </ThemeProvider>
    </HashRouter>
  )
}

export default App
