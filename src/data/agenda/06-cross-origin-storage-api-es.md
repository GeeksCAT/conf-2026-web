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
locale: es
---

Hoy en día, cada sitio web descarga y almacena su propia copia de archivos grandes como modelos de IA, módulos WebAssembly, fuentes web y librerías JavaScript populares. Si dos sitios usan el mismo archivo, el navegador lo descarga dos veces.

En esta charla, Thomas Steiner presenta la Cross-Origin Storage (COS) API: una propuesta de caché compartida donde los archivos se identifican por su hash SHA-256 en lugar de su URL. Se mostrará tanto la API imperativa de JavaScript como las formas declarativas mediante atributos de importación, HTML y CSS, con demos en vivo.

Tras esta sesión, sabrás cómo usar COS en tus proyectos para evitar descargas redundantes y optimizar almacenamiento en la web.
