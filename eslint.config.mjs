import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    languageOptions: { globals: globals.node },
    rules: {
      // Regras gerais de formatação
      'indent': ['warn', 2], // Indentação com 2 espaços
      'quotes': ['warn', 'single'], // Aspas simples para strings
      'semi': ['warn', 'never'], // Ponto e vírgula sempre no final das declarações
      'comma-spacing': 'warn', // Espaçamento após vírgulas
      'arrow-spacing': 'warn', // Espaçamento antes e depois da seta de funções arrow
      'no-multi-spaces': 'warn', // Proibir múltiplos espaços em uma linha
      
      // Remoção de console.log
      'no-console': 'error', // Proibir o uso de console.log
      
      // Regras de tipagem
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Desativar a exigência de tipos explícitos para funções de nível superior
      
      // Regras específicas do ESLint e do TypeScript
      'no-unused-vars': 'error', // Proibir variáveis não utilizadas
      'no-undef': 'error', // Proibir o uso de variáveis não definidas
      'prefer-const': ['error', { 'ignoreReadBeforeAssign': true }] // Preferir o uso de const quando possível
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];