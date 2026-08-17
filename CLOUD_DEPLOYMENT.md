# ☁️ Guía de Despliegue en Cloud - Villa Baviera

## 📋 Información Rápida del Proyecto

### Datos del Repositorio GitHub
```yaml
Propietario: IgnacioVM1501
Repositorio: Villa-Baviera
URL: https://github.com/IgnacioVM1501/Villa-Baviera
Tipo: Privado
Branch Principal: main
Última Actualización: Julio 2025
```

### Credenciales y Accesos
```yaml
GitHub:
  Usuario: IgnacioVM1501
  Repositorio: Villa-Baviera
  Autenticación: Token Personal / SSH Key
  
Dominio (sugerido):
  Principal: www.vocesdemujeresunidas.org
  Alternativo: www.villa-baviera.org
  Subdominio: ayuda.vocesdemujeresunidas.org
```

---

## 🌐 Contexto del Proyecto

### ¿Qué es este proyecto?
Un sitio web institucional para la **Agrupación Voces de Mujeres Unidas**, una ONG chilena que trabaja en la reparación histórica de los sobrevivientes de la ex-Colonia Dignidad (actual Villa Baviera).

### Objetivo Principal
Proporcionar una plataforma digital para:
- Visibilizar la historia y memoria de Villa Baviera
- Recaudar fondos para proyectos de apoyo social
- Conectar a sobrevivientes con recursos de ayuda
- Educar sobre derechos humanos

### Usuarios Objetivo
- Sobrevivientes y familias (Chile)
- Donantes internacionales (Alemania, USA, Canadá)
- Investigadores y periodistas
- Público general interesado en DDHH

---

## 🚀 Configuración para Cloud

### Requisitos del Servidor

```yaml
Tipo: Static Website Hosting
RAM Mínima: 512 MB (static serving)
Storage: 1 GB
Bandwidth: 10 GB/mes (estimado)
SSL: Requerido (Let's Encrypt)
CDN: Recomendado (Cloudflare)
```

### Variables de Entorno

```bash
# .env.example
SITE_URL=https://www.vocesdemujeresunidas.org
ANALYTICS_ID=UA-XXXXXXXXX-X
STRIPE_PUBLIC_KEY=pk_live_xxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxx
CONTACT_EMAIL=contacto@vocesdemujeresunidas.org
DEFAULT_LANGUAGE=es
AVAILABLE_LANGUAGES=es,en,de
```

### Servicios Cloud Recomendados

#### Opción 1: GitHub Pages (Gratis)
```bash
# Configuración
- Source: main branch
- Folder: / (root)
- Custom domain: vocesdemujeresunidas.org
- Enforce HTTPS: Yes
```

#### Opción 2: Netlify
```toml
# netlify.toml
[build]
  publish = "/"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

#### Opción 3: AWS S3 + CloudFront
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::villa-baviera-website/*"
  }]
}
```

#### Opción 4: Google Cloud Storage
```yaml
# app.yaml para App Engine
runtime: python39
handlers:
- url: /
  static_files: index.html
  upload: index.html
- url: /(.*)
  static_files: \1
  upload: .*
```

---

## 📦 Archivos del Proyecto

### Estructura Actual
```
Villa-Baviera/
├── index.html (60.5 KB)
├── nuestra-historia.html (64.4 KB)
├── quienes_somos.html (65.6 KB)
├── proyectos.html (56 KB)
├── transparencia.html (51 KB)
├── images/ (20+ archivos, ~15 MB total)
└── README.md (este archivo)
```

### Archivos Críticos
1. **index.html** - Página principal con toda la funcionalidad
2. **images/logo1.jpeg** - Logo principal usado en todas las páginas
3. **images/Fondo_Hero_Principal.jpg** - Imagen hero de la página principal

### Archivos Faltantes (IMPORTANTE)
```
❌ images/Inicio_Evento_Feria_Benefica.jpg
❌ images/Inicio_Siguenos_Facebook.jpg
❌ images/Inicio_Siguenos_Instagram.jpg
❌ images/Inicio_Siguenos_Twitter.jpg
❌ images/Inicio_Siguenos_LinkedIn.jpg
❌ images/Inicio_Siguenos_YouTube.jpg
❌ Todas las imágenes de quienes_somos.html
```

---

## 🔧 Configuración de Deployment

### Pre-deployment Checklist

- [ ] Clonar repositorio desde GitHub
- [ ] Verificar todas las imágenes están presentes
- [ ] Actualizar URLs base en el código
- [ ] Configurar dominio personalizado
- [ ] Instalar certificado SSL
- [ ] Configurar headers de seguridad
- [ ] Habilitar compresión gzip
- [ ] Configurar caché de navegador
- [ ] Activar CDN (opcional pero recomendado)

### Scripts de Build

```bash
# build.sh
#!/bin/bash

# Crear directorio de build
mkdir -p dist

# Copiar archivos HTML
cp *.html dist/

# Copiar imágenes
cp -r images dist/

# Optimizar imágenes (requiere imagemagick)
find dist/images -name "*.jpg" -exec convert {} -quality 85 {} \;

# Minificar HTML (requiere html-minifier)
# for file in dist/*.html; do
#   html-minifier --collapse-whitespace --remove-comments $file -o $file
# done

echo "Build completado en ./dist"
```

### Configuración de Seguridad

```nginx
# nginx.conf recomendado
server {
    listen 443 ssl http2;
    server_name vocesdemujeresunidas.org;
    
    # Headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;";
    
    # Compresión
    gzip on;
    gzip_types text/plain text/css application/javascript image/svg+xml;
    
    # Caché
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 📊 Monitoreo y Analytics

### Google Analytics 4
```javascript
// Agregar antes de </head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Monitoreo de Uptime
- **UptimeRobot**: Monitor gratuito cada 5 minutos
- **Pingdom**: Monitoreo desde múltiples ubicaciones
- **CloudFlare Analytics**: Si usas CloudFlare CDN

---

## 🆘 Troubleshooting Común

### Problema: Imágenes no cargan
```bash
# Verificar permisos
chmod -R 755 images/

# Verificar rutas (case sensitive en Linux)
find . -name "*.html" -exec grep -l "images/" {} \;
```

### Problema: Caracteres especiales (ñ, á, é)
```html
<!-- Asegurar UTF-8 en todas las páginas -->
<meta charset="UTF-8">
```

### Problema: CORS con fuentes de Google
```nginx
# Agregar headers CORS
add_header Access-Control-Allow-Origin "https://fonts.googleapis.com";
```

---

## 🔐 Información Sensible

### NO subir al repositorio:
- Tokens de API reales
- Claves privadas de pago
- Información personal de sobrevivientes
- Documentos legales sensibles

### Usar secrets del Cloud Provider:
```yaml
# GitHub Actions example
env:
  STRIPE_KEY: ${{ secrets.STRIPE_KEY }}
  ANALYTICS_ID: ${{ secrets.ANALYTICS_ID }}
```

---

## 📈 Métricas de Éxito

### KPIs a Monitorear
1. **Visitantes únicos mensuales**: Meta 5,000
2. **Tasa de conversión donaciones**: Meta 2%
3. **Tiempo en sitio**: Meta >3 minutos
4. **Páginas por sesión**: Meta >3
5. **Tasa de rebote**: Meta <50%

### Objetivos Trimestrales
- Q1: Lanzamiento y estabilización
- Q2: Integración sistema de pagos
- Q3: Blog y contenido dinámico
- Q4: App móvil complementaria

---

## 🚨 Contactos de Emergencia

### Soporte Técnico
- **Desarrollador**: Ignacio VM
- **GitHub**: @IgnacioVM1501
- **Horario**: Lun-Vie 9:00-18:00 CLT

### Organización
- **Responsable**: [Nombre del responsable]
- **Email**: contacto@vocesdemujeresunidas.org
- **Teléfono**: +56 9 XXXX XXXX

---

**Última actualización**: Julio 2025  
**Versión del documento**: 1.0