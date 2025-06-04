import { Readability } from "@mozilla/readability"

import {
  cleanHtml,
  cleanTitle,
  convertToAbsoluteUrl,
  sanitizeContent
} from "../utils/htmlUtils.js"
import { fetchThroughBackground } from "./fetchProxy"

type ArticleResponse = {
  title: string
  content: string
  url: string
  image: string
}

// Helper function to strip query parameters from URL
function stripQueryParams(url: string): string {
  return url.split("?")[0]
}

interface ExtendedReadability extends Readability {
  _topCandidate?: Element
}

export async function parseArticle(url: string): Promise<ArticleResponse> {
  if (!url) {
    throw new Error("URL is required")
  }

  try {
    // Fetch the article content through the background service worker
    const html = await fetchThroughBackground(url)

    // Remove style tags to prevent CSS parsing errors
    const cleanedHtml = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")

    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(cleanedHtml, "text/html")

    // Try to get the title from meta tags first
    let title = ""
    const metaTitle =
      doc.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
      doc
        .querySelector('meta[name="twitter:title"]')
        ?.getAttribute("content") ||
      doc.querySelector("title")?.textContent

    if (metaTitle) {
      title = cleanTitle(metaTitle)
    }

    const reader = new Readability(doc, {
      charThreshold: 20,
      classesToPreserve: ["article-image", "article-content"],
      keepClasses: false
    }) as ExtendedReadability

    const article = reader.parse()

    if (!article) {
      throw new Error("Could not parse article")
    }

    // If we don't have a title from meta tags, use the one from Readability
    if (!title) {
      title = cleanTitle(article.title)
    }

    // Try to find the main image
    let mainImage = ""

    // First try meta tags
    const metaImage =
      doc.querySelector('meta[property="og:image"]')?.getAttribute("content") ||
      doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content")

    if (metaImage) {
      mainImage = convertToAbsoluteUrl(metaImage, url)
    } else if (reader._topCandidate) {
      // Then try the top candidate element
      const images = reader._topCandidate.getElementsByTagName("img")
      if (images.length > 0) {
        const src = images[0].getAttribute("src")
        if (src) {
          mainImage = convertToAbsoluteUrl(src, url)
        }
      }
    }

    // Clean the HTML content and convert all image URLs to absolute
    const tempDoc = parser.parseFromString(article.content, "text/html")
    const images = tempDoc.getElementsByTagName("img")
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      const src = img.getAttribute("src")
      if (src) {
        const absoluteSrc = convertToAbsoluteUrl(src, url)
        // Remove the image if it matches the main image (ignoring query parameters)
        if (stripQueryParams(absoluteSrc) === stripQueryParams(mainImage)) {
          img.remove()
          continue
        }
        img.setAttribute("src", absoluteSrc)
      }
    }

    const cleanedContent = cleanHtml(tempDoc.body.innerHTML)
    const sanitizedContent = sanitizeContent(cleanedContent)

    return {
      title: title,
      content: sanitizedContent,
      url: url,
      image: mainImage
    }
  } catch (error) {
    console.error("Error parsing article:", error)
    throw error
  }
}
