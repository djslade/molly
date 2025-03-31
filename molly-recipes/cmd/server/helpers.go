package main

import (
	"errors"
	"net/url"
	"path"
	"strings"
)

var (
	errInvalidUrl error = errors.New("invalid URL")
)

func normalizeUrl(s string) (string, error) {
	parsed, err := url.Parse(s)
	if err != nil {
		return "", errInvalidUrl
	}
	if parsed.Host == "" {
		return "", errInvalidUrl
	}

	normalized := strings.ToLower(parsed.Host + parsed.Path)
	if !strings.HasPrefix(normalized, "www.") {
		normalized = "www." + normalized
	}
	return strings.ToLower(path.Clean(normalized)), nil
}
