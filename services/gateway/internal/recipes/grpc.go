package recipes

import (
	"context"

	"github.com/djslade/molly/internal/recipespb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type Client struct {
	conn   *grpc.ClientConn
	client recipespb.RecipesServiceClient
}

func New(addr string) (*Client, error) {
	conn, err := grpc.NewClient(
		addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return nil, err
	}

	return &Client{
		conn:   conn,
		client: recipespb.NewRecipesServiceClient(conn),
	}, nil
}

func (c *Client) Close() error {
	return c.conn.Close()
}

func (c *Client) GetRecipeWithId(ctx context.Context, id string) (*Recipe, error) {
	res, err := c.client.GetRecipeWithID(ctx, &recipespb.GetRecipeWithIDRequest{Id: id})
}

func recipeFromPb(*recipespb.RecipeResponse) Recipe {

}
