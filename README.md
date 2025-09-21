# Green - E-commerce de Vehículos Eléctricos

Una plataforma de comercio electrónico moderna y sostenible para vehículos eléctricos, inspirada en el diseño de Tesla, diseñada específicamente para el mercado colombiano.

## 🚀 Características Principales

### 🎨 Diseño Tesla-Inspired

- **Abundante espacio en blanco** para una experiencia visual limpia
- **Líneas limpias** y diseño minimalista
- **Fotografía de productos de alta calidad**
- **Interfaz premium** que transmite confianza y calidad

### 🛍️ Sistema de Catálogo de Productos

- **Vehículos eléctricos diversos**: Motocicletas, scooters y bicicletas
- **Filtrado por tipo** de vehículo
- **Especificaciones detalladas** de cada producto
- **Beneficios ambientales** claramente destacados

### 🎨 Personalización de Colores Interactiva

- **Selección de colores en tiempo real**
- **Actualización visual inmediata** al cambiar colores
- **Múltiples opciones** de colores para cada vehículo
- **Experiencia inmersiva** de personalización

### 💳 Sistema de Pedidos "Ordena este Modelo"

- **Modal de pedido completo** con formulario de cliente
- **Captura de datos detallados** del cliente
- **Información clara** sobre el plan de pagos
- **Confirmación de pedido** con próximos pasos

### 💰 Plan de Pagos en 4 Cuotas

- **Pago inicial del 25%** del valor total
- **4 cuotas restantes** cada 2 semanas
- **Entrega después del pago completo** (claramente comunicado)
- **Cronograma visual** de pagos

### 🌱 Temática Ambiental Fuerte

- **Mensajes ecológicos** en toda la plataforma
- **Beneficios ambientales** destacados
- **Imágenes de naturaleza** y árboles
- **Mensajería de sostenibilidad** integrada

### 🇨🇴 Contenido en Español

- **Interfaz completamente en español**
- **Adaptado al mercado colombiano**
- **Precios en pesos colombianos (COP)**
- **Terminología local** apropiada

### 📱 Diseño Responsivo

- **Optimizado para desktop y móvil**
- **Navegación adaptativa**
- **Componentes flexibles**
- **Experiencia consistente** en todos los dispositivos

### 📞 Footer con Formularios de Contacto

- **Programa una Prueba**: Formulario para solicitar prueba de manejo
- **Haz una Pregunta**: Formulario de contacto para consultas
- **Información de contacto** completa
- **Enlaces de navegación** y legal

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Next.js 15** - Framework de React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **shadcn/ui** - Componentes de interfaz reutilizables
- **Lucide React** - Iconografía moderna

### Backend

- **Next.js API Routes** - Endpoints del servidor
- **TypeScript** - Tipado para APIs
- **Validación con Zod** - Esquemas de validación

### Formularios y Validación

- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **@hookform/resolvers** - Integración de validadores

### Estilo y UI

- **Tailwind CSS** - Estilos utilitarios
- **CSS Variables** - Sistema de temas
- **Responsive Design** - Diseño adaptativo

## 📁 Estructura del Proyecto

```
green/
├── app/
│   ├── api/
│   │   ├── contact/route.ts      # API para formularios de contacto
│   │   ├── orders/route.ts       # API para procesamiento de pedidos
│   │   └── products/route.ts     # API para productos
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página principal
├── components/
│   ├── ui/                       # Componentes base de shadcn/ui
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   ├── Footer.tsx                # Footer con formularios
│   ├── Header.tsx                # Header de navegación
│   ├── HeroSection.tsx           # Sección hero con carrusel
│   ├── OrderModal.tsx            # Modal de pedidos
│   └── ProductCatalog.tsx        # Catálogo de productos
├── data/
│   └── products.ts               # Datos mock de productos
├── lib/
│   └── utils.ts                  # Utilidades
├── types/
│   └── index.ts                  # Definiciones de TypeScript
└── public/
    └── images/                   # Imágenes del proyecto
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18.8.0 o superior
- npm 8.18.0 o superior

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd green
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**

   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter de código

## 🎯 Funcionalidades Implementadas

### ✅ Completadas

- [x] Configuración inicial de Next.js con TypeScript
- [x] Integración de shadcn/ui y Tailwind CSS
- [x] Sistema de tipos TypeScript completo
- [x] Datos mock de productos eléctricos
- [x] Header responsive con navegación
- [x] Sección hero con carrusel de productos
- [x] Catálogo de productos con filtrado
- [x] Personalización de colores interactiva
- [x] Modal de pedidos "Ordena este modelo"
- [x] Sistema de pagos en 4 cuotas
- [x] Footer con formularios de contacto
- [x] Temática ambiental integrada
- [x] Contenido en español para Colombia
- [x] Diseño completamente responsivo
- [x] APIs para pedidos y contacto
- [x] Validación de formularios

### 🔄 Próximas Mejoras

- [ ] Integración con sistema de pagos real
- [ ] Base de datos para persistencia
- [ ] Sistema de autenticación de usuarios
- [ ] Panel de administración
- [ ] Sistema de notificaciones por email
- [ ] Integración con CRM
- [ ] Optimización de imágenes
- [ ] Pruebas unitarias y de integración

## 🎨 Guía de Diseño

### Paleta de Colores

- **Primario**: Verde (HSL: 142.1 76.2% 36.3%) - Representa naturaleza y sostenibilidad
- **Secundario**: Grises neutros para equilibrio
- **Acentos**: Azules y amarillos para elementos de llamada a la acción

### Tipografía

- **Fuente Principal**: Geist Sans (Google Fonts)
- **Fuente Mono**: Geist Mono para código

### Componentes

- **Botones**: Estilo Tesla con bordes redondeados y efectos hover
- **Formularios**: Campos limpios con validación en tiempo real
- **Modales**: Superposición elegante con animaciones suaves

## 📊 Datos de Productos

### Eco Rider Pro

- **Precio**: $3,500,000 COP
- **Tipo**: Motocicleta eléctrica
- **Rango**: 120 km
- **Velocidad máxima**: 80 km/h

### Urban Scooter Lite

- **Precio**: $2,500,000 COP
- **Tipo**: Scooter eléctrico
- **Rango**: 25 km
- **Velocidad máxima**: 25 km/h

### Mountain Bike Eléctrica

- **Precio**: $2,500,000 COP
- **Tipo**: Bicicleta eléctrica
- **Rango**: 60 km
- **Velocidad máxima**: 45 km/h

## 🔧 Configuración de Desarrollo

### Variables de Entorno

Crear un archivo `.env.local` con:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Linting

El proyecto usa ESLint con configuración Next.js:

```bash
npm run lint
```

### TypeScript

Verificación de tipos:

```bash
npx tsc --noEmit
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Características Móviles

- Navegación hamburguesa en móvil
- Formularios optimizados para touch
- Botones de acción sticky en la parte inferior
- Imágenes adaptativas

## 🌍 Internacionalización

### Español Colombiano

- Formato de moneda: COP (pesos colombianos)
- Formato de fecha: DD/MM/YYYY
- Terminología local apropiada
- Números con separadores de miles

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Docker

```bash
docker build -t green-ecommerce .
docker run -p 3000:3000 green-ecommerce
```

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:

- **Email**: info@green.co
- **Teléfono**: +57 1 234 5678
- **Ubicación**: Bogotá, Colombia

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Green** - Vehículos Eléctricos Sostenibles para un Futuro Más Limpio 🌱
