import nextConnect from 'next-connect';
import multer from 'multer';
import { translateSubtitles, parseSRT, convertToSRT } from '../../lib/speech';
import fs from 'fs';

const upload = multer({ dest: '/tmp' });

const handler = nextConnect();

handler.use(upload.single('subtitle'));

handler.post(async (req, res) => {
  try {
    const { targetLanguage } = req.body;
    
    // 检查是否上传了文件
    if (!req.file) {
      return res.status(400).json({ error: '请上传字幕文件' });
    }
    
    // 检查是否指定了目标语言
    if (!targetLanguage) {
      return res.status(400).json({ error: '请指定目标语言' });
    }
    
    // 读取字幕文件内容
    const srtContent = fs.readFileSync(req.file.path, 'utf-8');
    
    // 解析 SRT 字幕
    const subtitles = parseSRT(srtContent);
    
    // 翻译字幕
    // 注意：在实际实现中，您需要实现 translateSubtitles 函数来调用翻译 API
    const translatedSubtitles = subtitles.map(subtitle => ({
      ...subtitle,
      text: `Translated: ${subtitle.text}` // 示例翻译
    }));
    
    // 转换为 SRT 格式
    const translatedSRT = convertToSRT(translatedSubtitles);
    
    // 设置响应头以下载文件
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename=translated-subtitles-${targetLanguage}.srt`);
    
    // 返回翻译后的字幕文件
    res.status(200).send(translatedSRT);
    
    // 清理临时文件
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '字幕翻译失败' });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;