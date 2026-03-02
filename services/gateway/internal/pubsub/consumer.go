package pubsub

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
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

type payload struct {
	Pattern string `json:"pattern"`
	Data    struct {
		URL string `json:"url"`
	} `json:"data"`
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
	var p payload
	if err := json.Unmarshal(msg.Body, &p); err != nil {
		return
	}
	fmt.Println(p)
	switch p.Pattern {

	case "scraper.results.ok":
		c.handleOK(p.Data.URL)

	case "scraper.results.invalid":
		//c.handleInvalid(msg.Body)

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

type ScraperResult struct {
	Event   string `json:"event"`
	Payload struct {
		ID    string `json:"id,omitempty"`
		Error string `json:"error,omitempty"`
	} `json:"payload"`
}

func (c *ScraperResultsConsumer) handleOK(recipeUrl string) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	log.Println(recipeUrl)

	recipeId, err := c.recipeService.GetRecipeWithUrl(ctx, recipeUrl)
	if err != nil {
		log.Printf("could not retrieve recipe URL, %v", err)
		return
	}

	res := ScraperResult{}

	res.Event = fmt.Sprintf("scrape.%v", recipeUrl)
	res.Payload.ID = recipeId

	c.hub.Send(recipeUrl, res)
}
