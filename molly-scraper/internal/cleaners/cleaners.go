package cleaners

import (
	"regexp"
	"strings"
)

func RemoveSpecialCharacters(text string) string {
	return strings.ReplaceAll(text, "*", "")
}

func RemovePriceInfo(text string) string {
	costRX := regexp.MustCompile(`\(\$[^)]+\)`)
	matches := costRX.FindStringSubmatch(text)
	for _, match := range matches {
		text = strings.ReplaceAll(text, match, "")
	}
	return text
}
