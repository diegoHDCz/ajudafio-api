import 'dotenv/config'
import { db, pool } from './src/infra/db/drizzle'
import { users, professionals, contracts, address } from './src/infra/db/schema'
import { randomUUID } from 'node:crypto'

async function seed() {
  console.log('Seeding database...')

  try {
    await pool.connect() // Testa a conexão do pool
    console.log('Conexão com o banco estabelecida!')
  } catch (error) {
    console.error('Erro na conexão:', error)
    process.exit(1)
  }

  const userIdFirst = randomUUID()
  const userIdSecond = randomUUID()
  const professionalIdFirst = randomUUID()
  const userData = [
    {
      id: userIdFirst,
      email: 'client@example.com',
      name: 'João Cliente',
      emailVerified: true,
      telephone: '11999999999',
      telephonWhatsapp: true,
      secondTelephone: '11888888888',
      secondTelephonWhatsapp: false,
      linkedin: 'https://linkedin.com/in/joao',
      instagram: '@joao_instagram',
      facebook: 'https://facebook.com/joao',
      identificationNumber: '123456789',
      identificationType: 'CPF',
      role: 'CLIENT',
    },
    {
      id: userIdSecond,
      email: 'professional@example.com',
      name: 'Maria Profissional',
      emailVerified: true,
      telephone: '11988888888',
      telephonWhatsapp: true,
      secondTelephone: null,
      secondTelephonWhatsapp: false,
      linkedin: null,
      instagram: null,
      facebook: null,
      identificationNumber: '987654321',
      identificationType: 'CPF',
      role: 'PROFESSIONAL',
    },
  ]

  await db.insert(users).values(userData)
  console.log('Users inserted')

  // Insert professionals
  const professionalData = [
    {
      id: professionalIdFirst,
      userId: userIdSecond,
      licenseNumber: 'LIC123',
      category: 'Eletricista',
      yearsOfExperience: 5,
      verified: true,
      resume: 'Experiência em instalações elétricas residenciais e comerciais.',
      metadata: {
        services: ['Instalação elétrica', 'Manutenção'],
        locations: [
          { city: 'São Paulo', state: 'SP', type: 'residencial' },
          { city: 'São Paulo', state: 'SP', type: 'comercial' },
        ],
      },
    },
  ]

  await db.insert(professionals).values(professionalData)
  console.log('Professionals inserted')

  // Insert contracts
  const contractID = randomUUID()
  const contractData = [
    {
      id: contractID,
      clientId: userIdFirst,
      professionalId: professionalIdFirst,
      status: 'PENDING',
      hourRate: 50,
      totalAmount: 500,
      details: {
        startDate: '2024-05-01',
        endDate: '2024-05-10',
        services: ['Instalação elétrica'],
        schedule: [
          { day: 'Segunda', start: '08:00', end: '17:00' },
          { day: 'Terça', start: '08:00', end: '17:00' },
        ],
        location: {
          city: 'São Paulo',
          state: 'SP',
          address: 'Rua Exemplo, 123',
        },
      },
    },
  ]

  await db.insert(contracts).values(contractData)
  console.log('Contracts inserted')

  // Insert addresses
  const addressData = [
    {
      id: randomUUID(),
      userId: userIdFirst,
      zipCode: '01234-567',
      addressLine: 'Rua Exemplo',
      number: '123',
      complement: 'Apto 45',
      district: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      reference: 'Próximo ao metrô',
    },
    {
      id: randomUUID(),
      contractId: contractID,
      zipCode: '01234-568',
      addressLine: 'Rua Trabalho',
      number: '456',
      complement: null,
      district: 'Vila Madalena',
      city: 'São Paulo',
      state: 'SP',
      reference: null,
    },
  ]

  await db.insert(address).values(addressData)
  console.log('Addresses inserted')

  console.log('Seeding completed!')
  process.exit(0)
}

seed().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
