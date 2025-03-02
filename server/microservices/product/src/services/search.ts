import { client } from "@product/elasticsearch";
import { SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { SearchResultInterface, PaginatePropsInterface, ElasticQueryInterface } from "@veckovn/growvia-shared";

const productsSerachByFarmerID = async(farmerID: string): Promise<SearchResultInterface> => {
    const query = [{
        query_string:{ 
            fields: ['farmerID'],
            query: `*${farmerID}*` 
        }
    }]

    const result: SearchResponse = await client.search({
        index: 'products',
        query: { 
            bool: {
                must: [...query] //(similar to SQL AND).
            } 
        }
    })

    return {
        hits: result.hits.hits, 
    }
}   

const productsSerachByCategory = async(category: string): Promise<SearchResultInterface> => {
    const result: SearchResponse = await client.search({
        index: 'products',
        size: 10, 
        query: { 
            bool: {
                must: [
                    {
                        query_string:{
                            fields: ['categories'],
                            query: `*${category}*` 
                        }
                    }
                ]
            }
        }
    })

    return {
        hits: result.hits.hits, 
    }
}

const productsSearch = async(searchQuery:string, paginate:PaginatePropsInterface, minPrice?:number, maxPrice?:number):Promise<SearchResultInterface> =>{
    const {size, from, type} = paginate;
    const sortOrder = type === 'forward' ? 'asc' : 'desc';
    const queries: ElasticQueryInterface[] = [
        {
            query_string: {
                fields: ['name', 'description', 'shortDescription','categories', 'subCategories', 'tags'], //all fields participating in the filter
                query: `*${searchQuery}*`
            }
        }
        // {
        //     term: {
        //         active: true
        //     }
        // }
    ]

    //if is the min and max price passed
    if (!Number.isNaN(parseInt(`${minPrice}`)) && !Number.isNaN(parseInt(`${maxPrice}`))) {
        queries.push({
            range: {
                price: {
                    gte: minPrice,
                    lte: maxPrice
                }
            }
        });
    }

    const result: SearchResponse = await client.search({
        index: 'products',
        size, //pagination size
        query: { 
            bool: { 
                must: [...queries]
            } 
        },
        sort: [ 
            {
                createdAt: {
                    order: sortOrder,
                }
            }
        ],
        //use search_after when is requested for page (not first page)
        ...(from !== '0' && { serach_after: [from]})
    })

    return {
        hits: result.hits.hits, 
    }
}

const getMoreSimilarProducts = async(productID: string):Promise<SearchResultInterface> =>{
    const result: SearchResponse = await client.search({
        index: 'products',
        size: 6,
        query: { 
            more_like_this: {
                fields: ['name', 'description', 'shortDescription','categories', 'subCategories', 'tags'],
                like:[
                    {
                        _index: "products",
                        _id: productID  //check document with 'id' that look like similar 
                    },
                ],
                min_term_freq: 1,
                min_doc_freq: 1,
                max_query_terms: 12,
                minimum_should_match: '30%',
                boost_terms: 1,
            }
        }
    })

    return {
        hits: result.hits.hits, 
    }
}

export {
    productsSerachByFarmerID,
    productsSerachByCategory,
    productsSearch,
    getMoreSimilarProducts
}