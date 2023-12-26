import merge from 'lodash.merge'
import { viewerResolvers } from './Viewer/index.js'
import { userResolvers } from './User/index.js'

export const resolvers = merge(userResolvers, viewerResolvers)
