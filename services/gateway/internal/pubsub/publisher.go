package pubsub

import (
	"context"
	"encoding/json"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Publisher struct {
	ch *amqp.Channel
}

type RequestData struct {
	RecipeURL string `json:"recipe_url"`
}

type ScraperRequest struct {
	Data RequestData `json:"data"`
}

func NewPublisher(ch *amqp.Channel) *Publisher {
	return &Publisher{ch: ch}
}

func (p *Publisher) SendScraperRequest(ctx context.Context, recipeUrl string) error {
	request := ScraperRequest{
		Data: RequestData{
			RecipeURL: recipeUrl,
		},
	}
	body, err := json.Marshal(request)
	if err != nil {
		return err
	}

	return p.ch.PublishWithContext(
		ctx,
		"",
		"scraper.requests",
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
}
