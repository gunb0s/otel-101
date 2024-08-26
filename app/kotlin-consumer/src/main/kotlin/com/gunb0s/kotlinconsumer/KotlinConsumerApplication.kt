package com.gunb0s.kotlinconsumer

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.kafka.annotation.KafkaListener

@SpringBootApplication
class KotlinConsumerApplication

fun main(args: Array<String>) {
    runApplication<KotlinConsumerApplication>(*args)
}
