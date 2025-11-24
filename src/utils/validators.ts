export const validators = {
  // Email validation
  isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Brazilian CEP validation
  isCEP(cep: string): boolean {
    const cepRegex = /^\d{5}-?\d{3}$/
    return cepRegex.test(cep.replace(/\D/g, ""))
  },

  // Brazilian CNPJ validation
  isCNPJ(cnpj: string): boolean {
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    return cnpjRegex.test(cnpj)
  },

  // Brazilian phone validation
  isTelefone(telefone: string): boolean {
    const telefoneRegex = /^$$\d{2}$$\s?\d{4,5}-\d{4}$/
    return telefoneRegex.test(telefone)
  },

  // Check if value is a valid enum option
  isEnumValue(value: any, enumValues: string[]): boolean {
    return enumValues.includes(value)
  },

  // Check if string is not empty
  isNotEmpty(value: string): boolean {
    return value && value.trim().length > 0
  },

  // Check if number is positive
  isPositive(value: number): boolean {
    return value > 0
  },

  // Check if date is valid
  isValidDate(date: string | Date): boolean {
    const d = new Date(date)
    return d instanceof Date && !isNaN(d.getTime())
  },

  // Check if date is within last 6 months (for post-adoption follow-up)
  isWithinSixMonths(date: Date): boolean {
    const now = new Date()
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
    return date >= sixMonthsAgo && date <= now
  },
}

export const sanitizers = {
  // Remove special characters from string
  sanitizeString(str: string): string {
    return str.trim().replace(/[<>]/g, "")
  },

  // Normalize CEP format
  normalizeCEP(cep: string): string {
    const cleaned = cep.replace(/\D/g, "")
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
  },

  // Normalize phone format
  normalizeTelefone(telefone: string): string {
    const cleaned = telefone.replace(/\D/g, "")
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    } else if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    return telefone
  },

  // Uppercase state code
  normalizeEstado(estado: string): string {
    return estado.toUpperCase()
  },

  // Capitalize species name
  capitalizeEspecie(especie: string): string {
    return especie
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  },
}

export const formatters = {
  // Format date to ISO string
  formatDate(date: Date): string {
    return date.toISOString()
  },

  // Format date to Brazilian format (DD/MM/YYYY)
  formatDateBR(date: Date): string {
    return date.toLocaleDateString("pt-BR")
  },

  // Format phone to display
  formatTelefoneDisplay(telefone: string): string {
    const cleaned = telefone.replace(/\D/g, "")
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    } else if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    return telefone
  },

  // Format compatibility as percentage
  formatCompatibilidade(value: number): string {
    return `${Math.round(value)}%`
  },

  // Format days for display
  formatDias(dias: number): string {
    if (dias === 1) return "1 dia"
    if (dias < 30) return `${dias} dias`
    const meses = Math.floor(dias / 30)
    if (meses === 1) return "1 mês"
    return `${meses} meses`
  },
}
