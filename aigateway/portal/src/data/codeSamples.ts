import type { CodeSample } from '@/types'

export const codeSamples: CodeSample[] = [
  {
    lang: 'python',
    label: 'Python SDK',
    filename: 'client.py',
    code: `from openai import OpenAI

client = OpenAI(
    api_key="nv_sk-xxxxxxxxxxxxxxxx",
    base_url="http://api.starnov.cn/v1"
)

# 智能路由至最优模型
response = client.chat.completions.create(
    model="deepseek-r1",  # 自动故障切换
    messages=[{"role": "user", "content": "Hello"}]
)
print(response.choices[0].message.content)`,
  },
  {
    lang: 'javascript',
    label: 'JavaScript SDK',
    filename: 'client.js',
    code: `import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: "nv_sk-xxxxxxxxxxxxxxxx",
    baseURL: "http://api.starnov.cn/v1"
});

// 智能路由至最优模型
const response = await client.chat.completions.create({
    model: "deepseek-r1",  // 自动故障切换
    messages: [{ role: "user", content: "Hello" }]
});
console.log(response.choices[0].message.content);`,
  },
  {
    lang: 'curl',
    label: 'cURL',
    filename: 'request.sh',
    code: `curl http://api.starnov.cn/v1/chat/completions \\
  -H "Authorization: Bearer nv_sk-xxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-r1",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,
  },
  {
    lang: 'go',
    label: 'Go SDK',
    filename: 'client.go',
    code: `package main

import (
    "context"
    openai "github.com/sashabaranov/go-openai"
)

func main() {
    client := openai.NewClientWithConfig(
        openai.DefaultConfig(
            "nv_sk-xxxxxxxxxxxxxxxx",
            "http://api.starnov.cn/v1",
        ),
    )

    resp, _ := client.CreateChatCompletion(
        context.Background(),
        openai.ChatCompletionRequest{
            Model: "deepseek-r1",
            Messages: []openai.ChatCompletionMessage{
                {Role: "user", Content: "Hello"},
            },
        },
    )
    println(resp.Choices[0].Message.Content)
}`,
  },
]
