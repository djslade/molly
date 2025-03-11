package cleaners

import (
	"testing"

	"github.com/djslade/molly/molly-scraper/internal/testutils"
)

func TestRemoveSpecialCharacters(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "Removes *",
			input:    "Hello, World!*",
			expected: "Hello, World!",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual := RemoveSpecialCharacters(tt.input)
			testutils.AssertEqual(t, actual, tt.expected)
		})
	}
}

func TestRemovePriceInfo(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "Happy path",
			input:    "",
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual := RemovePriceInfo(tt.input)
			testutils.AssertEqual(t, actual, tt.expected)
		})
	}
}
