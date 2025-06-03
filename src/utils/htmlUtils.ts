import { JSDOM } from "jsdom"
import sanitizeHtml from "sanitize-html"

export function cleanHtml(html: string): string {
  const dom = new JSDOM(html)
  const doc = dom.window.document

  // Remove unnecessary elements
  const elementsToRemove = [
    "script",
    "style",
    "iframe",
    "noscript",
    "svg",
    "form",
    "button",
    "input",
    "select",
    "textarea",
    "nav",
    "footer",
    "header",
    "aside",
    "meta",
    "link",
    "comment"
  ]

  elementsToRemove.forEach((tag) => {
    const elements = doc.getElementsByTagName(tag)
    while (elements.length > 0) {
      elements[0].parentNode?.removeChild(elements[0])
    }
  })

  // Remove empty elements, but preserve images and their containers
  const allElements = doc.getElementsByTagName("*")
  for (let i = allElements.length - 1; i >= 0; i--) {
    const element = allElements[i]
    const tagName = element.tagName.toLowerCase()
    if (
      element.textContent?.trim() === "" &&
      !element.hasAttribute("src") &&
      tagName !== "img" &&
      tagName !== "figure" &&
      tagName !== "figcaption"
    ) {
      element.parentNode?.removeChild(element)
    }
  }

  // Clean up attributes while preserving necessary ones
  const elements = doc.getElementsByTagName("*")
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    const attributes = element.attributes
    const tagName = element.tagName.toLowerCase()

    // Keep different attributes based on element type
    const attributesToKeep: Record<string, string[]> = {
      img: ["src", "alt", "width", "height", "loading", "class", "style"],
      figure: ["class", "style"],
      figcaption: ["class", "style"],
      a: ["href", "target", "rel"],
      p: ["class", "style"],
      div: ["class", "style"],
      span: ["class", "style"],
      h1: ["class", "style"],
      h2: ["class", "style"],
      h3: ["class", "style"],
      h4: ["class", "style"],
      h5: ["class", "style"],
      h6: ["class", "style"],
      ul: ["class", "style"],
      ol: ["class", "style"],
      li: ["class", "style"],
      blockquote: ["class", "style"],
      pre: ["class", "style"],
      code: ["class", "style"]
    }

    // Remove all attributes except the ones we want to keep
    for (let j = attributes.length - 1; j >= 0; j--) {
      const attr = attributes[j]
      const keepAttrs = attributesToKeep[tagName] || []
      if (!keepAttrs.includes(attr.name)) {
        element.removeAttribute(attr.name)
      }
    }

    // Add loading="lazy" to images if not present
    if (tagName === "img" && !element.hasAttribute("loading")) {
      element.setAttribute("loading", "lazy")
    }
  }

  return doc.body.innerHTML
}

export function cleanTitle(title: string): string {
  if (!title) return ""

  // Remove any HTML tags
  title = title.replace(/<[^>]*>/g, "")

  // Remove CDATA sections
  title = title.replace(/<!\[CDATA\[|\]\]>/g, "")

  // Remove extra whitespace
  title = title.replace(/\s+/g, " ").trim()

  // Remove common title suffixes
  title = title.replace(/\s*[-|]\s*$/, "")

  return title
}

export function convertToAbsoluteUrl(url: string, baseUrl: string): string {
  if (!url) return ""
  if (url.startsWith("http")) return url

  try {
    return new URL(url, baseUrl).toString()
  } catch (e) {
    console.error("Error converting URL:", e)
    return url
  }
}

export function sanitizeContent(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "p",
      "a",
      "ul",
      "ol",
      "nl",
      "li",
      "b",
      "i",
      "strong",
      "em",
      "strike",
      "code",
      "hr",
      "br",
      "div",
      "table",
      "thead",
      "caption",
      "tbody",
      "tr",
      "th",
      "td",
      "pre",
      "img",
      "figure",
      "figcaption"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading", "class", "style"],
      "*": ["class", "style"]
    },
    allowedSchemes: ["http", "https", "mailto", "tel", "data"],
    allowedClasses: {
      "*": ["*"] // Allow all classes
    },
    transformTags: {
      a: (tagName, attribs) => {
        // Add rel="noopener noreferrer" to external links
        if (attribs.href && attribs.href.startsWith("http")) {
          return {
            tagName,
            attribs: {
              ...attribs,
              rel: "noopener noreferrer",
              target: "_blank"
            }
          }
        }
        return { tagName, attribs }
      },
      img: (tagName, attribs) => {
        // Ensure images have loading="lazy" and proper attributes
        return {
          tagName,
          attribs: {
            ...attribs,
            loading: "lazy",
            alt: attribs.alt || ""
          }
        }
      }
    }
  })
}
