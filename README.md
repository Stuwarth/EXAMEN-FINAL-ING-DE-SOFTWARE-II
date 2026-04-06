# Proyecto de Gestión de Tareas

## Sobre el Proyecto
Este proyecto es una aplicación básica de gestión de tareas desarrollada para organizar actividades internas del equipo. Se construyó siguiendo buenas prácticas de la ingeniería de software y control de versiones.

## Estructura del Proyecto
El repositorio sigue una arquitectura de monorepo, separando responsabilidades:
- **`backend/`**: Servidor Node.js con Express usando una arquitectura por capas.
- **`frontend/`**: Aplicación de interfaz de usuario con React y Vite.
- **`database/`**: Scripts (y esquemas) base de datos.
- **`tests/`**: Pruebas de integración o generales de sistema.
- **`docs/`**: Documentación técnica.

## Actividad 2: Identificación de estructura y arquitectura del sistema
En respuesta al examen:
1. **Tipo de Arquitectura**: 
   - El proyecto general sigue una arquitectura Cliente-Servidor.
   - En el backend se implementó una **arquitectura por capas** clásica (Rutas -> Controladores -> Servicios/Lógica -> Modelos).
   - En el frontend se usa una arquitectura enfocada en **componentes** en React.
2. **Módulos o componentes identificados**:
   - Módulo de tareas (`taskModel.js`, `taskController.js`, `tasks.js`) en backend.
   - UI de tareas y listas en frontend (`App.jsx` + componentes).
3. **Mejoras arquitectónicas propuestas**:
   - Implementar el **Patrón Repositorio** (Repository Pattern) si la lógica de base de datos crece en complejidad.
   - Mover la lógica de validación a un middleware (ej. usando Express Validator).
   - Utilizar Inyección de Dependencias para facilitar el testing.
