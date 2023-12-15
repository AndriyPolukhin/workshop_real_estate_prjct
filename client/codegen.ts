import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	schema: 'http://localhost:9000/api',
	documents: ['src/lib/graphql/**/*.ts'],
	generates: {
		'./src/lib/graphql/__generated__/': {
			preset: 'client',
			presetConfig: {
				gqlTagName: 'gql',
			},
		},
	},
}

export default config
