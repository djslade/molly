package pubsub

import (
	amqp "github.com/rabbitmq/amqp091-go"
)

func NewConnection(url string) (*amqp.Connection, error) {
	conn, err := amqp.Dial(url)
	return conn, err
}

func NewChannel(conn *amqp.Connection) (*amqp.Channel, error) {
	ch, err := conn.Channel()
	return ch, err
}
