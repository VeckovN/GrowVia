import { winstonLogger } from "@veckovn/growvia-shared";
import {Client} from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";
import { Logger } from "winston";
import { config } from '@notification/config';

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'notificationElasticSearch', 'debug');

const client = new Client({
    node: `${config.ELASTICSEARCH_URL}`
})

export async function checkConnection(): Promise<void> {
    try{
        const health: ClusterHealthResponse = await client.cluster.health({});
        log.info(`Notification service elasticSearch health status: ${health.status}`);
    }
    catch(error){
        log.error("ElasticSearch connection failed...");
        log.log("error", "Notification service checkConnection", error);
    }
}


