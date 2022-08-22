import { escape as escapeText } from "html-escaper";
import TurndownService from "turndown";
import { NoteFormat } from "./types";
import xss from "xss";

/**
 * Override TurndownService to prevent escaping
 */
class SafeTurndownService extends TurndownService {
  // be default, turndown escapes anything that looks like a markdown control
  // character (like `[` or `#`). I see the logic in this, but actually I feel
  // like for our purposes, if you have markdown-like html, you actually want to
  // have that seen as markdown after you convert? Also, it knackers foundry
  // link codes (which can be rectified, admittedly) and when we use turndown to
  // generate "plain text" we certainly don't want anything escaped.
  escape (text: string) {
    return text;
  }
}

/**
 * actual turndownservice object for later use
 */
const turndownService = new SafeTurndownService();

// /////////////////////////////////////////////////////////////////////////////
// Converters
// /////////////////////////////////////////////////////////////////////////////

export function plainTextToHtml (source: string) {
  return escapeText(source).replace(/\n/g, "<br/>");
}

async function markdownToHtml (markdown: string) {
  const { marked } = await import("marked");
  return marked(markdown);
}

export function htmlToMarkdown (html: string) {
  // ever first-time a cool regex and then realise you don't need it, but
  // you're so proud of your ninja regex skills dating back to doing Perl in the
  // 90s that you want to leave it in as a comment? Anyway check this bad boy
  // out. Turns out I don't need it because I've overridden turndown to stop it
  // doing any escaping at all.
  // return turndown(source).replace(/@(\w+)\\\[(\w+)\\\]\{([^}]*)\}/g, (m, p1, p2, p3) => `@${p1}[${p2}]{${p3}}`);
  return turndownService.turndown(html);
}

export function htmlToPlaintext (html: string) {
  return htmlToMarkdown(html);
}

export async function convertNotes (oldFormat: NoteFormat, newFormat: NoteFormat, oldSource: string) {
  let newSource = "";
  let unsafeNewHtml = "";
  if (newFormat === NoteFormat.plain) {
    if (oldFormat === NoteFormat.markdown || oldFormat === NoteFormat.plain) {
      newSource = oldSource;
    } else if (oldFormat === NoteFormat.richText) {
      newSource = htmlToPlaintext(oldSource);
    }
    unsafeNewHtml = plainTextToHtml(newSource);
  } else if (newFormat === NoteFormat.markdown) {
    if (oldFormat === NoteFormat.plain || oldFormat === NoteFormat.markdown) {
      newSource = oldSource;
    } else if (oldFormat === NoteFormat.richText) {
      newSource = htmlToMarkdown(oldSource);
    }
    unsafeNewHtml = await markdownToHtml(newSource);
  } else if (newFormat === NoteFormat.richText) {
    if (oldFormat === NoteFormat.plain) {
      newSource = plainTextToHtml(oldSource);
    } else if (oldFormat === NoteFormat.markdown) {
      newSource = await markdownToHtml(oldSource);
    } else if (oldFormat === NoteFormat.richText) {
      newSource = oldSource;
    }
    unsafeNewHtml = newSource;
  }
  const newHtml = TextEditor.enrichHTML(xss(unsafeNewHtml));
  return { newSource, newHtml };
}

export async function toHtml (format: NoteFormat, source: string) {
  let newHtml = "";
  if (format === NoteFormat.plain) {
    newHtml = plainTextToHtml(source);
  } else if (format === NoteFormat.markdown) {
    newHtml = await markdownToHtml(source);
  } else if (format === NoteFormat.richText) {
    newHtml = source;
  }
  const html = TextEditor.enrichHTML(xss(newHtml));
  return html;
}
