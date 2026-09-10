package service

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/provider"
)

func TestEndpointForProtocolOpenAIAuthType(t *testing.T) {
	tests := []struct {
		name     string
		authType string
		want     string
	}{
		{name: "显式 bearer", authType: "bearer", want: "bearer"},
		{name: "显式 api_key", authType: "api_key", want: "api_key"},
		{name: "空值回退 bearer", authType: "", want: "bearer"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &entity.Provider{BaseURL: "https://api.openai.com", AuthType: tt.authType}
			_, _, _, authType, ok := endpointForProtocol(p, provider.ProtocolOpenAI)
			if !ok {
				t.Fatalf("ok = false, want true")
			}
			if authType != tt.want {
				t.Fatalf("authType = %q, want %q", authType, tt.want)
			}
		})
	}
}

func TestEndpointForProtocolOpenAIMissingEndpoint(t *testing.T) {
	p := &entity.Provider{AnthropicBaseURL: "https://ant.example.com"}
	if _, _, _, _, ok := endpointForProtocol(p, provider.ProtocolOpenAI); ok {
		t.Fatalf("ok = true, want false（未配置 OpenAI 端点）")
	}
}

func TestCallProviderOpenAIAuthHeaders(t *testing.T) {
	tests := []struct {
		name         string
		authType     string
		wantHeader   string
		wantValue    string
		wantNoHeader string
	}{
		{
			name:         "authType=api_key → x-api-key",
			authType:     "api_key",
			wantHeader:   "x-api-key",
			wantValue:    "sk-oaikey",
			wantNoHeader: "Authorization",
		},
		{
			name:         "authType=bearer → Authorization",
			authType:     "bearer",
			wantHeader:   "Authorization",
			wantValue:    "Bearer sk-oaikey",
			wantNoHeader: "x-api-key",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var got http.Header
			srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				got = r.Header.Clone()
				w.WriteHeader(http.StatusOK)
			}))
			defer srv.Close()

			svc := &RouterService{
				httpClient: &http.Client{},
				logger:     slog.New(slog.NewTextHandler(io.Discard, nil)),
			}
			target := &ProviderTarget{
				BaseURL:        srv.URL,
				APIPath:        "/v1/chat/completions",
				ProviderAPIKey: "sk-oaikey",
				ProtocolType:   provider.ProtocolOpenAI,
				AuthType:       tt.authType,
			}

			resp, err := svc.CallProvider(context.Background(), target, []byte(`{"model":"gpt-4o"}`))
			if err != nil {
				t.Fatalf("CallProvider() error = %v", err)
			}
			defer resp.Body.Close()

			if got.Get(tt.wantHeader) != tt.wantValue {
				t.Fatalf("%s = %q, want %q", tt.wantHeader, got.Get(tt.wantHeader), tt.wantValue)
			}
			if got.Get(tt.wantNoHeader) != "" {
				t.Fatalf("%s = %q, want empty", tt.wantNoHeader, got.Get(tt.wantNoHeader))
			}
		})
	}
}
