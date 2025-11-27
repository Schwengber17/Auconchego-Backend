# Sistema de Cálculo de Compatibilidade - Auconchego

## 📋 Visão Geral

O sistema de compatibilidade do Auconchego é um algoritmo inteligente que calcula a afinidade entre um adotante e um pet, considerando múltiplos critérios e preferências. O resultado é uma pontuação de 0 a 100%, onde valores mais altos indicam maior compatibilidade.

## 🎯 Objetivo

Ajudar adotantes a encontrar pets que melhor se adequam ao seu perfil, estilo de vida e preferências, aumentando as chances de uma adoção bem-sucedida e duradoura.

---

## 🔢 Componentes do Cálculo

O algoritmo avalia **12 critérios diferentes**, cada um com sua própria pontuação e peso. A pontuação final é calculada através de uma normalização que considera apenas os critérios aplicáveis (preenchidos pelo adotante).

### 1. **ESPÉCIE** (30 pontos) - ⭐ CRITÉRIO MAIS IMPORTANTE

- **Compatível**: +30 pontos
- **Incompatível**: -30 pontos
- **Não informado**: 0 pontos (critério não aplicado)

**Exemplo**: Se o adotante busca "Cachorro" e o pet é um cachorro, recebe +30 pontos. Se for um gato, recebe -30 pontos.

---

### 2. **RAÇA** (15 pontos)

- **Compatível**: +15 pontos
- **Incompatível**: -8 pontos
- **Não informado**: 0 pontos

**Exemplo**: Adotante busca "Labrador" e o pet é um Labrador → +15 pontos.

---

### 3. **PORTE** (15 pontos)

- **Compatível**: +15 pontos
- **Incompatível**: -10 pontos
- **Não informado**: 0 pontos

**Portes possíveis**: PEQUENO, MEDIO, GRANDE

**Exemplo**: Adotante busca "PEQUENO" e o pet é pequeno → +15 pontos.

---

### 4. **SEXO** (8 pontos)

- **Compatível**: +8 pontos
- **Incompatível**: -5 pontos
- **Não informado**: 0 pontos

**Exemplo**: Adotante prefere "MACHO" e o pet é macho → +8 pontos.

---

### 5. **IDADE** (12 pontos)

O cálculo de idade considera faixas etárias e aplica penalizações proporcionais à distância da faixa desejada.

#### Cenário 1: Faixa completa (mínimo e máximo informados)
- **Dentro da faixa**: +12 pontos
- **Abaixo do mínimo**: Penalização proporcional (-3 a -15 pontos, baseado na distância)
- **Acima do máximo**: Penalização proporcional (-5 a -15 pontos, baseado na distância)

#### Cenário 2: Apenas mínimo informado
- **Atende ao mínimo**: +8 pontos
- **Abaixo do mínimo**: Penalização proporcional (-3 a -10 pontos)

#### Cenário 3: Apenas máximo informado
- **Atende ao máximo**: +8 pontos
- **Acima do máximo**: Penalização proporcional (-5 a -15 pontos)

**Exemplo**: 
- Adotante busca idade entre 2-5 anos
- Pet tem 3 anos → +12 pontos (dentro da faixa)
- Pet tem 1 ano → -6 pontos (1 ano abaixo do mínimo)
- Pet tem 8 anos → -9 pontos (3 anos acima do máximo)

---

### 6. **PESO** (12 pontos)

Similar ao cálculo de idade, considera faixas de peso e penaliza proporcionalmente.

#### Cenário 1: Faixa completa (mínimo e máximo informados)
- **Dentro da faixa**: +12 pontos
- **Abaixo do mínimo**: Penalização proporcional (-3 a -15 pontos, baseado na diferença em kg)
- **Acima do máximo**: Penalização proporcional (-5 a -15 pontos, baseado na diferença em kg)

#### Cenário 2: Apenas mínimo informado
- **Atende ao mínimo**: +8 pontos
- **Abaixo do mínimo**: Penalização proporcional (-3 a -10 pontos)

#### Cenário 3: Apenas máximo informado
- **Atende ao máximo**: +8 pontos
- **Acima do máximo**: Penalização proporcional (-5 a -15 pontos)

**Exemplo**:
- Adotante busca peso entre 10-20 kg
- Pet pesa 15 kg → +12 pontos
- Pet pesa 5 kg → -10 pontos (5 kg abaixo do mínimo)
- Pet pesa 30 kg → -20 pontos (10 kg acima do máximo, limitado a -15)

---

### 7. **VACINAÇÃO** (10 pontos)

- **Prefere vacinado e pet está vacinado**: +10 pontos
- **Prefere vacinado mas pet não está vacinado**: -12 pontos (penalização maior)
- **Não se importa**: 0 pontos (critério não aplicado)

**Exemplo**: Adotante prefere pet vacinado e o pet está vacinado → +10 pontos.

---

### 8. **CASTRACAÇÃO** (10 pontos)

- **Prefere castrado e pet está castrado**: +10 pontos
- **Prefere castrado mas pet não está castrado**: -12 pontos (penalização maior)
- **Não se importa**: 0 pontos (critério não aplicado)

**Exemplo**: Adotante prefere pet castrado e o pet está castrado → +10 pontos.

---

### 9. **TEMPERAMENTO** (15 pontos)

Compara os temperamentos do pet com as preferências do adotante.

- **Cálculo**: Percentual de match entre temperamentos
  - Se há correspondência: Pontuação proporcional (até 15 pontos)
  - Se não há correspondência: -10 pontos

**Exemplo**:
- Adotante busca: ["dócil", "brincalhão"]
- Pet tem: ["dócil", "calmo", "amigável"]
- Match: 1 de 2 temperamentos → 50% → 7.5 pontos (arredondado para 8)

---

### 10. **LOCALIZAÇÃO** (10 pontos)

Avalia a proximidade geográfica entre adotante e pet.

- **Mesma cidade**: +10 pontos
- **Mesmo estado (cidade diferente)**: +4 pontos
- **Estado diferente**: -8 pontos
- **Não informado**: 0 pontos

**Exemplo**:
- Adotante em "Porto Alegre, RS"
- Pet em "Porto Alegre, RS" → +10 pontos
- Pet em "Canoas, RS" → +4 pontos
- Pet em "São Paulo, SP" → -8 pontos

---

### 11. **AMBIENTE E ESTILO DE VIDA** (12 pontos)

Avalia a compatibilidade entre o ambiente do adotante e as necessidades do pet.

#### Tipo de Moradia vs Porte do Pet

**Apartamento**:
- Pet PEQUENO: +5 pontos
- Pet MEDIO: +2 pontos
- Pet GRANDE: -3 pontos

**Casa com quintal**:
- Qualquer porte: +3 pontos

**Chácara/Sítio**:
- Pet GRANDE: +5 pontos
- Outros portes: +2 pontos

#### Tempo em Casa vs Necessidades do Pet

**Alto tempo em casa (mais de 8h)**:
- Pet com necessidades especiais: +4 pontos
- Pet sem necessidades especiais: +2 pontos

**Tempo médio (4-8h)**:
- Qualquer pet: +2 pontos

**Baixo tempo (menos de 4h)**:
- Pet com necessidades especiais: -5 pontos (incompatível)
- Pet sem necessidades especiais: 0 pontos

#### Experiência com Pets

**Com experiência**:
- Pet com necessidades especiais/doença: +3 pontos
- Pet saudável: +1 ponto

**Sem experiência**:
- Pet com necessidades especiais/doença: -2 pontos
- Pet saudável: 0 pontos

**Exemplo**:
- Adotante: Apartamento, alto tempo em casa, sem experiência
- Pet: PEQUENO, sem necessidades especiais
- Pontuação: +5 (apartamento + pequeno) + 2 (alto tempo) + 0 (sem experiência) = +7 pontos

---

### 12. **SAÚDE** (15 pontos)

Avalia a compatibilidade entre as necessidades de saúde do pet e a disponibilidade do adotante.

#### Pet com Necessidades Especiais ou Tratamento Contínuo

- **Adotante aceita**: +15 pontos
- **Adotante não aceita**: -20 pontos + **FATOR IMPEDITIVO** (limita compatibilidade máxima a 20%)

#### Pet com Doença Crônica

- **Adotante aceita**: +15 pontos
- **Adotante não aceita**: -20 pontos + **FATOR IMPEDITIVO**

#### Pet Saudável

- **Sempre**: +15 pontos

**Exemplo**:
- Pet precisa de tratamento contínuo
- Adotante não aceita necessidades especiais
- Resultado: -20 pontos + FATOR IMPEDITIVO → Compatibilidade máxima limitada a 20%

---

### 13. **SOCIAL / DISPONIBILIDADE** (10 pontos)

Avalia a compatibilidade social e disponibilidade de tempo.

#### Compatibilidade com Outros Animais

- **Pet acostumado com outros + Adotante tem outros**: +5 pontos
- **Pet acostumado + Adotante não tem**: +2 pontos
- **Pet não acostumado**: 0 pontos

#### Disponibilidade de Tempo

- **Adotante tem disponibilidade**: +5 pontos
- **Adotante não tem disponibilidade**: -20 pontos + **FATOR IMPEDITIVO**

**Exemplo**:
- Pet acostumado com outros animais
- Adotante tem outros animais
- Adotante tem disponibilidade
- Pontuação: +5 (compatibilidade social) + 5 (disponibilidade) = +10 pontos

---

## 📊 Processo de Normalização

Após calcular todos os componentes, o sistema normaliza a pontuação para uma escala de 0-100%.

### Passo 1: Soma das Pontuações

```javascript
pontuacaoTotal = soma de todos os valores dos componentes
```

### Passo 2: Cálculo dos Limites

```javascript
minPossible = soma de todos os valores mínimos dos componentes
maxPossible = soma de todos os valores máximos dos componentes
```

### Passo 3: Normalização

```javascript
if (maxPossible === minPossible) {
    compatibilidade = 50% // Neutro quando não há critérios aplicados
} else {
    raw = ((pontuacaoTotal - minPossible) / (maxPossible - minPossible)) * 100
    compatibilidade = Math.max(0, Math.min(100, Math.round(raw)))
}
```

### Passo 4: Ajuste por Número de Critérios

O sistema ajusta a compatibilidade baseado em quantos critérios foram aplicados:

- **Menos de 3 critérios**: Reduz compatibilidade máxima para 60% (evita valores muito altos com poucos dados)
- **3-5 critérios**: Reduz compatibilidade máxima para 75%
- **6+ critérios**: Compatibilidade normal (até 100%)
- **7+ critérios**: Aumenta ligeiramente (1.1x) para critérios muito específicos

```javascript
if (criteriosAplicados < 3) {
    ajuste = 0.6 // Reduz para 60%
} else if (criteriosAplicados < 5) {
    ajuste = 0.75 // Reduz para 75%
} else if (criteriosAplicados >= 7) {
    ajuste = 1.1 // Aumenta para critérios muito específicos
} else {
    ajuste = 1.0 // Normal
}

compatibilidade = compatibilidade * ajuste
```

### Passo 5: Aplicação de Fator Impeditivo

Se houver um **fator impeditivo** (ex: adotante não aceita necessidades especiais, mas o pet precisa), a compatibilidade é limitada a no máximo 20%:

```javascript
if (fatorImpeditivo) {
    compatibilidade = Math.min(compatibilidade, 20)
}
```

### Passo 6: Ajuste para Pontuações Muito Baixas

Se a compatibilidade bruta for muito baixa (< 30%) e houver 3+ critérios aplicados, reduz ainda mais:

```javascript
if (raw < 30 && criteriosAplicados >= 3) {
    compatibilidade = Math.max(0, Math.round(raw * 0.8))
}
```

---

## 🎯 Exemplo Prático Completo

### Dados do Adotante:
- **Espécie desejada**: Cachorro
- **Porte desejado**: PEQUENO
- **Idade preferida**: 2-5 anos
- **Peso preferido**: 5-15 kg
- **Prefere vacinado**: Sim
- **Prefere castrado**: Sim
- **Tipo de moradia**: Apartamento
- **Tempo em casa**: Alto (mais de 8h)
- **Experiência**: Sim
- **Temperamento desejado**: ["dócil", "brincalhão"]
- **Localização**: Porto Alegre, RS

### Dados do Pet:
- **Espécie**: Cachorro
- **Porte**: PEQUENO
- **Idade**: 3 anos
- **Peso**: 8 kg
- **Vacinado**: Sim
- **Castrado**: Sim
- **Temperamento**: ["dócil", "amigável", "brincalhão"]
- **Localização**: Porto Alegre, RS
- **Necessidades especiais**: Não
- **Tratamento contínuo**: Não
- **Doença crônica**: Não

### Cálculo:

| Critério | Pontuação | Min | Max |
|----------|-----------|-----|-----|
| Espécie | +30 | -30 | 30 |
| Porte | +15 | -10 | 15 |
| Idade | +12 | -15 | 12 |
| Peso | +12 | -15 | 12 |
| Vacinação | +10 | -12 | 10 |
| Castração | +10 | -12 | 10 |
| Temperamento | +15 (100% match) | -10 | 15 |
| Localização | +10 | -8 | 10 |
| Ambiente | +7 (apartamento+pequeno + alto tempo + experiência) | -10 | 12 |
| Saúde | +15 | 5 | 15 |
| Social | +5 (disponibilidade) | -20 | 10 |
| **TOTAL** | **+141** | **-137** | **151** |

### Normalização:

```
pontuacaoTotal = 141
minPossible = -137
maxPossible = 151

raw = ((141 - (-137)) / (151 - (-137))) * 100
raw = (278 / 288) * 100
raw = 96.5%

criteriosAplicados = 12 (todos aplicados)
ajuste = 1.0 (normal, pois tem 6+ critérios)

compatibilidade = 96.5% * 1.0 = 96.5% ≈ 97%
```

**Resultado Final: 97% de compatibilidade** ✅

---

## 🚫 Fatores Impeditivos

O sistema identifica situações que tornam a adoção **altamente desaconselhável**:

1. **Pet com necessidades especiais/tratamento contínuo** + **Adotante não aceita**
2. **Pet com doença crônica** + **Adotante não aceita**
3. **Adotante sem disponibilidade de tempo**

Quando um fator impeditivo é detectado:
- A compatibilidade é **limitada a no máximo 20%**
- Uma descrição do impedimento é registrada no relatório
- O sistema ainda calcula a compatibilidade, mas sinaliza claramente o problema

---

## 📈 Interpretação dos Resultados

### 80-100%: **Alta Compatibilidade** 🟢
- Pet altamente compatível com o perfil do adotante
- Recomendado para adoção
- Maior probabilidade de sucesso

### 60-79%: **Boa Compatibilidade** 🟡
- Pet compatível, com algumas diferenças menores
- Pode ser uma boa opção
- Avaliar caso a caso

### 40-59%: **Compatibilidade Média** 🟠
- Algumas incompatibilidades significativas
- Requer avaliação cuidadosa
- Pode funcionar com ajustes

### 20-39%: **Baixa Compatibilidade** 🔴
- Muitas incompatibilidades
- Não recomendado sem avaliação detalhada
- Pode haver fatores impeditivos

### 0-19%: **Muito Baixa Compatibilidade** ⚠️
- Incompatibilidades graves
- Possível fator impeditivo
- Não recomendado

---

## 🔄 Recalculo Automático

O sistema recalcula automaticamente a compatibilidade quando:

1. **Novo adotante é cadastrado**: Calcula compatibilidade com todos os pets disponíveis
2. **Preferências do adotante são atualizadas**: Recalcula com todos os pets
3. **Novo pet é cadastrado**: Calcula compatibilidade com todos os adotantes

---

## 💾 Armazenamento

Cada cálculo gera um **Relatório de Compatibilidade** que é salvo no banco de dados, contendo:

- Pontuação total
- Compatibilidade (0-100%)
- Pontuação detalhada de cada critério
- Fator impeditivo (se houver)
- Descrição do impedimento (se houver)
- Data de criação

Isso permite:
- **Cache de resultados**: Evita recalcular toda vez
- **Histórico**: Ver como a compatibilidade mudou ao longo do tempo
- **Análise**: Identificar padrões e melhorar o algoritmo

---

## 🎓 Considerações Técnicas

### Performance

- Os relatórios são salvos no banco para evitar recálculos desnecessários
- Quando um adotante atualiza preferências, todos os relatórios são recalculados
- O sistema usa transações do Prisma para garantir consistência

### Validação

- Todos os critérios são validados antes do cálculo
- Valores nulos são tratados adequadamente (critério não aplicado)
- Erros são capturados e logados sem quebrar o fluxo

### Escalabilidade

- O algoritmo é O(n) onde n é o número de critérios aplicados
- Para 1000 pets e 100 adotantes, são gerados 100.000 relatórios
- O sistema suporta upsert (atualiza relatórios existentes)

---

## 📝 Resumo Executivo

O sistema de compatibilidade do Auconchego é um **algoritmo multi-critério inteligente** que:

1. ✅ Avalia **12 dimensões diferentes** de compatibilidade
2. ✅ Dá **peso maior** para critérios mais importantes (espécie, porte, idade)
3. ✅ Aplica **penalizações proporcionais** para incompatibilidades
4. ✅ Identifica **fatores impeditivos** que limitam a compatibilidade
5. ✅ Normaliza resultados considerando **apenas critérios aplicáveis**
6. ✅ Ajusta resultados baseado na **quantidade de critérios informados**
7. ✅ Gera **relatórios detalhados** para análise e histórico

O resultado é um sistema que ajuda adotantes a encontrar pets compatíveis, aumentando as chances de adoções bem-sucedidas e duradouras. 🐾

