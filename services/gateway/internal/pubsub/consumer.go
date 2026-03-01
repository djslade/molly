package pubsub

import (
	"context"
	"encoding/json"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Hub interface {
	Send(url string, v any)
}

type RecipeService interface {
	GetRecipeWithUrl(ctx context.Context, id string) (string, error)
}

type ScraperResultsConsumer struct {
	ch            *amqp.Channel
	hub           Hub
	recipeService RecipeService
}

const exchange = "amq.topic"
const queue = "scraper.results"

func NewScraperResultsConsumer(ch *amqp.Channel, hub Hub, recipeService RecipeService) *ScraperResultsConsumer {
	return &ScraperResultsConsumer{
		ch:            ch,
		hub:           hub,
		recipeService: recipeService,
	}
}

func (c *ScraperResultsConsumer) Setup() error {

	_, err := c.ch.QueueDeclare(
		queue,
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	keys := []string{
		"scraper.results.ok",
		"scraper.results.invalid",
		"scraper.results.fail",
		"scraper.results.unknown",
		"scraper.results.internal",
		"scraper.results.unavailable",
	}

	for _, k := range keys {
		if err := c.ch.QueueBind(queue, k, exchange, false, nil); err != nil {
			return err
		}
	}

	return nil
}

func (c *ScraperResultsConsumer) Start(ctx context.Context) error {

	msgs, err := c.ch.Consume(
		queue,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			case msg, ok := <-msgs:
				if !ok {
					return
				}
				c.dispatch(msg)
			}
		}
	}()

	return nil
}

func (c *ScraperResultsConsumer) dispatch(msg amqp.Delivery) {
	switch msg.RoutingKey {

	case "scraper.results.ok":
		c.handleOK(msg.Body)

	case "scraper.results.invalid":
		// c.handleInvalid(msg.Body)

	case "scraper.results.fail":
		// c.handleFail(msg.Body)

	case "scraper.results.unknown":
		// c.handleUnknown(msg.Body)

	case "scraper.results.internal":
		// c.handleInternal(msg.Body)

	case "scraper.results.unavailable":
		// c.handleUnavailable(msg.Body)
	}
}

type okPayload struct {
	RecipeURL string `json:"recipe_url"`
}

func (c *ScraperResultsConsumer) handleOK(body []byte) {

	var p okPayload
	if err := json.Unmarshal(body, &p); err != nil {
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	recipeId, err := c.recipeService.GetRecipeWithUrl(ctx, p.RecipeURL)
	if err != nil {
		return
	}

	// res := c.builder.New(recipe.ID, "")

	c.hub.Send(p.RecipeURL, recipeId)
}
