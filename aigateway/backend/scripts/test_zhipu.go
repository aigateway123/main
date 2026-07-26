// +build ignore
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

func main() {
	// 1. Test direct Zhipu API call
	body := `{"model":"glm-4-flash","messages":[{"role":"user","content":"hi"}]}`
	req, _ := http.NewRequest("POST", "https://open.bigmodel.cn/api/paas/v4/chat/completions", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer c05faa2ff5e54cafa2522f5ed95d20a2.BWW8mx6XWWq4Xpw3")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("DIRECT ZHIPU CALL FAILED: %v\n", err)
		os.Exit(1)
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		fmt.Printf("DIRECT ZHIPU HTTP %d: %s\n", resp.StatusCode, string(b[:min(200,len(b))]))
		os.Exit(1)
	}
	fmt.Printf("DIRECT ZHIPU OK: %s\n", string(b[:min(150,len(b))]))

	// 2. Now fix provider via gateway
	adminToken := os.Args[1] // pass token as arg
	updateBody := `{"providerName":"Zhipu","baseUrl":"https://open.bigmodel.cn","apiPath":"/api/paas/v4/chat/completions","apiKeyRef":"c05faa2ff5e54cafa2522f5ed95d20a2.BWW8mx6XWWq4Xpw3","priority":100,"weight":100,"isEnabledFlag":true}`
	req2, _ := http.NewRequest("PUT", "http://localhost:8080/api/v1/providers/4", bytes.NewBufferString(updateBody))
	req2.Header.Set("Content-Type", "application/json")
	req2.Header.Set("Authorization", "Bearer "+adminToken)
	resp2, _ := client.Do(req2)
	b2, _ := io.ReadAll(resp2.Body)
	resp2.Body.Close()
	
	var result struct {
		Data struct {
			BaseURL string `json:"baseUrl"`
		} `json:"data"`
	}
	json.Unmarshal(b2, &result)
	hasBq := strings.Contains(result.Data.BaseURL, "`")
	fmt.Printf("PROVIDER UPDATE: baseUrl=%s hasBacktick=%v\n", result.Data.BaseURL, hasBq)
}

func min(a, b int) int { if a < b { return a }; return b }
