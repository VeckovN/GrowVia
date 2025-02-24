import { client } from "@product/elasticsearch";
import { SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { SearchResultInterface } from "@veckovn/growvia-shared";


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


export {
    productsSerachByFarmerID,
    productsSerachByCategory
}