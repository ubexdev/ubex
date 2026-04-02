# Guía de Contribución — UBEX

## Branching Strategy

```
main (producción) ← Solo PRs desde develop
  └── develop (desarrollo) ← Feature branches se fusionan aquí
        ├── feature/nombre-feature
        ├── fix/nombre-bug
        └── chore/nombre-tarea
```

### Ramas principales

| Rama | Propósito | Deploy |
|------|-----------|--------|
| `main` | Producción estable | ubex.vercel.app |
| `develop` | Staging / pruebas | Preview automático en Vercel |

### Flujo de trabajo

1. **Crear rama** desde `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/mi-feature
   ```

2. **Desarrollar** y hacer commits:
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

3. **Push** y crear PR hacia `develop`:
   ```bash
   git push origin feature/mi-feature
   # Crear PR: feature/mi-feature → develop
   ```

4. **Review y merge** a `develop` (preview deploy automático)

5. **Release a producción**: PR de `develop` → `main`

### Convenciones de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `chore:` Mantenimiento
- `refactor:` Refactorización sin cambio funcional
- `style:` Cambios de estilo/formato

### Variables de entorno

| Variable | Producción | Desarrollo |
|----------|-----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Proyecto prod | Proyecto dev |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key prod | Key dev |
| `GEMINI_API_KEY` | Compartida | Compartida |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Restringida a prod domain | Restringida a dev + localhost |

## Configurar entorno local

```bash
# Clonar
git clone https://github.com/ubexdev/ubex.git
cd ubex

# Instalar
npm install

# Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus keys

# Desarrollo
npm run dev
```
