package testutils

import (
	"errors"
	"reflect"
	"testing"
)

func AssertEqual[T comparable](t *testing.T, actual, expected T) {
	if actual != expected {
		t.Errorf("expected: %v; actual: %v\n", expected, actual)
	}
}

func AssertErrorsEqual(t *testing.T, actual, expected error) {
	if !errors.Is(actual, expected) {
		t.Errorf("expected: %v; actual: %v\n", expected, actual)
	}
}

func AssertSlicesEqual[S any](t *testing.T, actual, expected S) {
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("expected %v; actual: %v\n", expected, actual)
	}
}
