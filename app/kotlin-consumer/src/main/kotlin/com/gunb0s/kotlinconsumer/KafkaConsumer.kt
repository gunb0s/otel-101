package com.gunb0s.kotlinconsumer

import org.apache.kafka.clients.consumer.ConsumerRecord
import org.slf4j.LoggerFactory
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

@Component
class KafkaConsumer {
    companion object {
        val logger = LoggerFactory.getLogger(KafkaConsumer::class.java)
    }
    @KafkaListener(topics = ["orders"], containerFactory = "kafkaListenerContainerFactory")
    fun receive(consumerRecord: ConsumerRecord<String, OrderDto>) {
        logger.info("Received Messasge in group test: ${consumerRecord.value()}")
    }
}
