package provider

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"aigateway/backend/internal/entity"
)

// ImageProviderAdapter defines the interface for image generation provider adapters.
type ImageProviderAdapter interface {
	// Generate sends an image generation request to the provider and returns the result.
	Generate(ctx context.Context, provider *entity.Provider, req *ImageGenerateRequest) (*ImageGenerateResponse, error)
}

// ImageGenerateRequest is the unified image generation request.
type ImageGenerateRequest struct {
	Model          string
	Prompt         string
	N              int
	Size           string
	ResponseFormat string
	User           string
}

// ImageGenerateResponse is the unified image generation response from a provider.
type ImageGenerateResponse struct {
	Created int64
	Data    []ImageResult
	Usage   *ImageUsage
}

// ImageResult represents a single generated image.
type ImageResult struct {
	URL           string `json:"url,omitempty"`
	B64JSON       string `json:"b64_json,omitempty"`
	RevisedPrompt string `json:"revised_prompt,omitempty"`
}

// ImageUsage contains usage information for billing.
type ImageUsage struct {
	PromptTokens int `json:"prompt_tokens"`
	TotalTokens  int `json:"total_tokens"`
	ImageCount   int `json:"image_count"`
}

// HTTPImageAdapter is a generic HTTP-based image provider adapter that:
// 1. Converts the unified request to the provider's native format
// 2. Sends an HTTP POST to the provider
// 3. Converts the provider's native response back to the unified format
type HTTPImageAdapter struct {
	httpClient       *http.Client
	requestBuilder   func(req *ImageGenerateRequest) ([]byte, error)
	responseParser   func(body []byte) (*ImageGenerateResponse, error)
}

// NewHTTPImageAdapter creates a new HTTPImageAdapter with the given request builder and response parser.
func NewHTTPImageAdapter(
	httpClient *http.Client,
	requestBuilder func(req *ImageGenerateRequest) ([]byte, error),
	responseParser func(body []byte) (*ImageGenerateResponse, error),
) *HTTPImageAdapter {
	return &HTTPImageAdapter{
		httpClient:     httpClient,
		requestBuilder: requestBuilder,
		responseParser: responseParser,
	}
}

// Generate sends the image generation request via HTTP POST.
func (a *HTTPImageAdapter) Generate(ctx context.Context, provider *entity.Provider, req *ImageGenerateRequest) (*ImageGenerateResponse, error) {
	bodyBytes, err := a.requestBuilder(req)
	if err != nil {
		return nil, fmt.Errorf("failed to build request: %w", err)
	}

	apiPath := provider.APIPath
	if apiPath == "" {
		apiPath = "/v1/images/generations"
	}
	url := strings.TrimRight(provider.BaseURL, "/") + apiPath

	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("failed to create HTTP request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+provider.APIKeyRef)

	resp, err := a.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("provider request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read provider response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("provider returned error status %d: %s", resp.StatusCode, string(respBody))
	}

	result, err := a.responseParser(respBody)
	if err != nil {
		return nil, fmt.Errorf("failed to parse provider response: %w", err)
	}

	if result.Created == 0 {
		result.Created = time.Now().Unix()
	}

	return result, nil
}

// ---------- OpenAI-compatible request/response builders ----------

// OpenAI-compatible image generation request body
type openAIImageRequest struct {
	Model          string `json:"model"`
	Prompt         string `json:"prompt"`
	N              *int   `json:"n,omitempty"`
	Size           string `json:"size,omitempty"`
	ResponseFormat string `json:"response_format,omitempty"`
	User           string `json:"user,omitempty"`
}

// OpenAI-compatible image generation response body
type openAIImageResponse struct {
	Created int64            `json:"created"`
	Data    []openAIImageData `json:"data"`
	Usage   *openAIImageUsage `json:"usage,omitempty"`
}

type openAIImageData struct {
	URL           string `json:"url,omitempty"`
	B64JSON       string `json:"b64_json,omitempty"`
	RevisedPrompt string `json:"revised_prompt,omitempty"`
}

type openAIImageUsage struct {
	PromptTokens int `json:"prompt_tokens"`
	TotalTokens  int `json:"total_tokens"`
}

// BuildOpenAIRequest builds a request body in OpenAI-compatible format.
func BuildOpenAIRequest(req *ImageGenerateRequest) ([]byte, error) {
	n := req.N
	openAIReq := openAIImageRequest{
		Model:          req.Model,
		Prompt:         req.Prompt,
		N:              &n,
		Size:           req.Size,
		ResponseFormat: req.ResponseFormat,
		User:           req.User,
	}
	return json.Marshal(openAIReq)
}

// ParseOpenAIResponse parses an OpenAI-compatible response body.
func ParseOpenAIResponse(body []byte) (*ImageGenerateResponse, error) {
	var openAIResp openAIImageResponse
	if err := json.Unmarshal(body, &openAIResp); err != nil {
		return nil, err
	}

	result := &ImageGenerateResponse{
		Created: openAIResp.Created,
		Data:    make([]ImageResult, len(openAIResp.Data)),
	}

	for i, d := range openAIResp.Data {
		result.Data[i] = ImageResult{
			URL:           d.URL,
			B64JSON:       d.B64JSON,
			RevisedPrompt: d.RevisedPrompt,
		}
	}

	if openAIResp.Usage != nil {
		result.Usage = &ImageUsage{
			PromptTokens: openAIResp.Usage.PromptTokens,
			TotalTokens:  openAIResp.Usage.TotalTokens,
			ImageCount:   len(openAIResp.Data),
		}
	} else {
		result.Usage = &ImageUsage{
			ImageCount: len(openAIResp.Data),
		}
	}

	return result, nil
}

// NewOpenAICompatibleAdapter creates an HTTPImageAdapter that uses OpenAI-compatible request/response formats.
func NewOpenAICompatibleAdapter(httpClient *http.Client) *HTTPImageAdapter {
	return NewHTTPImageAdapter(httpClient, BuildOpenAIRequest, ParseOpenAIResponse)
}
