package cleaners

import (
	"regexp"
	"strings"
)

func removeSpecialCharacters(text string) string {
	return strings.ReplaceAll(text, "*", "")
}

func removePriceInfo(text string) string {
	costRX := regexp.MustCompile(`\([\p{Sc}][^)]+\)`)
	matches := costRX.FindStringSubmatch(text)
	for _, match := range matches {
		text = strings.ReplaceAll(text, match, "")
	}
	return text
}

func removeNewLines(text string) string {
	return strings.ReplaceAll(text, "\n", "")
}

func Clean(text string) string {
	cleaned := text
	cleaned = removePriceInfo(cleaned)
	cleaned = removeSpecialCharacters(cleaned)
	cleaned = removeNewLines(cleaned)

	return cleaned
}

func RemoveFullStops(text string) string {
	return strings.TrimSuffix(text, ".")
}
