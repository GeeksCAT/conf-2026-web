---
# Unique identifier (kebab-case, matches filename)
slug: "example-speaker"

# Full name
name: "Example Speaker Name"

# Job title or role
role: "Senior Software Engineer"

# Social and contact links (all optional)
# web, mastodon and bluesky take a full URL; x, linkedin and github take
# just the handle.
links:
  web: "https://example.com"
  x: "examplehandle"
  linkedin: "example-profile"
  github: "exampleuser"
  mastodon: "https://mastodon.social/@examplehandle"
  bluesky: "https://bsky.app/profile/example.com"

# Path to speaker photo (place image in /public/assets/speakers/)
photo: "/assets/speakers/example-speaker.jpg"

# Multi-line bio using YAML pipe syntax
bio: |
  First paragraph of the speaker's bio. Describe their background, expertise, and current work.

  Second paragraph can highlight achievements, interests, or speaking topics.

# Topic - choose one: open-source, devops-sre, ai-data, soft-engineering, leadership
topic: "devops-sre"

# Language/locale: ca (Catalan), en (English), or es (Spanish)
locale: "ca"

# Draft flag - set to false when ready to publish
draft: true
---

Optional additional content or notes about the speaker (not currently used in schema).
