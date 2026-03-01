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
	if err != nil {
		return nil, err
	}

	return recipeFromPB(res.Recipe), nil
}

func recipeFromPB(r *recipespb.Recipe) *Recipe {
	if r == nil {
		return nil
	}

	ingredients := make([]Ingredient, 0, len(r.Ingredients))
	for _, ing := range r.Ingredients {
		ingredients = append(ingredients, Ingredient{
			ID:              ing.Id,
			RecipeID:        ing.RecipeId,
			FullText:        ing.FullText,
			IsOptional:      ing.IsOptional,
			Name:            ing.Name,
			Quantity:        float64(ing.Quantity),
			QuantityString:  ing.QuantityString,
			Unit:            ing.Unit,
			Size:            ing.Size,
			IngredientGroup: ing.IngredientGroup,
			Created:         ing.Created,
		})
	}

	instructions := make([]Instruction, 0, len(r.Instructions))
	for _, inst := range r.Instructions {

		timers := make([]Timer, 0, len(inst.Timers))
		for _, t := range inst.Timers {
			timers = append(timers, Timer{
				ID:            t.Id,
				InstructionID: t.InstructionId,
				Value:         t.Value,
				Unit:          t.Unit,
				Created:       t.Created,
			})
		}

		instructions = append(instructions, Instruction{
			ID:       inst.Id,
			RecipeID: inst.RecipeId,
			Index:    inst.Index,
			FullText: inst.FullText,
			HasTimer: inst.HasTimer,
			Timers:   timers,
			Created:  inst.Created,
		})
	}

	return &Recipe{
		ID:               r.Id,
		RecipeURL:        r.RecipeUrl,
		Title:            r.Title,
		Description:      r.Description,
		Cuisine:          r.Cuisine,
		CookingMethod:    r.CookingMethod,
		Category:         r.Category,
		ImageURL:         r.ImageUrl,
		Yields:           r.Yields,
		PrepTimeMinutes:  r.PrepTimeMinutes,
		CookTimeMinutes:  r.CookTimeMinutes,
		TotalTimeMinutes: r.TotalTimeMinutes,
		Created:          r.Created,
		Ingredients:      ingredients,
		Instructions:     instructions,
	}
}
