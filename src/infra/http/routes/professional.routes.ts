import { FastifyInstance } from 'fastify'
import { Role } from '../../../domain/entities/role'
import { requireAuth } from '../middlewares/auth.middleware'
import { CreateProfessionalService } from '../../../service/professional/create-professional-usecase'
import z from 'zod'
import { ProfessionalCategory } from '../../../domain/entities/professional/professional-cateogry'
import { ListProfessionalsService } from '../../../service/professional/list-professionals-usecase'
import { logger } from '../../utils/logger'
import { appendFile } from 'node:fs'
import { DetailProfessionalUseCase } from '../../../service/professional/detail-usecase'

export interface ProfessionalRoutesDependencies {
  createProfessionalService: CreateProfessionalService
  listProfessionalsService: ListProfessionalsService
  detailProfessionalService: DetailProfessionalUseCase
}

export function professionalRoutes(deps: ProfessionalRoutesDependencies) {
  return async function (app: FastifyInstance) {
    const {
      createProfessionalService,
      listProfessionalsService,
      detailProfessionalService,
    } = deps

    app.get('/list', async (request, reply) => {
      const professionals = await listProfessionalsService.execute()
      logger.info(
        `Listando profissionais, total encontrado: ${professionals.length}`,
      )
      return reply.send(professionals)
    })

    app.post(
      '',
      {
        preHandler: [requireAuth([Role.PROFESSIONAL, Role.ADMIN, Role.CLIENT])],
      },
      async (request, reply) => {
        const createProfessionalSchema = z.object({
          userId: z.string().uuid({ message: 'ID de usuário inválido' }),
          nomeCompleto: z.string().min(3, 'Nome muito curto').max(255),

          // Usamos nativeEnum para validar contra o seu Enum do TypeScript
          areaAtuacao: z.nativeEnum(ProfessionalCategory),

          // .nullable() permite null, .optional() permite undefined (a chave não existir)
          numeroRegistro: z.string().nullable(),
          resumoProfissional: z
            .string()
            .min(10, 'O resumo deve ter pelo menos 10 caracteres'),

          // Contatos
          telefone: z.string().min(8, 'Telefone inválido'),
          telefoneWhatsapp: z.boolean(),

          telefoneSecundario: z.string().nullable().optional(),
          telefoneSecundarioWhatsapp: z.boolean().default(false),

          // Redes Sociais
          linkedin: z.string().nullable(),
          instagram: z.string().nullable(),
          facebook: z.string().nullable(),

          // Endereço
          cep: z.string().length(8, 'CEP deve ter 8 dígitos'),
          logradouro: z.string().min(1, 'Logradouro é obrigatório'),
          numero: z.string().min(1, 'Número é obrigatório'),
          complemento: z.string().nullable(),
          bairro: z.string().min(1, 'Bairro é obrigatório'),
          cidade: z.string().min(1, 'Cidade é obrigatória'),
          uf: z
            .string()
            .length(2, 'UF deve ter 2 caracteres')
            .transform((v) => v.toUpperCase()),
          referencia: z.string().nullable(),
        })
        const data = createProfessionalSchema.parse(request.body)

        await createProfessionalService.execute(data)

        return reply.send({
          message: 'Rota de registro de profissional - em construção',
        })
      },
    )
    app.get(
      '/:id',
      {
        preHandler: [requireAuth([Role.PROFESSIONAL, Role.ADMIN, Role.CLIENT])],
      },
      async (request, reply) => {
        const { id } = request.params as { id: string }
        try {
          const professional = await detailProfessionalService.execute(id)
          return reply.send(professional)
        } catch (error) {
          logger.error(
            { professionalId: id, error },
            'Erro ao buscar detalhes do profissional',
          )
          return reply.code(500).send({
            error: 'Internal Server Error',
            message: 'Ocorreu um erro ao buscar os detalhes do profissional.',
          })
        }
      },
    )
  }
}
