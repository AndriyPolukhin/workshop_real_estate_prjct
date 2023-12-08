import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	schema: './src/graphql/typeDefs.ts',
	generates: {
		'./src/graphql/types.ts': {
			plugins: ['typescript', 'typescript-resolvers'],
		},
	},
}

export default config
