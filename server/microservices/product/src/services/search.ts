import { client } from "@product/elasticsearch";
import { FieldSort, SearchResponse, SortCombinations } from "@elastic/elasticsearch/lib/api/types";
// import { SearchResultInterface, PaginatePropsInterface, ElasticQueryInterface, ProductDocumentInterface } from "@veckovn/growvia-shared";
import { SearchResultInterface, SearchHitTotalInterface ,ProductSearchOptionsInterface } from "@veckovn/growvia-shared";

interface FarmerProductsQueryOptions {
  farmerID: string;
  from?: number;
  size?: number;
  sort?: 'newest' | 'oldest' | 'available'
}

const productsSerachByFarmerID = async(options: FarmerProductsQueryOptions): Promise<SearchResultInterface> => {
    const { farmerID, from = 0, size = 10, sort = 'newest' } = options;

    const query = [{
        query_string:{ 
            fields: ['farmerID'],
            query: `*${farmerID}*` 
        }
    }]

    const sortParams: SortCombinations[] = [];
    switch (sort) {
        case 'newest':
            sortParams.push({ createdAt: { order: 'desc' } });
            break;
        case 'oldest':
            sortParams.push({ createdAt: { order: 'asc' } });
            break;
        case 'available':
            sortParams.push(
                { stock: { order: 'desc' } },     // in-stock first
                { createdAt: { order: 'desc' } }  // newest next
            );
            break;
        default:
            sortParams.push('_score'); // relevance in Elasticsearch
    }

    const result: SearchResponse = await client.search({
        index: 'products',
        from,
        size,
        sort: sortParams,
        query: {
            bool: {
                must: query,
            },
        },
        track_total_hits: true,
    });

    const total: SearchHitTotalInterface = result.hits.total as SearchHitTotalInterface;
    return {
        hits: result.hits.hits, 
        total: total.value
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
                            fields: ['category'],
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

//refactor: unified product serach with full filter support
const productsSearch = async(options: ProductSearchOptionsInterface):Promise<SearchResultInterface> => {
    const query: any = {
        bool: {
            must: [] as any[]
        }
    };

    //text search
    if(options.query){
        query.bool.must.push({
            query_string: {
                // fields: ['name', 'description', 'shortDescription','category', 'subCategories', 'tags'], //all fields participating in the filter
                fields: ['name'], /// search only for product name
                query: `*${options.query}*`
            }
        })
    }

    if(options.category){
        query.bool.must.push({
            term: { 'category.keyword': options.category}
        });
    }

    if(options.subCategories?.length){
        query.bool.must.push({
            terms: {'subCategories.keyword': options.subCategories}
        });
    }

    if (options.minPrice !== undefined && options.maxPrice !== undefined) {
        query.bool.must.push({
            range: {
                price: {
                    gte: options.minPrice,
                    lte: options.maxPrice
                }
            }
        });
    }

    if(options.quantity){
        query.bool.must.push({
            range: {  availableQuantity: { gte: options.quantity}}
        });
    }

    if(options.unit){
        query.bool.must.push({
            term: { 'unit.keyword': options.unit }
        });
    }

    //Sorting Options
    const sort: SortCombinations[] = [];

    switch (options.sort) {
        case 'price_asc':
            sort.push({ price: { order: 'asc' } as FieldSort });
            break;
        case 'price_desc':
            sort.push({ price: { order: 'desc' } as FieldSort });
            break;
        case 'newest':
            sort.push({ createdAt: { order: 'desc' } as FieldSort });
            break;
        case 'relevant':
            sort.push('_score');
            break;
        default:
            sort.push('_score');
    }

    //run search
    const result: SearchResponse = await client.search({
        index: 'products',
        body:{
            query,
            sort,
            from: options.from || 0,
            size: options.size || 12,
            track_total_hits:true
        }
    })

    const total: SearchHitTotalInterface = result.hits.total as SearchHitTotalInterface;
    return {
        hits: result.hits.hits, 
        total: total.value
    }
}


const getMoreSimilarProducts = async(productID: string):Promise<SearchResultInterface> =>{
    const result: SearchResponse = await client.search({
        index: 'products',
        size: 6,
        query: { 
            more_like_this: {
                fields: ['name', 'description', 'shortDescription','category', 'subCategories', 'tags'],
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

const getNewestProducts = async(limit: number = 10): Promise<SearchResultInterface> =>{

    const result: SearchResponse = await client.search({
        index:'products',
        size: limit,
        query: {
            match_all: {}
        },
        sort: [
            {
                createdAt: {
                    order: 'desc', 
                }
            }
        ],
        //We can create filter to only dispay available products (stock > 0)
        post_filter: {
            range: {
                stock: {
                    gt:0 //only products with stock > 0
                }
            }
        }
        
    });

    return {
        hits: result.hits.hits
    }
}

export {
    productsSerachByFarmerID,
    productsSerachByCategory,
    productsSearch,
    getMoreSimilarProducts,
    getNewestProducts
}