import { client } from "@product/elasticsearch";
import { SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { SearchResultInterface, PaginatePropsInterface, ElasticQueryInterface } from "@veckovn/growvia-shared";

//Search feature for finding Farmers Products
const productsSerachByFarmerID = async(farmerID: string): Promise<SearchResultInterface> => {
    const query = [{
        query_string:{ //Used for full-text searches with advanced features like wildcards (*, ?),
            fields: ['farmerID'],
            query: `*${farmerID}*` //fields value
        }
    }]

    //returns 'hits' array with found farmer products obj
    const result: SearchResponse = await client.search({
        index: 'products',
        query: { //The core of any Elasticsearch search request (bool, match, term)
            bool: { //Combines multiple query clauses with logical operators.
                must: [...query] //(similar to SQL AND).
            } 
        }
    })

    //hit results:
    // const totalObj = result.hits.total;
    return {
        hits: result.hits.hits, //array of found products
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

//serach all fields(that is passed) with paggination
const productsSearch = async(searchQuery:string, paginate:PaginatePropsInterface, minPrice?:number, maxPrice?:number):Promise<SearchResultInterface> =>{

    const {size, from, type} = paginate;
    const sortOrder = type === 'forward' ? 'asc' : 'desc';
    const queries: ElasticQueryInterface[] = [
        {
            query_string: {
                fields: ['name', 'description', 'shortDescription','categories', 'subCategories', 'tags'], //all fields participating in the filter
                query: `*${searchQuery}*` //passed fields value 
            }
        },
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
        size, //size for paggination (return products count )
        query: { 
            bool: { 
                must: [...queries]
            } 
        },
        sort: [ //sort in asc or desc depeneds on type prop
            //best practivce to use 'createdAt' timestamp instead of custom ID on product creating
            {
                createdAt: {
                    order: sortOrder,
                }
                // createdAt: sortOrder
                //can be sort by 'price' as well ()
            }
        ],
        //use search_after when is requested for page (not first page)
        ...(from !== '0' && { serach_after: [from]})
    })

    return {
        hits: result.hits.hits, 
    }
}


//get products that looks similar (based on properties that passed) 

const getMoreSimilarProducts = async(productID: string):Promise<SearchResultInterface> =>{
    //elasticSearch will automatically match some similar fileds that look like passed document(productID)
    const result: SearchResponse = await client.search({
        index: 'products',
        size: 6,
        query: { //write directly
            more_like_this: {
                fields: ['name', 'description', 'shortDescription','categories', 'subCategories', 'tags'],
                like:[
                    {
                        _index: "products",
                        _id: productID  //check document with 'id' that look like similar 
                    }
                ]
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