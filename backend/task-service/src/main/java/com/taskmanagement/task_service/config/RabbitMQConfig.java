package com.taskmanagement.task_service.config;


import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${spring.rabbitmq.queue.user}")
    private String queueName;

    @Value("${spring.rabbitmq.queue.user_delete}")
    private String userDeleteQueue;

    @Value("${spring.rabbitmq.exchange.user}")
    private String userExchange;

    @Value("${spring.rabbitmq.exchange.task}")
    private String taskExchange;

    @Bean
    public TopicExchange taskExchange() {
        return new TopicExchange(taskExchange);
    }

    @Bean
    public TopicExchange userExchange() {
        return new TopicExchange(userExchange);
    }

    @Bean
    public Queue notificationQueue() {
        return new Queue("notification_queue", true);
    }

    @Bean
    public Binding notificationBinding(Queue notificationQueue, @Qualifier("taskExchange") TopicExchange taskExchange) {
        return BindingBuilder.bind(notificationQueue)
                .to(taskExchange)
                .with("task.event.*");
    }

    @Bean
    public Queue queue() {
        return new Queue(queueName, true);
    }

    @Bean
    public Queue userDeleteQueue() {
        return new Queue(userDeleteQueue, true);
    }

    @Bean
    public Binding binding(Queue queue, @Qualifier("userExchange") TopicExchange userExchange) {
        return BindingBuilder.bind(queue)
                .to(userExchange)
                .with("user.update");
    }

    @Bean
    public Binding userDeleteBinding(Queue userDeleteQueue, @Qualifier("userExchange") TopicExchange userExchange) {
        return BindingBuilder.bind(userDeleteQueue)
                .to(userExchange)
                .with("user.event.deleted");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }
}