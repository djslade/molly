package recipes

import (
	"fmt"
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
		fmt.Println("Cannot parse unit: ", text)
		return ""
	}
}

func ParseIsOptional(text string) bool {
	return strings.Contains(strings.ToLower(text), "optional")
}

func ParseTimer(text string) Timer {
	timerRX := regexp.MustCompile(`(\d+).+(minute|second|hour)`)
	matches := timerRX.FindStringSubmatch(text)
	if len(matches) < 3 {
		return Timer{}
	}

	value, _ := strconv.Atoi(matches[len(matches)-2])
	unit := matches[len(matches)-1]

	if value == 0 || unit == "" {
		return Timer{}
	}

	return Timer{
		Value: value,
		Unit:  unit,
	}
}
