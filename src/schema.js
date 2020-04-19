const axios = require('axios')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql')

// Hardcoded data
// const Customers = [
//     {id: '1', name: 'John Doe', email: 'jdoe@gmail.com', age: 35},
//     {id: '2', name: 'John Doe2', email: 'jdoe2@gmail.com', age: 37},
//     {id: '3', name: 'John Doe3', email: 'jdoe3@gmail.com', age: 38},
//     {id: '4', name: 'John Doe4', email: 'jdoe4@gmail.com', age: 39},
//     {id: '5', name: 'John Doe5', email: 'jdoe5@gmail.com', age: 60},
// ]
// Customer Type
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id:{type:GraphQLString}
            },
            resolve(parentValue, args) {
                // for(let i = 0; i < Customers.length; i++) {
                //     if (Customers[i].id === args.id) {
                //         return Customers[i]
                //     }
                // }
                return axios.get('http://localhost:3000/customers/' + args.id)
                    .then(res => res.data )
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {
                return axios.get('http://localhost:3000/customers/')
                    .then(res => res.data )
            }
        }
    }
})

// mutation
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCustomer: {
            type:CustomerType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args) {
                return axios.post('http://localhost:3000/customers/', {
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                .then(res => res.data)
            }
        },
        updateCustomer: {
            type:CustomerType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args) {
                return axios.patch('http://localhost:3000/customers/' + args.id, args)
                .then(res => res.data)
            }
        },
        deleteCustomer: {
            type:CustomerType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args) {
                return axios.delete('http://localhost:3000/customers/' + args.id)
                .then(res => res.data)
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation
})

module.exports = schema