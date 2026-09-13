---
type: session
slug: cross-origin-storage-api
title: "The Cross-Origin Storage API"
speakerSlug: thomas-steiner
time: "12:10"
end: "12:50"
day: 1
draft: false
lang: en
locale: en
---

Today, every website downloads and stores its own copy of large files like AI models, WebAssembly modules, Web fonts, and popular JavaScript libraries. If two websites use the same file, the browser downloads it twice.

In this talk, Thomas Steiner presents the Cross-Origin Storage (COS) API — a proposed shared cache where files are identified by their SHA-256 hash, not by URL. I show both the imperative JavaScript API and the declarative forms via import attributes, HTML, and CSS, with live demos.

After this talk, attendees will know how to use COS in their own projects to avoid redundant downloads and reduce storage use across the web.
