package testutils

import "testing"

func AssertEqual[T comparable](t *testing.T, actual, expected T) {
	t.Helper()
	if actual != expected {
		t.Errorf("got: %v; expected: %v\n", actual, expected)
	}
}
