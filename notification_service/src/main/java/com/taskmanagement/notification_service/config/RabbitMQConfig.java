package com.taskmanagement.notification_service.config;


import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${spring.rabbitmq.queue.notification}")
    private String notificationQueue;

    @Value("${spring.rabbitmq.exchange.main}")
    private String mainExchange;

    @Value("${spring.rabbitmq.routing.key.notification}")
    private String notificationRoutingKey;

    @Bean
    public Queue notificationQueue() {
        return new Queue(notificationQueue, true);
    }

    @Bean
    public TopicExchange mainExchange() {
        return new TopicExchange(mainExchange);
    }

    @Bean
    public Binding bindingNotification(Queue notificationQueue, TopicExchange mainExchange) {
        return BindingBuilder.bind(notificationQueue).to(mainExchange).with(notificationRoutingKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}