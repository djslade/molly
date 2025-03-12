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
			actual := removeSpecialCharacters(tt.input)
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
			name:     "Removes price info",
			input:    "Eggs ($1.05)",
			expected: "Eggs ",
		},
		{
			name:     "Removes price info pounds",
			input:    "Eggs (£1.05)",
			expected: "Eggs ",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual := removePriceInfo(tt.input)
			testutils.AssertEqual(t, actual, tt.expected)
		})
	}
}

func TestRemoveFullStops(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "Removes full stops at end of sentences",
			input:    "This is a sentence.",
			expected: "This is a sentence",
		},
		{
			name:     "Does not remove elipsis",
			input:    "This... is a sentence",
			expected: "This... is a sentence",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual := RemoveFullStops(tt.input)
			testutils.AssertEqual(t, actual, tt.expected)
		})
	}
}
