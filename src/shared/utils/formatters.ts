/**
 * Formata um valor numérico para a representação de Big Blinds (BB)
 */
export const formatBB = (value: number): string => {
    return `${Math.round(value * 10) / 10} BB`;
  };
  
  /**
   * Formata um valor numérico para porcentagem
   */
  export const formatPercentage = (value: number): string => {
    return `${Math.round(value * 10) / 10}%`;
  };