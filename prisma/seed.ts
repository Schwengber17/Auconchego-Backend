// prisma/seed.ts
import { PrismaClient, Porte, Sexo, Status } from '@prisma/client';

// Instancia o Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seed...');

  // 1. Limpar dados existentes (opcional, mas bom para re-executar o seed)
  await prisma.pet.deleteMany({});
  await prisma.oNG.deleteMany({});
  console.log('Banco de dados limpo.');

  // 2. Criar ONGs de exemplo
  console.log('Criando ONGs de exemplo...');
  const ong1 = await prisma.oNG.create({
    data: {
      cnpj: '11.222.333/0001-44',
      endereco: 'Rua das Patas Felizes, 123',
    },
  });

  const ong2 = await prisma.oNG.create({
    data: {
      cnpj: '55.666.777/0001-88',
      endereco: 'Avenida dos Focinhos, 456',
    },
  });
  console.log('ONGs criadas com sucesso.');

  // 3. Criar uma lista com 40 pets
  console.log('Preparando dados dos pets...');
  const petsData = [
    // --- Cachorros ---
    { nome: 'Rex', especie: 'Cachorro', raca: 'Vira-lata Caramelo', porte: Porte.MEDIO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Luna', especie: 'Cachorro', raca: 'Golden Retriever', porte: Porte.GRANDE, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Thor', especie: 'Cachorro', raca: 'Shih Tzu', porte: Porte.PEQUENO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: true, tratamentoContinuo: true, doencaCronica: false, idOng: ong1.id },
    { nome: 'Mel', especie: 'Cachorro', raca: 'Poodle', porte: Porte.PEQUENO, sexo: Sexo.FEMEA, status: Status.ADOTADO, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Max', especie: 'Cachorro', raca: 'Labrador', porte: Porte.GRANDE, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Nina', especie: 'Cachorro', raca: 'SRD', porte: Porte.MEDIO, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: true, doencaCronica: true, idOng: ong2.id },
    { nome: 'Zeus', especie: 'Cachorro', raca: 'Bulldog Francês', porte: Porte.PEQUENO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Amora', especie: 'Cachorro', raca: 'Pinscher', porte: Porte.PEQUENO, sexo: Sexo.FEMEA, status: Status.RESERVADO, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Billy', especie: 'Cachorro', raca: 'Beagle', porte: Porte.MEDIO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Cacau', especie: 'Cachorro', raca: 'Dachshund', porte: Porte.PEQUENO, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Rocky', especie: 'Cachorro', raca: 'Pastor Alemão', porte: Porte.GRANDE, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Lola', especie: 'Cachorro', raca: 'SRD', porte: Porte.MEDIO, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Bob', especie: 'Cachorro', raca: 'Lhasa Apso', porte: Porte.PEQUENO, sexo: Sexo.MACHO, status: Status.ADOTADO, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Maya', especie: 'Cachorro', raca: 'Pitbull', porte: Porte.GRANDE, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: true, doencaCronica: false, idOng: ong2.id },
    { nome: 'Fred', especie: 'Cachorro', raca: 'Yorkshire', porte: Porte.PEQUENO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Maggie', especie: 'Cachorro', raca: 'SRD', porte: Porte.PEQUENO, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: true, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Chico', especie: 'Cachorro', raca: 'Vira-lata Caramelo', porte: Porte.MEDIO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Bella', especie: 'Cachorro', raca: 'Cocker Spaniel', porte: Porte.MEDIO, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Luke', especie: 'Cachorro', raca: 'Border Collie', porte: Porte.MEDIO, sexo: Sexo.MACHO, status: Status.RESERVADO, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Pandora', especie: 'Cachorro', raca: 'Husky Siberiano', porte: Porte.GRANDE, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },

    // --- Gatos ---
    { nome: 'Tom', especie: 'Gato', raca: 'SRD', porte: Porte.PEQUENO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Mimi', especie: 'Gato', raca: 'Siamês', porte: Porte.PEQUENO, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: true, idOng: ong2.id },
    { nome: 'Simba', especie: 'Gato', raca: 'Persa', porte: Porte.MEDIO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: true, tratamentoContinuo: true, doencaCronica: false, idOng: ong1.id },
    { nome: 'Frida', especie: 'Gato', raca: 'Angorá', porte: Porte.MEDIO, sexo: Sexo.FEMEA, status: Status.ADOTADO, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Frajola', especie: 'Gato', raca: 'SRD', porte: Porte.PEQUENO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Cleo', especie: 'Gato', raca: 'Sphynx', porte: Porte.MEDIO, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: true, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Gato de Botas', especie: 'Gato', raca: 'Maine Coon', porte: Porte.GRANDE, sexo: Sexo.MACHO, status: Status.RESERVADO, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Xaninha', especie: 'Gato', raca: 'SRD', porte: Porte.PEQUENO, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Salem', especie: 'Gato', raca: 'SRD', porte: Porte.PEQUENO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Misty', especie: 'Gato', raca: 'British Shorthair', porte: Porte.MEDIO, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Garfield', especie: 'Gato', raca: 'Persa', porte: Porte.MEDIO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Nala', especie: 'Gato', raca: 'SRD', porte: Porte.PEQUENO, sexo: Sexo.FEMEA, status: Status.ADOTADO, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Oliver', especie: 'Gato', raca: 'Siamês', porte: Porte.PEQUENO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: true, doencaCronica: false, idOng: ong1.id },
    { nome: 'Fiona', especie: 'Gato', raca: 'Ragdoll', porte: Porte.GRANDE, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Bolinha', especie: 'Gato', raca: 'SRD', porte: Porte.PEQUENO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Lilica', especie: 'Gato', raca: 'SRD', porte: Porte.PEQUENO, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Mingau', especie: 'Gato', raca: 'Angorá', porte: Porte.MEDIO, sexo: Sexo.MACHO, status: Status.RESERVADO, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Lua', especie: 'Gato', raca: 'SRD', porte: Porte.PEQUENO, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong2.id },
    { nome: 'Felix', especie: 'Gato', raca: 'SRD', porte: Porte.MEDIO, sexo: Sexo.MACHO, status: Status.DISPONIVEL, necessidadesEspeciais: false, tratamentoContinuo: false, doencaCronica: false, idOng: ong1.id },
    { nome: 'Estrela', especie: 'Gato', raca: 'Siberiano', porte: Porte.GRANDE, sexo: Sexo.FEMEA, status: Status.DISPONIVEL, necessidadesEspeciais: true, tratamentoContinuo: false, doencaCronica: true, idOng: ong2.id },
  ];

  // 4. Inserir os pets no banco de dados
  console.log('Inserindo pets no banco de dados...');
  await prisma.pet.createMany({
    data: petsData,
  });
  console.log('Pets inseridos com sucesso.');
}

// Executa a função main e finaliza o processo
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
    console.log('Processo de seed finalizado.');
  });
