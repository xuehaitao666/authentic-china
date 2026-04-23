const axios = require('axios');

const SYSTEM_PROMPT = `
你叫"国风小伴"，是一个专门为游客介绍中国各地的历史文化、风景名胜、风土人情的智能导游。
你的性格温文尔雅，富有诗书气。在回答用户问题时，可以适当引用中国古诗词或者典故，但语言要尽量简洁通俗，不要长篇大论。
请注意你的身份，你只回答和旅游、中国文化、历史相关的内容。如果用户问无关内容，请以国风小伴的口吻委婉拒绝。
`;

exports.chat = async (req, res) => {
  const { messages } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: '请提供有效的消息数组' });
  }

  const apiKey = process.env.AI_API_KEY;
  
  // 如果没有配置API Key，提供优雅的 Mock 降级体验
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.log('[AI Controller] AI_API_KEY 未配置，返回模拟数据...');
    const userMessage = messages[messages.length - 1].content;
    let mockResponse = '你好呀！我是“国风小伴”。很高兴能在这次旅途中为你做向导。\n\n(提示：由于后端未配置 AI_API_KEY，当前为演示模式回复。请去硅基流动或智谱AI申请免费的Key，并在百度的 `.env` 中配置以激活真实的大语言模型。)';
    
    if (userMessage.includes('北京') || userMessage.includes('故宫')) {
      mockResponse = '说起北京故宫，那可是“紫禁城中一线穿，观宫看院百重关”。它是明清两朝的皇宫，见证了无数历史的沧桑与辉煌。建议你穿上汉服去那里走走，随手一拍就是大片哦！需要我帮你规划一条故宫的游览路线吗？\n\n(当前为离线演示模式)';
    } else if (userMessage.includes('孔明灯')) {
      mockResponse = '孔明灯，又叫祈明灯或者天灯，相传是由三国时的诸葛孔明所发明。它承载着人们对美好的祈愿与祝福，缓缓升空，就如同将希望寄托于熠熠星河之中。\n\n(当前为离线演示模式)';
    }

    return res.json({
      choices: [
        {
          message: {
            role: 'assistant',
            content: mockResponse
          }
        }
      ]
    });
  }

  const baseURL = process.env.AI_BASE_URL || 'https://api.siliconflow.cn/v1/chat/completions';
  const model = process.env.AI_MODEL || 'Qwen/Qwen2.5-7B-Instruct';

  try {
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await axios.post(
      baseURL,
      {
        model: model,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 512,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('[AI Controller] 调用大模型API失败:', error.response?.data || error.message);
    res.status(500).json({ error: '小伴发呆了，请稍后再试。' });
  }
};
