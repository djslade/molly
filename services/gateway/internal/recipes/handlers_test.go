package recipes

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHandlerGetRecipe(t *testing.T) {
	t.Run("writes correct Content-Type to header", func(t *testing.T) {
		request, _ := http.NewRequest(http.MethodGet, "/recipes/1", nil)
		response := httptest.NewRecorder()

		HandlerGetRecipe(response, request)

		assertCorrectContentType(t, response)
	})

	t.Run("returns 404 if recipe not found", func(t *testing.T) {
		request, _ := http.NewRequest(http.MethodGet, "/recipes/notfound", nil)
		response := httptest.NewRecorder()

		HandlerGetRecipe(response, request)

		assertCorrectContentType(t, response)

		got := response.Code
		want := http.StatusNotFound

		if got != want {
			t.Errorf("test failed, status code is %q want %q", got, want)
		}

	})
}

func assertCorrectContentType(t *testing.T, w http.ResponseWriter) {
	t.Helper()
	got := w.Header().Get("Content-Type")
	want := "application/json"

	if got != want {
		t.Errorf("test failed, Content-Type is %q want %q", got, want)
	}
}
