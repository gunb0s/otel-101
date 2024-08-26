package com.gunb0s.kotlinconsumer

import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.StringDeserializer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory
import org.springframework.kafka.core.ConsumerFactory
import org.springframework.kafka.core.DefaultKafkaConsumerFactory
import org.springframework.kafka.support.serializer.JsonDeserializer


data class OrderDto(val requestId: String)

@EnableKafka
@Configuration
class KafkaConsumerConfig {
    @Bean
    fun consumerFactory(): ConsumerFactory<String, OrderDto> {
        val props = HashMap<String, Any>()
        props[ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG] = "localhost:10000"
        props[ConsumerConfig.GROUP_ID_CONFIG] = "kotlin-consumer"
        props[ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG] = StringDeserializer::class.java
        props[ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG] = JsonDeserializer::class.java

        val deserializer = JsonDeserializer<OrderDto>(OrderDto::class.java)

        return DefaultKafkaConsumerFactory(props, StringDeserializer(), deserializer)
    }

    @Bean
    fun kafkaListenerContainerFactory(): ConcurrentKafkaListenerContainerFactory<String, OrderDto> {
        val factory = ConcurrentKafkaListenerContainerFactory<String, OrderDto>()
        factory.consumerFactory = consumerFactory()
        return factory
    }

    @Bean
    fun filterListenerContainerFactory(): ConcurrentKafkaListenerContainerFactory<String, OrderDto> {
        val factory = ConcurrentKafkaListenerContainerFactory<String, OrderDto>()
        factory.consumerFactory = consumerFactory()
        factory.setRecordFilterStrategy { record -> record.value().requestId == "3353e272-2be1-496b-bf75-b5add46689dd" }

        return factory
    }
}
