// types/User.ts

export interface user {
    id: string;       // ID único do usuário (geralmente um UUID ou um ID do banco de dados)
    name: string;     // Nome completo do usuário
    email: string;    // Email do usuário (caso necessário)
    company: string;  // Empresa associada ao usuário (caso necessário)
    role?: string;    // (opcional) Função ou tipo de usuário, por exemplo: 'admin', 'user', etc.
    createdAt: string; // Data de criação da conta (formato ISO 8601 ou timestamp)
    updatedAt: string; // Data de atualização da conta (formato ISO 8601 ou timestamp)
  }
  