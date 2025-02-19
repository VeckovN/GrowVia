import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@product/config';
import { Client } from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";
import { ProductDocumentInterface } from "@veckovn/growvia-shared";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'productService', 'debug');

const client = new Client({
    node: `${config.ELASTICSEARCH_URL}`
})

async function checkConnection(): Promise<void> {
    try{
        let isConnected = false;
        while(!isConnected){ 
            const health: ClusterHealthResponse = await client.cluster.health({});
            log.info(`Product service elasticSearch health status: ${health.status}`);
            isConnected = true;
        }
    }
    catch(error){
        log.error("ElasticSearch connection failed...");
        log.log("error", "Product service checkConnection error: ", error);
    }
}

async function createIndex(index: string): Promise<void>{
    try{
        const checkIndex:boolean = await client.indices.exists({ index: index })
        if(checkIndex){
            log.info(`Index ${index} already created`);
        }
        else{
            await client.indices.create({ index: index });
            await client.indices.refresh({ index: index });
            log.info(`Created index ${ index }`);
        } 
    }
    catch(error){
        log.error("")
        log.log('error', 'ProductService createIndex error: ', error);
    }
}

async function getDataIndex(index: string, docID: string): Promise<ProductDocumentInterface>{
    //getting data that is indexed
    try{
        const result = await client.get({ index: index, id: docID})
        return result._source as ProductDocumentInterface; //data is in the ._source obj
    }
    catch(error){
        log.error("")
        log.log('error', 'ProductService getDataIndex error: ', error);
        return {} as ProductDocumentInterface;
    }
}

//example for stroing product -> the dockID will be productID
async function addDataToIndex(index: string, docID: string, productDocument:any):Promise<void>{
    //getting data that is indexed
    try{
        await client.index({
            index: index,
            id: docID,
            document: productDocument //add data to the document obj
        })
    }
    catch(error){
        log.error("")
        log.log('error', 'ProductService addDataIndex error: ', error);
    }
}

async function updateDataIndex(index: string, docID: string, productDocument:any):Promise<void>{
    //getting data that is indexed
    try{
        await client.update({
            index: index,
            id: docID,
            doc: productDocument //for update use 'doc' instead of 'document'
        })
    }
    catch(error){
        log.error("")
        log.log('error', 'ProductService updateDataIndex error: ', error);
    }
}

async function deleteDataIndex(index: string, docID: string):Promise<void>{
    //getting data that is indexed
    try{
        await client.delete({
            index: index,
            id: docID,
        })
    }
    catch(error){
        log.error("")
        log.log('error', 'ProductService deleteDataIndex error: ', error);
    }
}
 


export {
    client,
    checkConnection,
    createIndex,
    getDataIndex,
    addDataToIndex,
    updateDataIndex,
    deleteDataIndex
}