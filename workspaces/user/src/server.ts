import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'

import { buildFederatedSchema } from 'common/build-federated-schema'

import { UserResolver } from './resolver'
import { User } from './user'
import { resolveUserReference } from './user-reference'

export const server = async (options: { port: number }): Promise<string> => {
  const schema = await buildFederatedSchema(
    {
      orphanedTypes: [User],
      resolvers: [UserResolver]
    },
    {
      User: { __resolveReference: resolveUserReference }
    }
  )

  const apolloServer = new ApolloServer({ schema })

  const { url } = await apolloServer.listen({ port: options.port })
  console.log(`User service ready at ${url}`)

  return url
}

server({ port: 4001 }).catch(console.error)
