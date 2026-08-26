import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

/**
 * 可选 DeepSeek 开发代理（仅 dev 生效，用于「起点 Demo」自由输入问题的实时拆解生成）
 * - 配置方式：portal/.env.local 中设置 DEEPSEEK_API_KEY=sk-xxx
 * - 未配置时：GET /api/demo/live 返回 { enabled: false }，前端自动使用静态通用模板
 * - 生产构建（vite preview / 静态托管）下这些接口不存在，前端同样回退静态模板
 */
const deepseekDemoProxy = (deepseekApiKey: string): Plugin => ({
  name: 'deepseek-demo-proxy',
  configureServer(server) {
    server.middlewares.use('/api/demo/live', (_req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ enabled: !!deepseekApiKey }))
    })

    server.middlewares.use('/api/demo/analyze', async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      if (!deepseekApiKey) {
        res.statusCode = 501
        res.end(JSON.stringify({ source: 'unavailable' }))
        return
      }
      try {
        const chunks: Buffer[] = []
        req.on('data', (c) => chunks.push(Buffer.from(c)))
        await new Promise<void>((resolveEnd) => req.on('end', () => resolveEnd()))
        const body = Buffer.concat(chunks).toString('utf-8')
        const { topic } = JSON.parse(body || '{}')
        if (!topic || typeof topic !== 'string') {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'topic required' }))
          return
        }

        const prompt = `你是 Nova AI Gateway 的 Research Agent。用户提出了一个科研问题：
「${topic}」

请对其进行严谨的科研问题拆解，并输出严格 JSON（不要输出任何其他文字），结构如下：
{
  "topic": "${topic}",
  "domain": "识别的研究领域与交叉学科",
  "taskType": "科学问题类型（方法研究 / 实证研究 / 机理研究 等）",
  "subQuestions": ["子问题 1", "子问题 2", "子问题 3"],
  "variables": {
    "independent": [{"name": "自变量", "desc": "说明"}],
    "dependent": [{"name": "因变量", "desc": "说明"}],
    "control": [{"name": "控制变量", "desc": "说明"}]
  },
  "feasibility": {
    "data": 0-100 的数字,
    "method": 0-100 的数字,
    "compute": 0-100 的数字,
    "dataNote": "数据可得性说明",
    "methodNote": "方法匹配度说明",
    "computeNote": "算力评估说明"
  },
  "researchQuestion": "凝练出的主研究问题"
}
要求：专业、学术、贴合主题；subQuestions 恰好 3 条；independent/dependent/control 各 2-4 条。`

        const resp = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${deepseekApiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            temperature: 0.4,
            response_format: { type: 'json_object' },
            messages: [{ role: 'user', content: prompt }],
          }),
        })
        const json = (await resp.json()) as {
          choices?: { message?: { content?: string } }[]
        }
        const content = json?.choices?.[0]?.message?.content
        if (!content) throw new Error('DeepSeek 返回空内容')
        const parsed = JSON.parse(content)
        res.end(JSON.stringify({ source: 'deepseek', breakdown: parsed }))
      } catch (err) {
        res.statusCode = 500
        res.end(JSON.stringify({ source: 'error', error: String((err as Error)?.message || err) }))
      }
    })
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const deepseekApiKey = env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || ''

  return {
    plugins: [vue(), deepseekDemoProxy(deepseekApiKey)],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3001,
    },
  }
})
