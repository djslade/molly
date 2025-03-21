package main

import (
	"testing"

	"github.com/djslade/molly-recipes/internal/testutils"
)

func TestNormalizeURL(t *testing.T) {
	tests := []struct {
		name          string
		input         string
		expectedUrl   string
		expectedError error
	}{
		{
			name:        "HTTPS and trailing /",
			input:       "https://blog.boot.dev/path/",
			expectedUrl: "blog.boot.dev/path",
		},
		{
			name:        "HTTPS",
			input:       "https://blog.boot.dev/path",
			expectedUrl: "blog.boot.dev/path",
		},
		{
			name:        "HTTP and trailing /",
			input:       "http://blog.boot.dev/path/",
			expectedUrl: "blog.boot.dev/path",
		},
		{
			name:        "HTTP",
			input:       "http://blog.boot.dev/path",
			expectedUrl: "blog.boot.dev/path",
		},
		{
			name:          "Empty",
			input:         "",
			expectedUrl:   "",
			expectedError: errInvalidUrl,
		},
		{
			name:          "Invalid URL",
			input:         "Hello world",
			expectedUrl:   "",
			expectedError: errInvalidUrl,
		},
		{
			name:          "No protocol",
			input:         "blog.boot.dev/path/",
			expectedUrl:   "",
			expectedError: errInvalidUrl,
		},
		{
			name:        "All caps",
			input:       "HTTPS://BLOG.BOOT.DEV/PATH",
			expectedUrl: "blog.boot.dev/path",
		},
		{
			name:        "Shaksuka",
			input:       "https://www.budgetbytes.com/shakshuka/",
			expectedUrl: "www.budgetbytes.com/shakshuka",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actualUrl, actualErr := normalizeUrl(tt.input)
			testutils.AssertEqual(t, actualUrl, tt.expectedUrl)
			if tt.expectedError != nil {
				testutils.AssertErrorsEqual(t, actualErr, tt.expectedError)
			}
		})
	}
}
