package main

import (
	"encoding/json"
	"errors"
	"maps"
	"net/http"
	"net/url"
	"path"
	"strings"
)

type responseError struct {
	Message string `json:"message"`
}

var (
	errServer     error = errors.New("the server encountered a problem and could not process your request")
	errInvalidUrl error = errors.New("invalid URL")
)

func (app *application) writeJSON(w http.ResponseWriter, status int, data interface{}, headers http.Header) {
	js, err := json.Marshal(data)
	if err != nil {
		app.logger.Println(err)
		http.Error(w, errServer.Error(), http.StatusInternalServerError)
	}

	maps.Copy(headers, w.Header())

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)
}

func (app *application) clientError(w http.ResponseWriter, status int, err error) {
	pl := responseError{
		Message: err.Error(),
	}

	app.writeJSON(w, status, pl, nil)
}

func (app *application) serverError(w http.ResponseWriter, err error) {
	app.logger.Println(err.Error())

	app.clientError(w, http.StatusInternalServerError, errServer)
}

func (app *application) normalizeUrl(s string) (string, error) {
	parsed, err := url.Parse(s)
	if err != nil {
		return "", errInvalidUrl
	}
	if parsed.Scheme == "" || parsed.Host == "" {
		return "", errInvalidUrl
	}

	normalized := parsed.Host + parsed.Path

	return strings.ToLower(path.Clean(normalized)), nil
}
