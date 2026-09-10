package service

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

func newTestProviderService() *ProviderService {
	return NewProviderService(
		repository.NewInMemoryProviderRepository(),
		slog.New(slog.NewTextHandler(io.Discard, nil)),
	)
}

func TestNormalizeProviderEndpointsAuthTypeDefault(t *testing.T) {
	tests := []struct {
		name     string
		provider *entity.Provider
		wantAuth string
	}{
		{
			name:     "仅 OpenAI 端点且未指定认证方式 → bearer",
			provider: &entity.Provider{ProviderName: "oai", BaseURL: "https://api.openai.com"},
			wantAuth: "bearer",
		},
		{
			name:     "仅 Anthropic 端点且未指定认证方式 → api_key",
			provider: &entity.Provider{ProviderName: "ant", AnthropicBaseURL: "https://ant.example.com"},
			wantAuth: "api_key",
		},
		{
			name:     "双端点且未指定认证方式 → bearer（OpenAI 端点优先推导）",
			provider: &entity.Provider{ProviderName: "dual", BaseURL: "https://api.openai.com", AnthropicBaseURL: "https://ant.example.com"},
			wantAuth: "bearer",
		},
		{
			name:     "显式指定 api_key 时不被覆盖",
			provider: &entity.Provider{ProviderName: "oai-xkey", BaseURL: "https://api.openai.com", AuthType: "api_key"},
			wantAuth: "api_key",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := normalizeProviderEndpoints(tt.provider); err != nil {
				t.Fatalf("normalizeProviderEndpoints() error = %v", err)
			}
			if tt.provider.AuthType != tt.wantAuth {
				t.Fatalf("AuthType = %q, want %q", tt.provider.AuthType, tt.wantAuth)
			}
		})
	}
}

func TestNormalizeProviderEndpointsRequiresOneEndpoint(t *testing.T) {
	err := normalizeProviderEndpoints(&entity.Provider{ProviderName: "empty"})
	if !errors.Is(err, ErrInvalidArgument) {
		t.Fatalf("error = %v, want ErrInvalidArgument", err)
	}
}

func TestTestEndpointReachability(t *testing.T) {
	svc := newTestProviderService()

	t.Run("HTTP 200 → 可达且认证通过", func(t *testing.T) {
		srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
		}))
		defer srv.Close()

		resp, err := svc.TestEndpoint(context.Background(), &dto.TestEndpointRequest{BaseURL: srv.URL})
		if err != nil {
			t.Fatalf("TestEndpoint() error = %v", err)
		}
		if !resp.Reachable || !resp.AuthOK || resp.StatusCode != http.StatusOK {
			t.Fatalf("resp = %+v, want reachable/authOk true, status 200", resp)
		}
	})

	t.Run("HTTP 401 → 可达但认证失败", func(t *testing.T) {
		srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusUnauthorized)
		}))
		defer srv.Close()

		resp, err := svc.TestEndpoint(context.Background(), &dto.TestEndpointRequest{BaseURL: srv.URL})
		if err != nil {
			t.Fatalf("TestEndpoint() error = %v", err)
		}
		if !resp.Reachable || resp.AuthOK {
			t.Fatalf("resp = %+v, want reachable true, authOk false", resp)
		}
		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("StatusCode = %d, want 401", resp.StatusCode)
		}
	})

	t.Run("HTTP 404 → 可达视为认证通过（未返回 401/403）", func(t *testing.T) {
		srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusNotFound)
		}))
		defer srv.Close()

		resp, err := svc.TestEndpoint(context.Background(), &dto.TestEndpointRequest{BaseURL: srv.URL})
		if err != nil {
			t.Fatalf("TestEndpoint() error = %v", err)
		}
		if !resp.Reachable || !resp.AuthOK {
			t.Fatalf("resp = %+v, want reachable/authOk true", resp)
		}
	})

	t.Run("连接被拒绝 → 不可达", func(t *testing.T) {
		srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))
		srv.Close() // 关闭后端口不再监听

		resp, err := svc.TestEndpoint(context.Background(), &dto.TestEndpointRequest{BaseURL: srv.URL})
		if err != nil {
			t.Fatalf("TestEndpoint() error = %v", err)
		}
		if resp.Reachable || resp.AuthOK {
			t.Fatalf("resp = %+v, want reachable/authOk false", resp)
		}
	})
}

func TestTestEndpointAuthHeaders(t *testing.T) {
	svc := newTestProviderService()

	tests := []struct {
		name         string
		protocol     string
		authType     string
		wantHeader   string
		wantValue    string
		wantNoHeader string
	}{
		{
			name:         "OpenAI + bearer",
			protocol:     "openai",
			authType:     "bearer",
			wantHeader:   "Authorization",
			wantValue:    "Bearer sk-test",
			wantNoHeader: "x-api-key",
		},
		{
			name:         "OpenAI + api_key",
			protocol:     "openai",
			authType:     "api_key",
			wantHeader:   "x-api-key",
			wantValue:    "sk-test",
			wantNoHeader: "Authorization",
		},
		{
			name:         "Anthropic + api_key",
			protocol:     "anthropic",
			authType:     "api_key",
			wantHeader:   "x-api-key",
			wantValue:    "sk-test",
			wantNoHeader: "Authorization",
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

			if _, err := svc.TestEndpoint(context.Background(), &dto.TestEndpointRequest{
				Protocol:  tt.protocol,
				BaseURL:   srv.URL,
				AuthType:  tt.authType,
				APIKeyRef: "sk-test",
			}); err != nil {
				t.Fatalf("TestEndpoint() error = %v", err)
			}

			if got.Get(tt.wantHeader) != tt.wantValue {
				t.Fatalf("%s = %q, want %q", tt.wantHeader, got.Get(tt.wantHeader), tt.wantValue)
			}
			if got.Get(tt.wantNoHeader) != "" {
				t.Fatalf("%s = %q, want empty", tt.wantNoHeader, got.Get(tt.wantNoHeader))
			}
			if tt.protocol == "anthropic" && got.Get("anthropic-version") == "" {
				t.Fatalf("anthropic-version header missing")
			}
		})
	}
}

func TestTestEndpointRejectsInvalidBaseURL(t *testing.T) {
	svc := newTestProviderService()

	for _, baseURL := range []string{"", "   ", "ftp://example.com", "api.openai.com"} {
		t.Run(baseURL, func(t *testing.T) {
			_, err := svc.TestEndpoint(context.Background(), &dto.TestEndpointRequest{BaseURL: baseURL})
			if !errors.Is(err, ErrInvalidArgument) {
				t.Fatalf("error = %v, want ErrInvalidArgument", err)
			}
		})
	}
}
