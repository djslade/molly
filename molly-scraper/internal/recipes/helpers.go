package recipes

import (
	"regexp"
	"strconv"
	"strings"
)

func ParseQuantity(text string) float64 {
	quantity, err := strconv.ParseFloat(text, 64)
	if err == nil {
		return quantity
	}

	fractionRX := regexp.MustCompile(`(\d+)/(\d+)`)
	matches := fractionRX.FindStringSubmatch(text)
	if len(matches) == 3 {
		if matches[1] != "0" && matches[2] != "0" {
			num, _ := strconv.ParseFloat(matches[1], 64)
			den, _ := strconv.ParseFloat(matches[2], 64)
			return num / den
		}
	}

	switch strings.ToLower(text) {
	case "half":
		return 0.5
	case "third":
		return 0.3
	case "two thirds":
		return 0.6
	default:
		return 0
	}
}

func ParseUnit(text string) string {
	switch strings.ToLower(text) {
	case "tablespoons", "tablespoon", "tbspn":
		return "tablespoon"
	case "teaspoons", "teaspoon", "tspn":
		return "teaspoon"
	case "sticks", "stick":
		return "stick"
	case "cups", "cup":
		return "cup"
	case "oz", "oz.", "ounce", "ounces":
		return "ounce"
	case "lb", "lbs", "pound", "pounds":
		return "pound"
	case "grams", "gram", "g":
		return "gram"
	case "kilos", "kilo", "kilograms", "kilogram", "kg", "kgs":
		return "kilogram"
	case "mililitres", "mililitre", "mililiters", "mililiter", "ml", "mls", "mils":
		return "mililitre"
	case "litre", "litres", "liter", "liters", "l", "ls":
		return "litre"
	default:
		return text
	}
}

func ParseIsOptional(text string) bool {
	return strings.Contains(strings.ToLower(text), "optional")
}

func ParseTimerRequired(text string) bool {
	timerRX := regexp.MustCompile(`(\d+).+(minute|second|hour)`)
	matches := timerRX.FindStringSubmatch(text)
	return len(matches) >= 3
}
