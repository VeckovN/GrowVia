import { winstonLogger} from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@gateway/config';
import {Client} from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'gatewayService', 'debug');

const client = new Client({
    node: `${config.ELASTICSEARCH_URL}`
})

export async function checkConnection(): Promise<void> {
    try{
        let isConnected = false;
        while(!isConnected){ 
            const health: ClusterHealthResponse = await client.cluster.health({});
            log.info(`Gateway service elasticSearch health status: ${health.status}`);
            isConnected = true;
        }
    }
    catch(error){
        log.error("ElasticSearch connection failed...");
        log.log("error", "Gateway service checkConnection error: ", error);
    }
}
