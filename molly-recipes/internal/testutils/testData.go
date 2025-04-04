package testutils

import (
	"time"

	"github.com/djslade/molly-recipes/internal/database"
	pb "github.com/djslade/molly-recipes/internal/proto"
	"github.com/google/uuid"
)

var (
	Time       time.Time       = time.Now()
	RecipeID   uuid.UUID       = uuid.MustParse("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
	TestRecipe database.Recipe = database.Recipe{
		ID:               RecipeID,
		RecipeUrl:        "www.example.com/recipe",
		Title:            "Test Recipe",
		Description:      "A test recipe",
		Cuisine:          "Test Cuisine",
		CookingMethod:    "Test Method",
		Category:         "Test Category",
		ImageUrl:         "http://example.com/image.jpg",
		Yields:           "4 servings",
		PrepTimeMinutes:  10,
		CookTimeMinutes:  20,
		TotalTimeMinutes: 30,
		Created:          Time,
	}

	IngredientID   uuid.UUID           = uuid.MustParse("6ba7b811-9dad-11d1-80b4-00c04fd430c8")
	TestIngredient database.Ingredient = database.Ingredient{
		ID:              IngredientID,
		RecipeID:        RecipeID,
		FullText:        "1 cup flour",
		IsOptional:      false,
		Name:            "flour",
		Quantity:        1,
		QuantityString:  "1",
		Unit:            "cup",
		Size:            "",
		IngredientGroup: "",
		Created:         Time,
	}

	InstructionID   uuid.UUID            = uuid.MustParse("6ba7b812-9dad-11d1-80b4-00c04fd430c8")
	TestInstruction database.Instruction = database.Instruction{
		ID:       InstructionID,
		RecipeID: RecipeID,
		Index:    1,
		FullText: "Mix ingredients",
		HasTimer: true,
		Created:  Time,
	}

	TimerID   uuid.UUID      = uuid.MustParse("6ba7b813-9dad-11d1-80b4-00c04fd430c8")
	TestTimer database.Timer = database.Timer{
		ID:            TimerID,
		InstructionID: InstructionID,
		Value:         5,
		Unit:          "minutes",
		Created:       Time,
	}

	TestRPCTimer pb.Timer = pb.Timer{
		Id:            "6ba7b813-9dad-11d1-80b4-00c04fd430c8",
		InstructionId: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
		Value:         5,
		Unit:          "minutes",
		Created:       Time.String(),
	}
	TestRPCInstruction pb.Instruction = pb.Instruction{
		Id:       "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
		RecipeId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
		Index:    1,
		FullText: "Mix ingredients",
		HasTimer: true,
		Timers:   []*pb.Timer{&TestRPCTimer},
		Created:  Time.String(),
	}
	TestRPCIngredient pb.Ingredient = pb.Ingredient{
		Id:              "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
		RecipeId:        "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
		FullText:        "1 cup flour",
		IsOptional:      false,
		Name:            "flour",
		Quantity:        1,
		QuantityString:  "1",
		Unit:            "cup",
		Size:            "",
		IngredientGroup: "",
		Created:         Time.String(),
	}
	TestRPCRecipe pb.Recipe = pb.Recipe{
		Id:               "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
		RecipeUrl:        "www.example.com/recipe",
		Title:            "Test Recipe",
		Description:      "A test recipe",
		Cuisine:          "Test Cuisine",
		CookingMethod:    "Test Method",
		Category:         "Test Category",
		ImageUrl:         "http://example.com/image.jpg",
		Yields:           "4 servings",
		PrepTimeMinutes:  10,
		CookTimeMinutes:  20,
		TotalTimeMinutes: 30,
		Created:          Time.String(),
		Ingredients:      []*pb.Ingredient{&TestRPCIngredient},
		Instructions:     []*pb.Instruction{&TestRPCInstruction},
	}
)
