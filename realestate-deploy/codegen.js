const config = {
    schema: './src/graphql/schema.ts',
    generates: {
        './src/graphql/types.ts': {
            plugins: ['typescript', 'typescript-resolvers'],
        },
    },
};
export default config;
