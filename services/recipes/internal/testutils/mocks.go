package testutils

import (
	"context"
	"database/sql"

	"github.com/djslade/molly-recipes/internal/database"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockQueries struct {
	mock.Mock
}

func (m *MockQueries) WithTx(tx *sql.Tx) *database.Queries {
	args := m.Called(tx)
	return args.Get(0).(*database.Queries)
}

func (m *MockQueries) GetRecipeByID(ctx context.Context, id uuid.UUID) (database.Recipe, error) {
	args := m.Called(ctx, id)
	return args.Get(0).(database.Recipe), args.Error(1)
}

func (m *MockQueries) GetRecipeByURL(ctx context.Context, url string) (database.Recipe, error) {
	args := m.Called(ctx, url)
	return args.Get(0).(database.Recipe), args.Error(1)
}

func (m *MockQueries) CreateRecipe(ctx context.Context, arg database.CreateRecipeParams) (database.Recipe, error) {
	args := m.Called(ctx, arg)
	return args.Get(0).(database.Recipe), args.Error(1)
}

func (m *MockQueries) GetIngredientsByRecipeID(ctx context.Context, recipeID uuid.UUID) ([]database.Ingredient, error) {
	args := m.Called(ctx, recipeID)
	return args.Get(0).([]database.Ingredient), args.Error(1)
}

func (m *MockQueries) GetInstructionsByRecipeID(ctx context.Context, recipeID uuid.UUID) ([]database.Instruction, error) {
	args := m.Called(ctx, recipeID)
	return args.Get(0).([]database.Instruction), args.Error(1)
}

func (m *MockQueries) GetTimersByInstructionID(ctx context.Context, instructionID uuid.UUID) ([]database.Timer, error) {
	args := m.Called(ctx, instructionID)
	return args.Get(0).([]database.Timer), args.Error(1)
}

func (m *MockQueries) CreateIngredient(ctx context.Context, arg database.CreateIngredientParams) (database.Ingredient, error) {
	args := m.Called(ctx, arg)
	return args.Get(0).(database.Ingredient), args.Error(1)
}

func (m *MockQueries) CreateInstruction(ctx context.Context, arg database.CreateInstructionParams) (database.Instruction, error) {
	args := m.Called(ctx, arg)
	return args.Get(0).(database.Instruction), args.Error(1)
}

func (m *MockQueries) CreateTimer(ctx context.Context, arg database.CreateTimerParams) (database.Timer, error) {
	args := m.Called(ctx, arg)
	return args.Get(0).(database.Timer), args.Error(1)
}

func (m *MockQueries) CountRecipes(ctx context.Context) (int64, error) {
	args := m.Called(ctx)
	return args.Get(0).(int64), args.Error(1)
}

func (m *MockQueries) GetRecipes(ctx context.Context, limit int32) ([]database.Recipe, error) {
	args := m.Called(ctx, limit)
	return args.Get(0).([]database.Recipe), args.Error(1)
}

type MockDB struct {
	mock.Mock
}

func (m *MockDB) Begin() (*sql.Tx, error) {
	args := m.Called()
	return args.Get(0).(*sql.Tx), args.Error(1)
}
