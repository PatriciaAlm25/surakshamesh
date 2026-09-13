/**
 * SURAKSHA MESH - Centralized API Configuration
 * Supports environment-based configuration for local development and cloud deployments (Render, Vercel, etc.)
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
