---
type: session
slug: el-teu-agents-md-es-una-mentida
title: "El teu AGENTS.md és una mentida (i aquí tens com solucionar-ho)"
speakerSlug: dario-castane
time: "16:25"
end: "17:05"
day: 1
draft: false
lang: ca
locale: ca
---

Vas escriure l'AGENTS.md. Vas documentar les convencions de gestió d'errors, l'estructura del paquet, els patrons d'interfície. I llavors l'agent et va ignorar.

Els fitxers d'instruccions són guies inferencials: l'agent els interpreta probabilísticament, els compara amb tot el que hi ha a la finestra de context i fa una valoració. Aquesta decisió és prou errònia sovint com per importar, i es degrada encara més a mesura que les tasques es tornen complexes. Un AGENTS.md millor només mou el sostre.

La solució és entendre què és un arnès. Agent = Model + Arnès: l'arnès combina guies (què dirigeix abans que l'agent actuï) i sensors (què observa i corregeix després), tots dos en un espectre que va des de l'inferencial fins al computacional.

Explorarem les millors pràctiques: connectar hooks d'agent per forçar el linting en cada escriptura de fitxers, escriure analitzadors personalitzats que converteixin les convencions en errors de compilació, estructurar proves basades en taules com a especificacions que l'agent ha de satisfer i més.

El teu AGENTS.md és una mentida. El teu arnès no ho és.
