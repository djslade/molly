package scraper

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func getHTMLAsString(rawURL string) (string, error) {
	rs, err := http.Get(rawURL)
	if err != nil {
		return "", err
	}

	if rs.StatusCode >= 400 {
		fmt.Println(rs.Status)
		fmt.Println(rs.StatusCode)
		return "", errors.New("URL responded with an error")
	}

	if !strings.Contains(rs.Header.Get("Content-Type"), "text/html") {
		return "", errors.New("the response is not valid HTML")
	}

	defer rs.Body.Close()
	body, err := io.ReadAll(rs.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

func parseHTML(htmlBody string) (*goquery.Document, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(htmlBody))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func GetDocument(rawURL string) (*goquery.Document, error) {
	body, err := getHTMLAsString(rawURL)
	if err != nil {
		return nil, err
	}

	doc, err := parseHTML(body)
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func FindSelectionFromDocument(doc *goquery.Document, selector string) *goquery.Selection {
	return doc.Find(selector)
}

func FindSelection(src *goquery.Selection, selector string) *goquery.Selection {
	return src.Find(selector)
}
