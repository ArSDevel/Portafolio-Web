# Ath · Portafolio (@HolandaMexico)

Portafolio de modelado 3D, building y scripting en Luau para Roblox.
Hecho con **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, **Keystatic** (panel de contenido), **Shiki** (resaltado de Luau) y **Three.js** (visor 3D).

---

## 1. Arrancar en tu PC

```bash
npm install      # solo la primera vez
npm run dev
```

Abre <http://localhost:3000>. No cierres la terminal mientras trabajas (`Ctrl + C` lo detiene).

| Comando         | Para qué sirve                                          |
| --------------- | ------------------------------------------------------- |
| `npm run dev`   | Modo desarrollo: la página se actualiza al guardar      |
| `npm run build` | Compila como en Vercel (útil para detectar errores)     |
| `npm run lint`  | Revisa el código en busca de problemas                  |

## 2. Publicar contenido (panel)

Entra a <http://localhost:3000/keystatic>.

- **Modelado 3D**: imágenes, galería, archivo `.glb` (Blender → *File → Export → glTF 2.0*, formato *glb*) e imágenes de antes/después. Los triángulos, vértices y materiales se cuentan solos desde el `.glb`.
- **Building**: imágenes, video de YouTube y el **Place ID** de la experiencia (el número de `roblox.com/games/ESTE_NÚMERO/...`), que muestra visitas y jugadores en vivo.
- **Scripting**: pega cada script, elige su tipo (Script, LocalScript, ModuleScript) y su ubicación (ServerScriptService, ReplicatedStorage…). Escribe las **líneas a resaltar** como `3-5, 12`.
- **Perfil y contacto**: disponibilidad, texto "Sobre mí" y tus enlaces (Discord, Roblox, Talent Hub…).

Cada proyecto tiene título, resumen y descripción en **español e inglés**. Si dejas el inglés vacío, se muestra el español.

Marca **Destacado** para que el proyecto aparezca en la página de inicio.

> En tu PC el panel guarda directamente en las carpetas `content/` y `public/content/`.

## 3. Publicar en Vercel

### 3.1 Subir el código a GitHub
1. Crea una cuenta en GitHub y **activa la verificación en dos pasos**.
2. Crea un repositorio nuevo (puede ser privado), en este proyecto: `ArSDevel/Portafolio-Web`.
3. Sube el proyecto:
   ```bash
   git add .
   git commit -m "Primera versión del portafolio"
   git remote add origin https://github.com/ArSDevel/Portafolio-Web.git
   git push -u origin main
   ```

### 3.2 Conectar Vercel
1. Entra a <https://vercel.com> con tu cuenta de GitHub.
2. **Add New → Project** → elige el repositorio → **Deploy**. No hace falta cambiar nada.
3. Cada `git push` a `main` vuelve a publicar el sitio.

### 3.3 Activar el panel seguro (solo tú puedes editar)
En producción el panel usa **GitHub** para iniciar sesión: solo las cuentas con permiso de escritura en tu repositorio pueden guardar cambios.

1. En tu PC crea un archivo `.env.local` con:
   ```
   NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=ArSDevel/Portafolio-Web
   ```
2. Ejecuta `npm run build` y luego `npm start`, y abre <http://localhost:3000/keystatic>.
3. Keystatic te guiará para **crear una GitHub App**. Al terminar, escribe en un archivo `.env` las variables `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` y `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
4. Copia **esas 4 variables + `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO`** en Vercel: *Project → Settings → Environment Variables*.
5. En la configuración de la GitHub App (GitHub → Settings → Developer settings → GitHub Apps) agrega como *Callback URL*:
   `https://TU-SITIO.vercel.app/api/keystatic/github/oauth/callback`
6. Vuelve a desplegar en Vercel. Ya puedes editar desde `https://TU-SITIO.vercel.app/keystatic`.

Cada cambio guardado desde el panel crea un *commit* en GitHub y Vercel publica la nueva versión en uno o dos minutos.

> ⚠️ Nunca subas los archivos `.env` o `.env.local` a GitHub (ya están ignorados). Solo `.env.example` se sube, y no lleva secretos.

### 3.4 Dominio propio (opcional)
En Vercel: *Settings → Domains*. Después agrega la variable `NEXT_PUBLIC_SITE_URL=https://tudominio.com`.

## 4. Estructura

```
content/                 ← tus proyectos (los escribe el panel)
public/content/          ← imágenes y modelos .glb
keystatic.config.ts      ← campos del panel
src/
├─ app/[locale]/         ← páginas en /es y /en
├─ components/
│  ├─ code/              ← explorador de scripts estilo Studio
│  ├─ model/             ← visor 3D y comparador antes/después
│  ├─ project/           ← tarjetas, galería, cabeceras
│  └─ home/              ← secciones de la página de inicio
├─ i18n/dictionaries/    ← textos fijos del sitio (es.json / en.json)
├─ data/stack.ts         ← lista de herramientas
└─ lib/                  ← lectura de contenido, resaltado Luau, API de Roblox
```
